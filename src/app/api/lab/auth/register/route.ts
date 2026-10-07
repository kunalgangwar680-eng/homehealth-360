import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const registerSchema = z
  .object({
    labName: z
      .string()
      .trim()
      .min(2, "Lab name is required.")
      .max(120, "Lab name is too long."),

    ownerName: z
      .string()
      .trim()
      .min(2, "Owner / Manager name is required.")
      .max(120, "Owner / Manager name is too long."),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Enter a valid email address."),

    phone: z
      .string()
      .trim()
      .regex(/^\d{10}$/, "Enter a valid 10-digit mobile number."),

    address: z
      .string()
      .trim()
      .min(5, "Lab address is required.")
      .max(500, "Address is too long."),

    area: z
      .string()
      .trim()
      .min(2, "Area is required.")
      .max(120, "Area name is too long."),

    city: z
      .string()
      .trim()
      .min(2, "City is required.")
      .max(100, "City name is too long."),

    pincode: z
      .string()
      .trim()
      .regex(/^\d{6}$/, "Enter a valid 6-digit pincode."),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(128, "Password is too long."),

    confirmPassword: z
      .string()
      .min(8, "Confirm password is required.")
      .max(128, "Password is too long."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

function generateLabId() {
  const randomPart = randomBytes(5)
    .toString("hex")
    .toUpperCase();

  return `LAB-${randomPart}`;
}

async function createUniqueLabId() {
  for (let attempt = 0; attempt < 10; attempt++) {
    const labId = generateLabId();

    const existingLab = await prisma.lab.findUnique({
      where: {
        labId,
      },
      select: {
        id: true,
      },
    });

    if (!existingLab) {
      return labId;
    }
  }

  throw new Error("Unable to generate a unique Lab ID.");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error:
            result.error.issues[0]?.message ||
            "Invalid registration details.",
        },
        { status: 400 }
      );
    }

    const {
      labName,
      ownerName,
      email,
      phone,
      address,
      area,
      city,
      pincode,
      password,
    } = result.data;

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.replace(/\D/g, "");
    const normalizedPincode = pincode.trim();

    /*
     * Check whether the email is already used.
     */
    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error:
            "An account with this email address already exists.",
        },
        { status: 409 }
      );
    }

    /*
     * Generate the Lab ID before creating the transaction.
     */
    const labId = await createUniqueLabId();

    /*
     * Never store the raw password.
     */
    const passwordHash = await bcrypt.hash(password, 12);

    /*
     * Create User + Lab together.
     *
     * User:
     * - role = LAB
     * - email/password used for authentication
     *
     * Lab:
     * - profile data
     * - generated Lab ID
     * - area/city/pincode for future area-wise discovery
     */
    const created = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: labName,
          email: normalizedEmail,
          passwordHash,
          phone: normalizedPhone,
          role: "LAB",
        },
      });

      const lab = await tx.lab.create({
        data: {
          userId: user.id,
          labId,

          labName,
          ownerName,
          phone: normalizedPhone,

          address,
          area,
          city,
          pincode: normalizedPincode,

          homeCollection: true,

          /*
           * New labs start as pending.
           * Later an admin can approve them.
           */
          verificationStatus: "PENDING",

          active: true,
        },
      });

      return {
        user,
        lab,
      };
    });

    return NextResponse.json(
      {
        success: true,
        message: "Lab account created successfully.",

        lab: {
          id: created.lab.id,
          labId: created.lab.labId,
          labName: created.lab.labName,
          ownerName: created.lab.ownerName,
          email: created.user.email,
          phone: created.lab.phone,
          address: created.lab.address,
          area: created.lab.area,
          city: created.lab.city,
          pincode: created.lab.pincode,
          homeCollection: created.lab.homeCollection,
          verificationStatus:
            created.lab.verificationStatus,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("LAB REGISTRATION ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while creating the lab account.",
      },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export const runtime = "nodejs";

const loginSchema = z.object({
  labId: z.string().trim().min(1, "Lab ID is required."),
  password: z.string().min(1, "Password is required."),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error:
            parsed.error.issues[0]?.message ||
            "Invalid login details.",
        },
        { status: 400 }
      );
    }

    const { labId, password } = parsed.data;

    const normalizedLabId = labId.trim().toUpperCase();

    const lab = await prisma.lab.findUnique({
      where: {
        labId: normalizedLabId,
      },
      include: {
        user: true,
      },
    });

    if (!lab) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Lab ID or password.",
        },
        { status: 401 }
      );
    }

    if (!lab.user) {
      return NextResponse.json(
        {
          success: false,
          error: "Lab account is not properly configured.",
        },
        { status: 500 }
      );
    }

    if (lab.user.role !== "LAB") {
      return NextResponse.json(
        {
          success: false,
          error: "This account is not a lab account.",
        },
        { status: 403 }
      );
    }

    if (!lab.active) {
      return NextResponse.json(
        {
          success: false,
          error: "This lab account is currently inactive.",
        },
        { status: 403 }
      );
    }

    const passwordMatches = await bcrypt.compare(
      password,
      lab.user.passwordHash
    );

    if (!passwordMatches) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Lab ID or password.",
        },
        { status: 401 }
      );
    }

    await createSession(
      lab.user.id,
      lab.user.role
    );

    return NextResponse.json({
      success: true,
      user: {
        id: lab.user.id,
        name: lab.user.name,
        email: lab.user.email,
        phone: lab.user.phone,
        role: lab.user.role,
      },
      lab: {
        id: lab.id,
        labId: lab.labId,
        labName: lab.labName,
        ownerName: lab.ownerName,
        phone: lab.phone,
        address: lab.address,
        area: lab.area,
        city: lab.city,
        pincode: lab.pincode,
        homeCollection: lab.homeCollection,
        verificationStatus: lab.verificationStatus,
        active: lab.active,
      },
    });
  } catch (error) {
    console.error("LAB LOGIN ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong while logging in.",
      },
      { status: 500 }
    );
  }
}
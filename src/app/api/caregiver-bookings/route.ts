import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const caregiverBookingSchema = z.object({
  patientName: z.string().min(2),
  phone: z.string().min(10),
  address: z.string().min(5),
  service: z.string().min(1),
  caregiver: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  notes: z.string().optional(),
});

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const bookings = await prisma.caregiverBooking.findMany({
      where:
        session.role === "ADMIN"
          ? {}
          : {
              patientId: session.userId,
            },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("CAREGIVER BOOKINGS GET ERROR:", error);

    return NextResponse.json(
      {
        error: "Something went wrong while loading caregiver bookings.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const result = caregiverBookingSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error:
            "Patient name, phone, address, service, caregiver, date and time are required.",
        },
        { status: 400 }
      );
    }

    const {
      patientName,
      phone,
      address,
      service,
      caregiver,
      date,
      time,
      notes,
    } = result.data;

    const booking = await prisma.caregiverBooking.create({
      data: {
        patientId: session.userId,
        patientName: patientName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        service: service.trim(),
        caregiver: caregiver.trim(),
        date,
        time,
        notes: notes?.trim() || null,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Caregiver booking created successfully.",
        booking,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CAREGIVER BOOKING CREATE ERROR:", error);

    return NextResponse.json(
      {
        error:
          "Something went wrong while creating the caregiver booking.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "Not authenticated",
        },
        { status: 401 }
      );
    }

    if (session.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: "Admin access required",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const { id, status } = body;

    const allowedStatuses = [
      "PENDING",
      "CONFIRMED",
      "CANCELLED",
      "COMPLETED",
    ];

    if (!id || !status) {
      return NextResponse.json(
        {
          success: false,
          error: "Booking ID and status are required",
        },
        { status: 400 }
      );
    }

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid booking status",
        },
        { status: 400 }
      );
    }

    const existingBooking =
      await prisma.caregiverBooking.findUnique({
        where: {
          id,
        },
      });

    if (!existingBooking) {
      return NextResponse.json(
        {
          success: false,
          error: "Caregiver booking not found",
        },
        { status: 404 }
      );
    }

    const booking = await prisma.caregiverBooking.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Booking ${status.toLowerCase()} successfully`,
      booking,
    });
  } catch (error) {
    console.error("CAREGIVER BOOKING UPDATE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong while updating booking.",
      },
      { status: 500 }
    );
  }
}
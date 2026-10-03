import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const bookings = await prisma.labBooking.findMany({
      where:
        session.role === "ADMIN"
          ? {}
          : { patientId: session.userId },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("GET LAB BOOKINGS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load lab bookings",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const {
      patientName,
      mobile,
      address,
      testNames,
      date,
      time,
    } = body;

    if (
      !patientName ||
      !mobile ||
      !address ||
      !testNames ||
      !date ||
      !time
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    const booking = await prisma.labBooking.create({
      data: {
        patientId: session.userId,
        patientName,
        mobile,
        address,
        testNames,
        date,
        time,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Lab booking created successfully",
        booking,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE LAB BOOKING ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create lab booking",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    if (session.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required",
        },
        { status: 403 }
      );
    }

    const body = await req.json();

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
          message: "Booking ID and status are required",
        },
        { status: 400 }
      );
    }

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid booking status",
        },
        { status: 400 }
      );
    }

    const booking = await prisma.labBooking.update({
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
    console.error("UPDATE LAB BOOKING ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update booking",
      },
      { status: 500 }
    );
  }
}
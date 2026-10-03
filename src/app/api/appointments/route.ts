import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const appointmentSchema = z.object({
  doctorId: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
});

// GET — Logged-in patient's appointments
export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        {
          error: "Not authenticated",
        },
        { status: 401 }
      );
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        patientId: session.userId,
      },
      include: {
        doctor: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("APPOINTMENTS GET ERROR:", error);

    return NextResponse.json(
      {
        error:
          "Something went wrong while loading appointments.",
      },
      { status: 500 }
    );
  }
}

// POST — Create appointment
export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        {
          error: "Not authenticated",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const result = appointmentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Doctor, date and time are required.",
        },
        { status: 400 }
      );
    }

    const { doctorId, date, time } = result.data;

    // Check doctor
    const doctor = await prisma.doctor.findUnique({
      where: {
        id: doctorId,
      },
    });

    if (!doctor) {
      return NextResponse.json(
        {
          error: "Doctor not found.",
        },
        { status: 404 }
      );
    }

    // Check doctor availability
    if (!doctor.available) {
      return NextResponse.json(
        {
          error:
            "This doctor is currently unavailable.",
        },
        { status: 400 }
      );
    }

    // Check if this slot is already booked
    const existingAppointment =
      await prisma.appointment.findFirst({
        where: {
          doctorId,
          date,
          time,
          status: {
            in: ["PENDING", "CONFIRMED"],
          },
        },
      });

    if (existingAppointment) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This time slot is already booked. Please select another time.",
        },
        { status: 409 }
      );
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        patientId: session.userId,
        doctorId,
        date,
        time,
        status: "PENDING",
      },
      include: {
        doctor: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Appointment booked successfully.",
        appointment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "APPOINTMENT CREATE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while booking the appointment.",
      },
      { status: 500 }
    );
  }
}

// PATCH — Cancel appointment
export async function PATCH(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        {
          error: "Not authenticated",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const appointmentId = body?.appointmentId;

    if (
      !appointmentId ||
      typeof appointmentId !== "string"
    ) {
      return NextResponse.json(
        {
          error: "Appointment ID is required.",
        },
        { status: 400 }
      );
    }

    // Find appointment belonging to logged-in patient
    const appointment =
      await prisma.appointment.findFirst({
        where: {
          id: appointmentId,
          patientId: session.userId,
        },
      });

    if (!appointment) {
      return NextResponse.json(
        {
          error: "Appointment not found.",
        },
        { status: 404 }
      );
    }

    // Already cancelled
    if (appointment.status === "CANCELLED") {
      return NextResponse.json(
        {
          error:
            "This appointment is already cancelled.",
        },
        { status: 400 }
      );
    }

    // Completed appointment cannot be cancelled
    if (appointment.status === "COMPLETED") {
      return NextResponse.json(
        {
          error:
            "Completed appointments cannot be cancelled.",
        },
        { status: 400 }
      );
    }

    // Cancel appointment
    const updatedAppointment =
      await prisma.appointment.update({
        where: {
          id: appointment.id,
        },
        data: {
          status: "CANCELLED",
        },
        include: {
          doctor: true,
        },
      });

    return NextResponse.json({
      success: true,
      message:
        "Appointment cancelled successfully.",
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error(
      "APPOINTMENT CANCEL ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while cancelling the appointment.",
      },
      { status: 500 }
    );
  }
}
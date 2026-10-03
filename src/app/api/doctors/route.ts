import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

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

    const doctors = await prisma.doctor.findMany({
      where: {
        available: true,
      },
      orderBy: {
        rating: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      doctors,
    });
  } catch (error) {
    console.error("DOCTORS API ERROR:", error);

    return NextResponse.json(
      {
        error: "Something went wrong while loading doctors.",
      },
      { status: 500 }
    );
  }
}
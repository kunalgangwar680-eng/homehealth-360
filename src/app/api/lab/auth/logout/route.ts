import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  try {
    await destroySession();

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("LAB LOGOUT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to logout.",
      },
      { status: 500 }
    );
  }
}
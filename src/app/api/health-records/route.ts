import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const records = await prisma.healthRecord.findMany({
      where: {
        patientId: session.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedRecords = records.map((record) => {
      const commaIndex = record.fileData.indexOf(",");

      const base64Data =
        commaIndex >= 0
          ? record.fileData.substring(commaIndex + 1)
          : record.fileData;

      const fileSize = Math.floor((base64Data.length * 3) / 4);

      return {
        id: record.id,
        name: record.reportName,
        type: record.recordType,
        date: record.reportDate,
        fileName: record.fileName,
        fileType: record.fileType,
        fileSize,
        dataUrl: record.fileData,
      };
    });

    return NextResponse.json({
      success: true,
      records: formattedRecords,
    });
  } catch (error) {
    console.error("HEALTH RECORDS GET ERROR:", error);

    return NextResponse.json(
      { error: "Something went wrong while loading health records." },
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

    const formData = await request.formData();

    const reportName = formData.get("reportName");
    const recordType = formData.get("recordType");
    const reportDate = formData.get("reportDate");
    const file = formData.get("file");

    if (
      typeof reportName !== "string" ||
      typeof recordType !== "string" ||
      typeof reportDate !== "string" ||
      !reportName.trim() ||
      !recordType.trim() ||
      !reportDate.trim()
    ) {
      return NextResponse.json(
        { error: "Report name, record type and report date are required." },
        { status: 400 }
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Please upload a report file." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only PDF, JPG, PNG and WEBP files are allowed." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size must be 5 MB or less." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    const record = await prisma.healthRecord.create({
      data: {
        patientId: session.userId,
        reportName: reportName.trim(),
        recordType: recordType.trim(),
        reportDate: reportDate.trim(),
        fileName: file.name,
        fileType: file.type,
        fileData: dataUrl,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Health record saved successfully.",
        record: {
          id: record.id,
          name: record.reportName,
          type: record.recordType,
          date: record.reportDate,
          fileName: record.fileName,
          fileType: record.fileType,
          fileSize: file.size,
          dataUrl: record.fileData,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("HEALTH RECORD CREATE ERROR:", error);

    return NextResponse.json(
      { error: "Something went wrong while saving the health record." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const id = body?.id;

    if (typeof id !== "string" || !id.trim()) {
      return NextResponse.json(
        { error: "Health record ID is required." },
        { status: 400 }
      );
    }

    const deleted = await prisma.healthRecord.deleteMany({
      where: {
        id,
        patientId: session.userId,
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: "Health record not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Health record deleted successfully.",
    });
  } catch (error) {
    console.error("HEALTH RECORD DELETE ERROR:", error);

    return NextResponse.json(
      { error: "Something went wrong while deleting the health record." },
      { status: 500 }
    );
  }
}
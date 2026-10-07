import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

const ALLOWED_FILE_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/heic",
  "image/heif",
  "image/webp",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

function getFileSizeFromDataUrl(dataUrl: string): number {
  try {
    const commaIndex = dataUrl.indexOf(",");

    if (commaIndex === -1) {
      return 0;
    }

    const base64 = dataUrl.substring(commaIndex + 1);

    const padding =
      base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;

    return Math.floor((base64.length * 3) / 4) - padding;
  } catch {
    return 0;
  }
}

function createDataUrl(fileType: string, base64: string): string {
  return `data:${fileType};base64,${base64}`;
}

/**
 * GET
 *
 * /api/health-records
 * -> Returns lightweight metadata for all health records.
 *
 * /api/health-records?id=RECORD_ID
 * -> Returns one record including its actual file data.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // --------------------------------------------------
    // Get ONE record with actual file data
    // --------------------------------------------------
    if (id) {
      const record = await prisma.healthRecord.findFirst({
        where: {
          id,
          patientId: session.userId,
        },
      });

      if (!record) {
        return NextResponse.json(
          {
            success: false,
            message: "Health record not found",
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        record: {
          id: record.id,
          reportName: record.reportName,
          recordType: record.recordType,
          reportDate: record.reportDate,
          fileName: record.fileName,
          fileType: record.fileType,
          fileData: record.fileData,
          fileSize: getFileSizeFromDataUrl(record.fileData),
          createdAt: record.createdAt,
        },
      });
    }

    // --------------------------------------------------
    // Get ALL records
    // Do NOT send fileData to browser here.
    // --------------------------------------------------
    const records = await prisma.healthRecord.findMany({
      where: {
        patientId: session.userId,
      },
      select: {
        id: true,
        reportName: true,
        recordType: true,
        reportDate: true,
        fileName: true,
        fileType: true,
        fileData: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const lightweightRecords = records.map((record) => ({
      id: record.id,
      reportName: record.reportName,
      recordType: record.recordType,
      reportDate: record.reportDate,
      fileName: record.fileName,
      fileType: record.fileType,
      fileSize: getFileSizeFromDataUrl(record.fileData),
      createdAt: record.createdAt,
    }));

    return NextResponse.json({
      success: true,
      records: lightweightRecords,
    });
  } catch (error) {
    console.error("GET /api/health-records error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch health records",
      },
      { status: 500 }
    );
  }
}

/**
 * POST
 *
 * Creates a new health record.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    const reportName = String(
      formData.get("reportName") || "Medical Report"
    ).trim();

    const recordType = String(
      formData.get("recordType") || "Medical Report"
    ).trim();

    const reportDate = String(
      formData.get("reportDate") || ""
    ).trim();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please upload a valid file",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // File type validation
    // --------------------------------------------------
    if (!ALLOWED_FILE_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Unsupported file type. Please upload PDF, JPG, PNG, HEIC, WEBP, or DOCX.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // File size validation
    // --------------------------------------------------
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: "File size cannot exceed 25 MB.",
        },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "The uploaded file is empty.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // Convert file to Base64
    // --------------------------------------------------
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const base64 = buffer.toString("base64");

    const fileData = createDataUrl(file.type, base64);

    // --------------------------------------------------
    // Save to Prisma
    // --------------------------------------------------
    const record = await prisma.healthRecord.create({
      data: {
        patientId: session.userId,
        reportName,
        recordType,
        reportDate,
        fileName: file.name,
        fileType: file.type,
        fileData,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Health record saved successfully",
        record: {
          id: record.id,
          reportName: record.reportName,
          recordType: record.recordType,
          reportDate: record.reportDate,
          fileName: record.fileName,
          fileType: record.fileType,
          fileSize: file.size,
          createdAt: record.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/health-records error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to save health record",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE
 *
 * /api/health-records?id=RECORD_ID
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Record ID is required",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // Make sure the record belongs to the logged-in user
    // --------------------------------------------------
    const record = await prisma.healthRecord.findFirst({
      where: {
        id,
        patientId: session.userId,
      },
      select: {
        id: true,
      },
    });

    if (!record) {
      return NextResponse.json(
        {
          success: false,
          message: "Health record not found",
        },
        { status: 404 }
      );
    }

    await prisma.healthRecord.delete({
      where: {
        id: record.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Health record deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/health-records error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete health record",
      },
      { status: 500 }
    );
  }
}
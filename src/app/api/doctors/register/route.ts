import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const MAX_FILE_SIZE = 1.5 * 1024 * 1024; // 1.5 MB

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
];

function isValidFile(file: File | null) {
  if (!file || file.size === 0) {
    return false;
  }

  if (file.size > MAX_FILE_SIZE) {
    return false;
  }

  return ALLOWED_FILE_TYPES.includes(file.type);
}

async function fileToDataUrl(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());

  return `data:${file.type};base64,${buffer.toString(
    "base64"
  )}`;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const fullName = String(
      formData.get("fullName") || ""
    ).trim();

    const email = String(
      formData.get("email") || ""
    ).trim()
      .toLowerCase();

    const mobile = String(
      formData.get("mobile") || ""
    ).trim();

    const medicalRegistrationNumber = String(
      formData.get("medicalRegistrationNumber") || ""
    ).trim();

    const specialization = String(
      formData.get("specialization") || ""
    ).trim();

    const qualification = String(
      formData.get("qualification") || ""
    ).trim();

    const experience = String(
      formData.get("experience") || ""
    ).trim();

    const dob = String(
      formData.get("dob") || ""
    ).trim();

    const clinicHospital = String(
      formData.get("clinicHospital") || ""
    ).trim();

    const clinicAddress = String(
      formData.get("clinicAddress") || ""
    ).trim();

    const password = String(
      formData.get("password") || ""
    );

    const identityDocument =
      formData.get("identityDocument");

    const medicalCertificate =
      formData.get("medicalCertificate");

    const otherDocuments =
      formData.get("otherDocuments");

    if (
      !fullName ||
      !email ||
      !mobile ||
      !medicalRegistrationNumber ||
      !specialization ||
      !qualification ||
      !experience ||
      !dob ||
      !clinicHospital ||
      !password
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Please complete all required fields.",
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Password must be at least 8 characters.",
        },
        { status: 400 }
      );
    }

    if (!(identityDocument instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: "Identity document is required.",
        },
        { status: 400 }
      );
    }

    if (!(medicalCertificate instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Medical registration certificate is required.",
        },
        { status: 400 }
      );
    }

    if (!isValidFile(identityDocument)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Identity document must be PDF, JPG or PNG and must be below 1.5 MB.",
        },
        { status: 400 }
      );
    }

    if (!isValidFile(medicalCertificate)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Medical certificate must be PDF, JPG or PNG and must be below 1.5 MB.",
        },
        { status: 400 }
      );
    }

    let validOtherDocuments: File | null = null;

    if (
      otherDocuments instanceof File &&
      otherDocuments.size > 0
    ) {
      if (!isValidFile(otherDocuments)) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Other document must be PDF, JPG or PNG and must be below 1.5 MB.",
          },
          { status: 400 }
        );
      }

      validOtherDocuments = otherDocuments;
    }

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error:
            "An account with this email already exists.",
        },
        { status: 409 }
      );
    }

    const existingApplication =
      await prisma.doctorApplication.findFirst({
        where: {
          medicalRegistrationNumber,
        },
      });

    if (existingApplication) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This medical registration number has already been submitted.",
        },
        { status: 409 }
      );
    }

    const identityDocumentData =
      await fileToDataUrl(identityDocument);

    const medicalCertificateData =
      await fileToDataUrl(medicalCertificate);

    const otherDocumentsData =
      validOtherDocuments
        ? await fileToDataUrl(validOtherDocuments)
        : null;

    const passwordHash =
      await bcrypt.hash(password, 12);

    const result = await prisma.$transaction(
      async (tx) => {
        const user = await tx.user.create({
          data: {
            name: fullName,
            email,
            passwordHash,
            phone: mobile,

            /*
             * Doctor account exists but remains
             * subject to verification.
             */
            role: "DOCTOR",
          },
        });

        const application =
          await tx.doctorApplication.create({
            data: {
              userId: user.id,

              fullName,
              email,
              mobile,

              medicalRegistrationNumber,

              specialization,
              qualification,
              experience,
              dob,

              clinicHospital,
              clinicAddress:
                clinicAddress || null,

              identityDocumentName:
                identityDocument.name,

              identityDocumentType:
                identityDocument.type,

              identityDocumentData,

              medicalCertificateName:
                medicalCertificate.name,

              medicalCertificateType:
                medicalCertificate.type,

              medicalCertificateData,

              otherDocuments:
                otherDocumentsData,

              /*
               * Every new doctor starts here.
               */
              status: "PENDING",
            },
          });

        return {
          user,
          application,
        };
      }
    );

    console.log(
      "DOCTOR APPLICATION CREATED:",
      result.application.id
    );

    return NextResponse.json(
      {
        success: true,

        message:
          "Doctor registration submitted successfully.",

        applicationId:
          result.application.id,

        status:
          result.application.status,

        userId:
          result.user.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(
      "DOCTOR REGISTRATION API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          "Something went wrong while submitting the doctor registration.",
      },
      { status: 500 }
    );
  }
}
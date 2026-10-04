-- CreateEnum
CREATE TYPE "DoctorVerificationStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'SUSPENDED');

-- CreateTable
CREATE TABLE "DoctorApplication" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "medicalRegistrationNumber" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "qualification" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "dob" TEXT NOT NULL,
    "clinicHospital" TEXT NOT NULL,
    "clinicAddress" TEXT,
    "identityDocumentName" TEXT NOT NULL,
    "identityDocumentType" TEXT NOT NULL,
    "identityDocumentData" TEXT NOT NULL,
    "medicalCertificateName" TEXT NOT NULL,
    "medicalCertificateType" TEXT NOT NULL,
    "medicalCertificateData" TEXT NOT NULL,
    "otherDocuments" TEXT,
    "status" "DoctorVerificationStatus" NOT NULL DEFAULT 'PENDING',
    "adminNotes" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DoctorApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DoctorApplication_userId_key" ON "DoctorApplication"("userId");

-- AddForeignKey
ALTER TABLE "DoctorApplication" ADD CONSTRAINT "DoctorApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

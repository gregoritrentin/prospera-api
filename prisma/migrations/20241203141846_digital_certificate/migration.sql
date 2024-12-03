-- CreateEnum
CREATE TYPE "CertificateSource" AS ENUM ('INTERNAL', 'EXTERNAL');

-- CreateEnum
CREATE TYPE "CertificateStatus" AS ENUM ('PENDING_VALIDATION', 'ACTIVE', 'EXPIRING', 'EXPIRED', 'INVALID');

-- CreateTable
CREATE TABLE "digital_certificates" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "certificate_file_id" TEXT NOT NULL,
    "source" "CertificateSource" NOT NULL,
    "serial_number" TEXT NOT NULL,
    "thumbprint" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "issue_date" TIMESTAMP(3) NOT NULL,
    "expiration_date" TIMESTAMP(3) NOT NULL,
    "installation_date" TIMESTAMP(3),
    "status" "CertificateStatus" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "last_validation_date" TIMESTAMP(3),
    "validation_errors" TEXT,
    "installation_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "digital_certificates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "digital_certificates_business_id_idx" ON "digital_certificates"("business_id");

-- CreateIndex
CREATE INDEX "digital_certificates_serial_number_idx" ON "digital_certificates"("serial_number");

-- CreateIndex
CREATE INDEX "digital_certificates_status_idx" ON "digital_certificates"("status");

-- CreateIndex
CREATE INDEX "digital_certificates_expiration_date_idx" ON "digital_certificates"("expiration_date");

-- AddForeignKey
ALTER TABLE "digital_certificates" ADD CONSTRAINT "digital_certificates_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "digital_certificates" ADD CONSTRAINT "digital_certificates_certificate_file_id_fkey" FOREIGN KEY ("certificate_file_id") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

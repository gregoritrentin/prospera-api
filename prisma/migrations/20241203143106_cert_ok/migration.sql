/*
  Warnings:

  - You are about to drop the column `installation_notes` on the `digital_certificates` table. All the data in the column will be lost.
  - You are about to drop the column `last_validation_date` on the `digital_certificates` table. All the data in the column will be lost.
  - You are about to drop the column `validation_errors` on the `digital_certificates` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "digital_certificates" DROP COLUMN "installation_notes",
DROP COLUMN "last_validation_date",
DROP COLUMN "validation_errors";

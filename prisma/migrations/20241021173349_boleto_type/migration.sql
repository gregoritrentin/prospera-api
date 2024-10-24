/*
  Warnings:

  - Added the required column `document_type` to the `transactios_boletos` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BoletoDocumentType" AS ENUM ('DUPLICATA_MERCANTIL_INDICACAO');

-- AlterTable
ALTER TABLE "transactios_boletos" ADD COLUMN     "document_type" "BoletoDocumentType" NOT NULL;

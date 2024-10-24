/*
  Warnings:

  - You are about to drop the column `document_type` on the `transactios_boletos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "transactios_boletos" DROP COLUMN "document_type";

-- DropEnum
DROP TYPE "BoletoDocumentType";

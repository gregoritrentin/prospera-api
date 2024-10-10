/*
  Warnings:

  - You are about to drop the column `filePdfId` on the `transactios_boletos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "transactios_boletos" DROP CONSTRAINT "transactios_boletos_filePdfId_fkey";

-- AlterTable
ALTER TABLE "transactios_boletos" DROP COLUMN "filePdfId",
ADD COLUMN     "file_pdf_id" TEXT;

-- AddForeignKey
ALTER TABLE "transactios_boletos" ADD CONSTRAINT "transactios_boletos_file_pdf_id_fkey" FOREIGN KEY ("file_pdf_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

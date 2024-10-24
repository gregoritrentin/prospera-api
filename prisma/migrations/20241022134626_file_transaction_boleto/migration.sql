/*
  Warnings:

  - Made the column `pdf_file_id` on table `transaction_boletos` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "transaction_boletos" DROP CONSTRAINT "transaction_boletos_pdf_file_id_fkey";

-- AlterTable
ALTER TABLE "transaction_boletos" ALTER COLUMN "pdf_file_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "transaction_boletos" ADD CONSTRAINT "transaction_boletos_pdf_file_id_fkey" FOREIGN KEY ("pdf_file_id") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

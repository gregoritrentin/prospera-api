/*
  Warnings:

  - The values [CASH,CARD_CREDIT] on the enum `TransactionType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `transaction_boletos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transactions_pix` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TransactionType_new" AS ENUM ('BOLETO', 'PIX', 'CARD');
ALTER TABLE "transactions" ALTER COLUMN "type" TYPE "TransactionType_new" USING ("type"::text::"TransactionType_new");
ALTER TYPE "TransactionType" RENAME TO "TransactionType_old";
ALTER TYPE "TransactionType_new" RENAME TO "TransactionType";
DROP TYPE "TransactionType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "transaction_boletos" DROP CONSTRAINT "transaction_boletos_pdf_file_id_fkey";

-- DropForeignKey
ALTER TABLE "transaction_boletos" DROP CONSTRAINT "transaction_boletos_transaction_id_fkey";

-- DropForeignKey
ALTER TABLE "transactions_pix" DROP CONSTRAINT "transactions_pix_transaction_id_fkey";

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "barcode" TEXT,
ADD COLUMN     "digitable_line" TEXT,
ADD COLUMN     "file_id" TEXT,
ADD COLUMN     "our_number" TEXT,
ADD COLUMN     "pix_id" TEXT,
ADD COLUMN     "pix_qr_code" TEXT;

-- DropTable
DROP TABLE "transaction_boletos";

-- DropTable
DROP TABLE "transactions_pix";

-- DropEnum
DROP TYPE "BoletoDocumentType";

-- DropEnum
DROP TYPE "pixType";

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

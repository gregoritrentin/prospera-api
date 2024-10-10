/*
  Warnings:

  - You are about to drop the `transaction_boletos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transaction_cards` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transaction_pix` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transactions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "invoice_payments" DROP CONSTRAINT "invoice_payments_transaction_id_fkey";

-- DropForeignKey
ALTER TABLE "receivables" DROP CONSTRAINT "receivables_transaction_id_fkey";

-- DropForeignKey
ALTER TABLE "transaction_boletos" DROP CONSTRAINT "transaction_boletos_transaction_id_fkey";

-- DropForeignKey
ALTER TABLE "transaction_cards" DROP CONSTRAINT "transaction_cards_transactionId_fkey";

-- DropForeignKey
ALTER TABLE "transaction_pix" DROP CONSTRAINT "transaction_pix_transaction_id_fkey";

-- DropForeignKey
ALTER TABLE "transaction_splits" DROP CONSTRAINT "transaction_splits_transaction_id_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_business_id_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_person_id_fkey";

-- AlterTable
ALTER TABLE "invoice_payments" ADD COLUMN     "transactionBoletoId" TEXT;

-- AlterTable
ALTER TABLE "receivables" ADD COLUMN     "transactionBoletoId" TEXT;

-- DropTable
DROP TABLE "transaction_boletos";

-- DropTable
DROP TABLE "transaction_cards";

-- DropTable
DROP TABLE "transaction_pix";

-- DropTable
DROP TABLE "transactions";

-- CreateTable
CREATE TABLE "transactios_boletos" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "person_id" TEXT NOT NULL,
    "document_type" TEXT NOT NULL,
    "our_number" TEXT,
    "description" TEXT,
    "status" TEXT NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "paymend_date" TIMESTAMP(3),
    "payment_limit_date" TIMESTAMP(3),
    "amount" DOUBLE PRECISION NOT NULL,
    "fee_amount" DOUBLE PRECISION NOT NULL,
    "payment_amount" DOUBLE PRECISION,
    "digitable_line" TEXT,
    "barcode" TEXT,
    "pix_qr_code" TEXT,
    "pix_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "transactios_boletos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "invoice_payments" ADD CONSTRAINT "invoice_payments_transactionBoletoId_fkey" FOREIGN KEY ("transactionBoletoId") REFERENCES "transactios_boletos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactios_boletos" ADD CONSTRAINT "transactios_boletos_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactios_boletos" ADD CONSTRAINT "transactios_boletos_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receivables" ADD CONSTRAINT "receivables_transactionBoletoId_fkey" FOREIGN KEY ("transactionBoletoId") REFERENCES "transactios_boletos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

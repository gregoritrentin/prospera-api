/*
  Warnings:

  - You are about to drop the column `amount` on the `invoice_payments` table. All the data in the column will be lost.
  - You are about to drop the column `invoice_id` on the `invoice_payments` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_id` on the `invoice_payments` table. All the data in the column will be lost.
  - Added the required column `ammount` to the `invoice_payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `due_date` to the `invoice_payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoiceId` to the `invoice_payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_method` to the `invoice_payments` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `invoices` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "paymentMethod" AS ENUM ('CREDIT_CARD', 'DEBIT_CARD', 'CASH', 'BOLETO', 'PIX');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('CREATED', 'OPEN', 'PAID', 'CANCELED');

-- DropForeignKey
ALTER TABLE "invoice_payments" DROP CONSTRAINT "invoice_payments_invoice_id_fkey";

-- DropForeignKey
ALTER TABLE "invoice_payments" DROP CONSTRAINT "invoice_payments_transaction_id_fkey";

-- AlterTable
ALTER TABLE "invoice_payments" DROP COLUMN "amount",
DROP COLUMN "invoice_id",
DROP COLUMN "transaction_id",
ADD COLUMN     "ammount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "due_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "invoiceId" TEXT NOT NULL,
ADD COLUMN     "payment_method" "paymentMethod" NOT NULL;

-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "status",
ADD COLUMN     "status" "InvoiceStatus" NOT NULL;

-- DropEnum
DROP TYPE "GeralStatus";

-- CreateTable
CREATE TABLE "invoice_transactions" (
    "id" TEXT NOT NULL,
    "invoice_id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,

    CONSTRAINT "invoice_transactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "invoice_transactions" ADD CONSTRAINT "invoice_transactions_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_transactions" ADD CONSTRAINT "invoice_transactions_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_payments" ADD CONSTRAINT "invoice_payments_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

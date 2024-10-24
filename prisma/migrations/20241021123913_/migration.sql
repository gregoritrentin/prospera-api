/*
  Warnings:

  - The values [PIX_BANK_DATA,BOLETO] on the enum `PaymentType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `updated_at` on the `invoice_attachments` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `invoice_events` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `invoice_items` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `invoice_items` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `invoice_payments` table. All the data in the column will be lost.
  - You are about to drop the column `transactionBoletoId` on the `invoice_payments` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `invoice_payments` table. All the data in the column will be lost.
  - You are about to drop the column `transactionBoletoId` on the `receivables` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `transactios_boletos` table. All the data in the column will be lost.
  - You are about to drop the column `business_id` on the `transactios_boletos` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `transactios_boletos` table. All the data in the column will be lost.
  - You are about to drop the column `document_type` on the `transactios_boletos` table. All the data in the column will be lost.
  - You are about to drop the column `due_date` on the `transactios_boletos` table. All the data in the column will be lost.
  - You are about to drop the column `fee_amount` on the `transactios_boletos` table. All the data in the column will be lost.
  - You are about to drop the column `paymend_date` on the `transactios_boletos` table. All the data in the column will be lost.
  - You are about to drop the column `payment_amount` on the `transactios_boletos` table. All the data in the column will be lost.
  - You are about to drop the column `payment_limit_date` on the `transactios_boletos` table. All the data in the column will be lost.
  - You are about to drop the column `person_id` on the `transactios_boletos` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `transactios_boletos` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `transactios_pix` table. All the data in the column will be lost.
  - You are about to drop the column `business_id` on the `transactios_pix` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `transactios_pix` table. All the data in the column will be lost.
  - You are about to drop the column `document_type` on the `transactios_pix` table. All the data in the column will be lost.
  - You are about to drop the column `due_date` on the `transactios_pix` table. All the data in the column will be lost.
  - You are about to drop the column `fee_amount` on the `transactios_pix` table. All the data in the column will be lost.
  - You are about to drop the column `paymend_date` on the `transactios_pix` table. All the data in the column will be lost.
  - You are about to drop the column `payment_amount` on the `transactios_pix` table. All the data in the column will be lost.
  - You are about to drop the column `payment_limit_date` on the `transactios_pix` table. All the data in the column will be lost.
  - You are about to drop the column `person_id` on the `transactios_pix` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `transactios_pix` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[transaction_id]` on the table `transactios_boletos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[transaction_id]` on the table `transactios_pix` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `type` on the `account_movement` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `amount` to the `invoice_payments` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `split_type` on the `invoice_splits` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `person_id` to the `subscriptions` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `split_type` on the `transaction_splits` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `transaction_id` to the `transactios_boletos` table without a default value. This is not possible if the table is not empty.
  - Made the column `our_number` on table `transactios_boletos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `digitable_line` on table `transactios_boletos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `barcode` on table `transactios_boletos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pix_qr_code` on table `transactios_boletos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pix_id` on table `transactios_boletos` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `pix_type` to the `transactios_pix` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transaction_id` to the `transactios_pix` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('BOLETO', 'PIX', 'CASH', 'CARD_CREDIT');

-- CreateEnum
CREATE TYPE "MovementType" AS ENUM ('CREDIT', 'DEBIT');

-- CreateEnum
CREATE TYPE "pixType" AS ENUM ('KEY', 'BANK_DETAILS');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "GeralStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "UserGender" AS ENUM ('MALE', 'FEMAILE');

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentType_new" AS ENUM ('PIX_KEY', 'PIX_BANK_DETAILS');
ALTER TABLE "payments" ALTER COLUMN "payment_type" TYPE "PaymentType_new" USING ("payment_type"::text::"PaymentType_new");
ALTER TYPE "PaymentType" RENAME TO "PaymentType_old";
ALTER TYPE "PaymentType_new" RENAME TO "PaymentType";
DROP TYPE "PaymentType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "invoice_payments" DROP CONSTRAINT "invoice_payments_transactionBoletoId_fkey";

-- DropForeignKey
ALTER TABLE "receivables" DROP CONSTRAINT "receivables_transactionBoletoId_fkey";

-- DropForeignKey
ALTER TABLE "transactios_boletos" DROP CONSTRAINT "transactios_boletos_business_id_fkey";

-- DropForeignKey
ALTER TABLE "transactios_boletos" DROP CONSTRAINT "transactios_boletos_person_id_fkey";

-- DropForeignKey
ALTER TABLE "transactios_pix" DROP CONSTRAINT "transactios_pix_business_id_fkey";

-- DropForeignKey
ALTER TABLE "transactios_pix" DROP CONSTRAINT "transactios_pix_person_id_fkey";

-- AlterTable
ALTER TABLE "account_movement" DROP COLUMN "type",
ADD COLUMN     "type" "MovementType" NOT NULL;

-- AlterTable
ALTER TABLE "invoice_attachments" DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "invoice_events" DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "invoice_items" DROP COLUMN "created_at",
DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "invoice_payments" DROP COLUMN "created_at",
DROP COLUMN "transactionBoletoId",
DROP COLUMN "updated_at",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "invoice_splits" DROP COLUMN "split_type",
ADD COLUMN     "split_type" "CalculationMode" NOT NULL;

-- AlterTable
ALTER TABLE "receivables" DROP COLUMN "transactionBoletoId";

-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "person_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "transaction_splits" DROP COLUMN "split_type",
ADD COLUMN     "split_type" "CalculationMode" NOT NULL;

-- AlterTable
ALTER TABLE "transactios_boletos" DROP COLUMN "amount",
DROP COLUMN "business_id",
DROP COLUMN "description",
DROP COLUMN "document_type",
DROP COLUMN "due_date",
DROP COLUMN "fee_amount",
DROP COLUMN "paymend_date",
DROP COLUMN "payment_amount",
DROP COLUMN "payment_limit_date",
DROP COLUMN "person_id",
DROP COLUMN "status",
ADD COLUMN     "transaction_id" TEXT NOT NULL,
ALTER COLUMN "our_number" SET NOT NULL,
ALTER COLUMN "digitable_line" SET NOT NULL,
ALTER COLUMN "barcode" SET NOT NULL,
ALTER COLUMN "pix_qr_code" SET NOT NULL,
ALTER COLUMN "pix_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "transactios_pix" DROP COLUMN "amount",
DROP COLUMN "business_id",
DROP COLUMN "description",
DROP COLUMN "document_type",
DROP COLUMN "due_date",
DROP COLUMN "fee_amount",
DROP COLUMN "paymend_date",
DROP COLUMN "payment_amount",
DROP COLUMN "payment_limit_date",
DROP COLUMN "person_id",
DROP COLUMN "status",
ADD COLUMN     "pix_type" "pixType" NOT NULL,
ADD COLUMN     "transaction_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "person_id" TEXT,
    "description" TEXT,
    "status" TEXT NOT NULL,
    "due_date" TIMESTAMP(3),
    "paymend_date" TIMESTAMP(3),
    "payment_limit_date" TIMESTAMP(3),
    "amount" DOUBLE PRECISION NOT NULL,
    "fee_amount" DOUBLE PRECISION NOT NULL,
    "payment_amount" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transfers" (
    "id" TEXT NOT NULL,
    "from_account_id" TEXT NOT NULL,
    "to_account_id" TEXT NOT NULL,
    "from_account_movement_id" TEXT NOT NULL,
    "to_account_movement_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "transfers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transfers_from_account_movement_id_key" ON "transfers"("from_account_movement_id");

-- CreateIndex
CREATE UNIQUE INDEX "transfers_to_account_movement_id_key" ON "transfers"("to_account_movement_id");

-- CreateIndex
CREATE UNIQUE INDEX "transfers_from_account_movement_id_to_account_movement_id_key" ON "transfers"("from_account_movement_id", "to_account_movement_id");

-- CreateIndex
CREATE UNIQUE INDEX "transactios_boletos_transaction_id_key" ON "transactios_boletos"("transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "transactios_pix_transaction_id_key" ON "transactios_pix"("transaction_id");

-- AddForeignKey
ALTER TABLE "whatsapps" ADD CONSTRAINT "whatsapps_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_payments" ADD CONSTRAINT "invoice_payments_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactios_pix" ADD CONSTRAINT "transactios_pix_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactios_boletos" ADD CONSTRAINT "transactios_boletos_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_splits" ADD CONSTRAINT "transaction_splits_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receivables" ADD CONSTRAINT "receivables_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_from_account_id_fkey" FOREIGN KEY ("from_account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_to_account_id_fkey" FOREIGN KEY ("to_account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_from_account_movement_id_fkey" FOREIGN KEY ("from_account_movement_id") REFERENCES "account_movement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_to_account_movement_id_fkey" FOREIGN KEY ("to_account_movement_id") REFERENCES "account_movement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_channels" ADD CONSTRAINT "sales_channels_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "inventories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_pipelines" ADD CONSTRAINT "crm_pipelines_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

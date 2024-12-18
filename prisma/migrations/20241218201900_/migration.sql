/*
  Warnings:

  - You are about to drop the column `fee_amount` on the `transaction_splits` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "transaction_splits_transaction_id_key";

-- AlterTable
ALTER TABLE "transaction_splits" DROP COLUMN "fee_amount";

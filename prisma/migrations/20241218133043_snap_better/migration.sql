/*
  Warnings:

  - You are about to drop the column `account_id` on the `account_balance_snapshots` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `account_balance_snapshots` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `account_balance_snapshots` table. All the data in the column will be lost.
  - You are about to alter the column `balance` on the `account_balance_snapshots` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - Added the required column `accountId` to the `account_balance_snapshots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastTransactionId` to the `account_balance_snapshots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastTransactionTimestamp` to the `account_balance_snapshots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `snapshotTimestamp` to the `account_balance_snapshots` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "account_balance_snapshots" DROP CONSTRAINT "account_balance_snapshots_account_id_fkey";

-- DropIndex
DROP INDEX "account_balance_snapshots_account_id_idx";

-- DropIndex
DROP INDEX "account_balance_snapshots_account_id_month_year_key";

-- DropIndex
DROP INDEX "account_balance_snapshots_month_year_idx";

-- AlterTable
ALTER TABLE "account_balance_snapshots" DROP COLUMN "account_id",
DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "accountId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lastTransactionId" TEXT NOT NULL,
ADD COLUMN     "lastTransactionTimestamp" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "snapshotTimestamp" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ALTER COLUMN "balance" SET DATA TYPE DECIMAL(65,30);

-- CreateIndex
CREATE INDEX "account_balance_snapshots_accountId_month_year_idx" ON "account_balance_snapshots"("accountId", "month", "year");

-- CreateIndex
CREATE INDEX "account_balance_snapshots_accountId_snapshotTimestamp_idx" ON "account_balance_snapshots"("accountId", "snapshotTimestamp");

-- AddForeignKey
ALTER TABLE "account_balance_snapshots" ADD CONSTRAINT "account_balance_snapshots_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

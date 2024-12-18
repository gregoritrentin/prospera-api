/*
  Warnings:

  - You are about to drop the column `business_id` on the `receivables` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `receivables` table. All the data in the column will be lost.
  - You are about to drop the column `due_date` on the `receivables` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `receivables` table. All the data in the column will be lost.
  - Added the required column `current_due_date` to the `receivables` table without a default value. This is not possible if the table is not empty.
  - Added the required column `current_owner_id` to the `receivables` table without a default value. This is not possible if the table is not empty.
  - Added the required column `net_amount` to the `receivables` table without a default value. This is not possible if the table is not empty.
  - Added the required column `original_due_date` to the `receivables` table without a default value. This is not possible if the table is not empty.
  - Added the required column `original_owner_id` to the `receivables` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `receivables` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AnticipationReceivableStatus" AS ENUM ('PENDING', 'IN_ANALYSIS', 'APPROVED', 'PARTIALLY_APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AnticipationType" AS ENUM ('TOTAL', 'PARTIAL', 'SELECTED');

-- CreateEnum
CREATE TYPE "ReceivableStatus" AS ENUM ('PENDING', 'ANTICIPATED', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AnticipationStatus" AS ENUM ('PENDING', 'ANALYSIS', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "receivables" DROP CONSTRAINT "receivables_business_id_fkey";

-- AlterTable
ALTER TABLE "receivables" DROP COLUMN "business_id",
DROP COLUMN "created_at",
DROP COLUMN "due_date",
DROP COLUMN "updated_at",
ADD COLUMN     "businessId" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "current_due_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "current_owner_id" TEXT NOT NULL,
ADD COLUMN     "net_amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "original_due_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "original_owner_id" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
DROP COLUMN "status",
ADD COLUMN     "status" "ReceivableStatus" NOT NULL;

-- CreateTable
CREATE TABLE "receivable_history" (
    "id" TEXT NOT NULL,
    "receivable_id" TEXT NOT NULL,
    "from_owner_id" TEXT NOT NULL,
    "to_owner_id" TEXT NOT NULL,
    "operation_type" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "fee_amount" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "receivable_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anticipations" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "requested_amount" DOUBLE PRECISION NOT NULL,
    "anticipated_amount" DOUBLE PRECISION NOT NULL,
    "fee_amount" DOUBLE PRECISION NOT NULL,
    "fee_percentage" DOUBLE PRECISION NOT NULL,
    "status" "AnticipationStatus" NOT NULL,
    "average_days_ahead" DOUBLE PRECISION NOT NULL,
    "oldest_due_date" TIMESTAMP(3) NOT NULL,
    "newest_due_date" TIMESTAMP(3) NOT NULL,
    "receivables_count" INTEGER NOT NULL,
    "risk_score" DOUBLE PRECISION,
    "operation_type" "AnticipationType" NOT NULL,
    "request_date" TIMESTAMP(3) NOT NULL,
    "analysis_start_date" TIMESTAMP(3),
    "analysis_end_date" TIMESTAMP(3),
    "approval_date" TIMESTAMP(3),
    "completion_date" TIMESTAMP(3),
    "canceled_date" TIMESTAMP(3),
    "analyzer_notes" TEXT,
    "rejection_reason" TEXT,
    "approved_by_id" TEXT,
    "analyzed_by_id" TEXT,
    "minimum_payment_date" TIMESTAMP(3) NOT NULL,
    "maximum_payment_date" TIMESTAMP(3) NOT NULL,
    "effective_rate" DOUBLE PRECISION NOT NULL,
    "annual_rate" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "anticipations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anticipation_receivables" (
    "id" TEXT NOT NULL,
    "anticipation_id" TEXT NOT NULL,
    "receivable_id" TEXT NOT NULL,
    "requested_amount" DOUBLE PRECISION NOT NULL,
    "approved_amount" DOUBLE PRECISION,
    "fee_amount" DOUBLE PRECISION NOT NULL,
    "effective_rate" DOUBLE PRECISION NOT NULL,
    "status" "AnticipationReceivableStatus" NOT NULL,
    "risk_score" DOUBLE PRECISION,
    "rejection_reason" TEXT,
    "analyzer_notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "analyzed_at" TIMESTAMP(3),
    "approved_at" TIMESTAMP(3),
    "analyzed_by_id" TEXT,
    "approved_by_id" TEXT,
    "user_id" TEXT,

    CONSTRAINT "anticipation_receivables_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "receivables" ADD CONSTRAINT "receivables_original_owner_id_fkey" FOREIGN KEY ("original_owner_id") REFERENCES "business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receivables" ADD CONSTRAINT "receivables_current_owner_id_fkey" FOREIGN KEY ("current_owner_id") REFERENCES "business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receivables" ADD CONSTRAINT "receivables_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receivable_history" ADD CONSTRAINT "receivable_history_receivable_id_fkey" FOREIGN KEY ("receivable_id") REFERENCES "receivables"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receivable_history" ADD CONSTRAINT "receivable_history_from_owner_id_fkey" FOREIGN KEY ("from_owner_id") REFERENCES "business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receivable_history" ADD CONSTRAINT "receivable_history_to_owner_id_fkey" FOREIGN KEY ("to_owner_id") REFERENCES "business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anticipations" ADD CONSTRAINT "anticipations_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anticipation_receivables" ADD CONSTRAINT "anticipation_receivables_anticipation_id_fkey" FOREIGN KEY ("anticipation_id") REFERENCES "anticipations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anticipation_receivables" ADD CONSTRAINT "anticipation_receivables_receivable_id_fkey" FOREIGN KEY ("receivable_id") REFERENCES "receivables"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anticipation_receivables" ADD CONSTRAINT "anticipation_receivables_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

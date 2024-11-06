/*
  Warnings:

  - The `status` column on the `business` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "SaleStatus" AS ENUM ('DRAFT', 'CREDIT_ANALYSIS', 'APPROVED', 'CREDIT_DENIED', 'WAITING_PREPAYMENT', 'PAYMENT_EXPIRED', 'IN_PROGRESS', 'APPROVED_TO_INVOICE', 'INVOICED', 'CANCELED', 'RETURNED');

-- AlterTable
ALTER TABLE "business" DROP COLUMN "status",
ADD COLUMN     "status" "SaleStatus" NOT NULL DEFAULT 'DRAFT';

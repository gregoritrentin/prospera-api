/*
  Warnings:

  - Changed the type of `split_type` on the `subscription_splits` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SplitType" AS ENUM ('PERCENT', 'VALUE');

-- AlterTable
ALTER TABLE "subscription_splits" DROP COLUMN "split_type",
ADD COLUMN     "split_type" "SplitType" NOT NULL;

-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "cancellation_date" TIMESTAMP(3),
ADD COLUMN     "cancellation_reason" TEXT,
ADD COLUMN     "cancellation_scheduled_date" TIMESTAMP(3);

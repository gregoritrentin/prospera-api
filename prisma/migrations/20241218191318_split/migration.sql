/*
  Warnings:

  - Changed the type of `split_type` on the `transaction_splits` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "transaction_splits" DROP COLUMN "split_type",
ADD COLUMN     "split_type" "SplitType" NOT NULL;

/*
  Warnings:

  - You are about to drop the column `barCode` on the `payments` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "payments_barCode_idx";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "barCode";

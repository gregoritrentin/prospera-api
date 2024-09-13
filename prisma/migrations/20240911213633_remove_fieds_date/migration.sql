/*
  Warnings:

  - You are about to drop the column `founding_date` on the `business` table. All the data in the column will be lost.
  - You are about to drop the column `birth_date` on the `business_owners` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "business" DROP COLUMN "founding_date";

-- AlterTable
ALTER TABLE "business_owners" DROP COLUMN "birth_date";

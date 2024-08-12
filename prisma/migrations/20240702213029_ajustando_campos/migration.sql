/*
  Warnings:

  - You are about to drop the column `annual_income` on the `business` table. All the data in the column will be lost.
  - You are about to drop the column `opening_date` on the `business` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "business" DROP COLUMN "annual_income",
DROP COLUMN "opening_date";

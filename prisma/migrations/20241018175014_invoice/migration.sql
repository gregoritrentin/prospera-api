/*
  Warnings:

  - Added the required column `protestMode` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `lateMode` on the `invoices` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `interestMode` on the `invoices` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `discountMode` on the `invoices` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CalculationMode" AS ENUM ('NONE', 'PERCENT', 'VALUE');

-- CreateEnum
CREATE TYPE "YesNo" AS ENUM ('YES', 'NO');

-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "protestMode" "YesNo" NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "payment_limit_date" DROP NOT NULL,
DROP COLUMN "lateMode",
ADD COLUMN     "lateMode" "CalculationMode" NOT NULL,
DROP COLUMN "interestMode",
ADD COLUMN     "interestMode" "CalculationMode" NOT NULL,
DROP COLUMN "discountMode",
ADD COLUMN     "discountMode" "CalculationMode" NOT NULL;

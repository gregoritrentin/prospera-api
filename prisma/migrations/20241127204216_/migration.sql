/*
  Warnings:

  - You are about to drop the column `paymend_date` on the `invoices` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "paymend_date",
ADD COLUMN     "payment_date" TIMESTAMP(3);

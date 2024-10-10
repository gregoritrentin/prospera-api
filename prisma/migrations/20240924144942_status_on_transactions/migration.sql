/*
  Warnings:

  - Added the required column `status` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "status" TEXT NOT NULL;

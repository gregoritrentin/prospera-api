/*
  Warnings:

  - Added the required column `status` to the `business_owners` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "business_owners" ADD COLUMN     "status" TEXT NOT NULL;

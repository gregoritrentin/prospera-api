/*
  Warnings:

  - You are about to drop the column `business_id` on the `persons` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "persons" DROP CONSTRAINT "persons_business_id_fkey";

-- AlterTable
ALTER TABLE "persons" DROP COLUMN "business_id";

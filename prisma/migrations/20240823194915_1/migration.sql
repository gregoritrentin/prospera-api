/*
  Warnings:

  - You are about to drop the column `ie` on the `business_owners` table. All the data in the column will be lost.
  - You are about to drop the column `im` on the `business_owners` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "business_owners_document_key";

-- AlterTable
ALTER TABLE "business_owners" DROP COLUMN "ie",
DROP COLUMN "im";

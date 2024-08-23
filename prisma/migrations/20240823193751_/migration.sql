/*
  Warnings:

  - A unique constraint covering the columns `[document]` on the table `business_owners` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address_line1` to the `business_owners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address_line2` to the `business_owners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `business_owners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country_code` to the `business_owners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `document` to the `business_owners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `business_owners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `business_owners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `neighborhood` to the `business_owners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `business_owners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postal_code` to the `business_owners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `business_owners` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "business_owners" ADD COLUMN     "address_line1" TEXT NOT NULL,
ADD COLUMN     "address_line2" TEXT NOT NULL,
ADD COLUMN     "address_line3" TEXT,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country_code" TEXT NOT NULL,
ADD COLUMN     "document" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "ie" TEXT,
ADD COLUMN     "im" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "neighborhood" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "postal_code" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "business_owners_document_key" ON "business_owners"("document");

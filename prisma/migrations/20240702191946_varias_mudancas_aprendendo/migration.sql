/*
  Warnings:

  - You are about to drop the column `country_code` on the `business` table. All the data in the column will be lost.
  - You are about to drop the column `postal_code` on the `business` table. All the data in the column will be lost.
  - Added the required column `countryCode` to the `business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `business` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "business" DROP COLUMN "country_code",
DROP COLUMN "postal_code",
ADD COLUMN     "countryCode" TEXT NOT NULL,
ADD COLUMN     "postalCode" TEXT NOT NULL;

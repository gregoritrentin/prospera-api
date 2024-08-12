/*
  Warnings:

  - You are about to drop the column `address_line1` on the `persons` table. All the data in the column will be lost.
  - You are about to drop the column `address_line2` on the `persons` table. All the data in the column will be lost.
  - You are about to drop the column `address_line3` on the `persons` table. All the data in the column will be lost.
  - You are about to drop the column `country_code` on the `persons` table. All the data in the column will be lost.
  - You are about to drop the column `postal_code` on the `persons` table. All the data in the column will be lost.
  - Added the required column `addressLine1` to the `persons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addressLine2` to the `persons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addressLine3` to the `persons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `businessId` to the `persons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `countryCode` to the `persons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `persons` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "persons" DROP COLUMN "address_line1",
DROP COLUMN "address_line2",
DROP COLUMN "address_line3",
DROP COLUMN "country_code",
DROP COLUMN "postal_code",
ADD COLUMN     "addressLine1" TEXT NOT NULL,
ADD COLUMN     "addressLine2" TEXT NOT NULL,
ADD COLUMN     "addressLine3" TEXT NOT NULL,
ADD COLUMN     "businessId" TEXT NOT NULL,
ADD COLUMN     "countryCode" TEXT NOT NULL,
ADD COLUMN     "postalCode" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "persons" ADD CONSTRAINT "persons_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `countryCode` on the `business` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `business` table. All the data in the column will be lost.
  - You are about to drop the column `addressLine1` on the `persons` table. All the data in the column will be lost.
  - You are about to drop the column `addressLine2` on the `persons` table. All the data in the column will be lost.
  - You are about to drop the column `addressLine3` on the `persons` table. All the data in the column will be lost.
  - You are about to drop the column `countryCode` on the `persons` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `persons` table. All the data in the column will be lost.
  - Added the required column `country_code` to the `business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postal_code` to the `business` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `state` on the `business` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `address_line1` to the `persons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address_line2` to the `persons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address_line3` to the `persons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country_code` to the `persons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postal_code` to the `persons` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `state` on the `persons` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "State" AS ENUM ('AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO', 'EX');

-- AlterTable
ALTER TABLE "business" DROP COLUMN "countryCode",
DROP COLUMN "postalCode",
ADD COLUMN     "country_code" TEXT NOT NULL,
ADD COLUMN     "postal_code" TEXT NOT NULL,
DROP COLUMN "state",
ADD COLUMN     "state" "State" NOT NULL;

-- AlterTable
ALTER TABLE "persons" DROP COLUMN "addressLine1",
DROP COLUMN "addressLine2",
DROP COLUMN "addressLine3",
DROP COLUMN "countryCode",
DROP COLUMN "postalCode",
ADD COLUMN     "address_line1" TEXT NOT NULL,
ADD COLUMN     "address_line2" TEXT NOT NULL,
ADD COLUMN     "address_line3" TEXT NOT NULL,
ADD COLUMN     "country_code" TEXT NOT NULL,
ADD COLUMN     "postal_code" TEXT NOT NULL,
DROP COLUMN "state",
ADD COLUMN     "state" "State" NOT NULL;

/*
  Warnings:

  - You are about to drop the column `business_name` on the `business` table. All the data in the column will be lost.
  - You are about to drop the column `marketplaceId` on the `business` table. All the data in the column will be lost.
  - You are about to drop the column `trading_name` on the `business` table. All the data in the column will be lost.
  - You are about to drop the column `appsId` on the `business_apps` table. All the data in the column will be lost.
  - You are about to drop the column `businessId` on the `business_apps` table. All the data in the column will be lost.
  - You are about to drop the column `businessId` on the `business_bank_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `persons` table. All the data in the column will be lost.
  - Changed the type of `status` on the `apps` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `marketplace_id` to the `business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `business` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `business_syze` on the `business` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `business_type` on the `business` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `business` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `apps_id` to the `business_apps` table without a default value. This is not possible if the table is not empty.
  - Added the required column `business_id` to the `business_apps` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `business_apps` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `business_id` to the `business_bank_accounts` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `business_bank_accounts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `business_bank_accounts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `owner_type` on the `business_owners` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `marketpaces` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `persons` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `role` on the `user_business` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `user_business` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "business_apps" DROP CONSTRAINT "business_apps_appsId_fkey";

-- DropForeignKey
ALTER TABLE "business_apps" DROP CONSTRAINT "business_apps_businessId_fkey";

-- DropForeignKey
ALTER TABLE "business_bank_accounts" DROP CONSTRAINT "business_bank_accounts_businessId_fkey";

-- AlterTable
ALTER TABLE "apps" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "business" DROP COLUMN "business_name",
DROP COLUMN "marketplaceId",
DROP COLUMN "trading_name",
ADD COLUMN     "ie" TEXT,
ADD COLUMN     "im" TEXT,
ADD COLUMN     "marketplace_id" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "address_line3" DROP NOT NULL,
DROP COLUMN "business_syze",
ADD COLUMN     "business_syze" TEXT NOT NULL,
DROP COLUMN "business_type",
ADD COLUMN     "business_type" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "business_apps" DROP COLUMN "appsId",
DROP COLUMN "businessId",
ADD COLUMN     "apps_id" TEXT NOT NULL,
ADD COLUMN     "business_id" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "business_bank_accounts" DROP COLUMN "businessId",
ADD COLUMN     "business_id" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "business_owners" DROP COLUMN "owner_type",
ADD COLUMN     "owner_type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "marketpaces" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "persons" DROP COLUMN "gender",
ADD COLUMN     "ie" TEXT,
ADD COLUMN     "notes" TEXT,
ALTER COLUMN "address_line3" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user_business" DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- DropEnum
DROP TYPE "AccountType";

-- DropEnum
DROP TYPE "BusinessSyze";

-- DropEnum
DROP TYPE "BusinessType";

-- DropEnum
DROP TYPE "Gender";

-- DropEnum
DROP TYPE "OwnerType";

-- DropEnum
DROP TYPE "Status";

-- DropEnum
DROP TYPE "UserRole";

-- AddForeignKey
ALTER TABLE "business_bank_accounts" ADD CONSTRAINT "business_bank_accounts_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_apps" ADD CONSTRAINT "business_apps_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_apps" ADD CONSTRAINT "business_apps_apps_id_fkey" FOREIGN KEY ("apps_id") REFERENCES "apps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

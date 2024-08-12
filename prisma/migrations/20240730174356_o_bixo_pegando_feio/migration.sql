/*
  Warnings:

  - You are about to drop the column `birthdate` on the `persons` table. All the data in the column will be lost.
  - Added the required column `business_syze` to the `business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `business_type` to the `business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `marketplaceId` to the `business` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `state` on the `business` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `state` on the `persons` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "BusinessType" AS ENUM ('MICROEMPREENDEDOR_INDIVIDUAL', 'EMPRESARIO_INDIVIDUAL', 'SOCIEDADE_LIMITADA_UNIPESSOAL', 'SOCIEDADE_EMPRESARIA_LIMITADA', 'SOCIEDADE_SIMPLES', 'SOCIEDADE_ANONIMA', 'SEM_FINS_LUCRATIVOS');

-- CreateEnum
CREATE TYPE "BusinessSyze" AS ENUM ('MICRO', 'SMALL', 'MEDIUM', 'LARGE');

-- CreateEnum
CREATE TYPE "OwnerType" AS ENUM ('OWNER', 'REPRESENTATIVE', 'DIRECTOR', 'EXECUTIVE');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('CHECKING', 'SAVINGS');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserRole" ADD VALUE 'ROOT';
ALTER TYPE "UserRole" ADD VALUE 'CS';

-- AlterTable
ALTER TABLE "business" ADD COLUMN     "business_syze" "BusinessSyze" NOT NULL,
ADD COLUMN     "business_type" "BusinessType" NOT NULL,
ADD COLUMN     "marketplaceId" TEXT NOT NULL,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE',
DROP COLUMN "state",
ADD COLUMN     "state" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "persons" DROP COLUMN "birthdate",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE',
DROP COLUMN "state",
ADD COLUMN     "state" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user_business" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "user_terms" ADD COLUMN     "updated_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';

-- DropEnum
DROP TYPE "State";

-- CreateTable
CREATE TABLE "business_owners" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "person_id" TEXT NOT NULL,
    "owner_type" "OwnerType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "business_owners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_bank_accounts" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "bank" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "account" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "type" "AccountType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "business_bank_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apps" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "status" "Status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "apps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_apps" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "appsId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "business_apps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketpaces" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "marketpaces_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "business_owners" ADD CONSTRAINT "business_owners_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_owners" ADD CONSTRAINT "business_owners_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_bank_accounts" ADD CONSTRAINT "business_bank_accounts_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_apps" ADD CONSTRAINT "business_apps_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_apps" ADD CONSTRAINT "business_apps_appsId_fkey" FOREIGN KEY ("appsId") REFERENCES "apps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

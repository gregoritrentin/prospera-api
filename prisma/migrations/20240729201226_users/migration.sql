/*
  Warnings:

  - You are about to drop the `business_person` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- DropForeignKey
ALTER TABLE "business_person" DROP CONSTRAINT "business_person_businessId_fkey";

-- DropForeignKey
ALTER TABLE "business_person" DROP CONSTRAINT "business_person_personId_fkey";

-- AlterTable
ALTER TABLE "persons" ADD COLUMN     "birthdate" TIMESTAMP(3),
ADD COLUMN     "gender" "Gender";

-- DropTable
DROP TABLE "business_person";

-- CreateTable
CREATE TABLE "business_user" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,

    CONSTRAINT "business_user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "business_user_businessId_userId_key" ON "business_user"("businessId", "userId");

-- AddForeignKey
ALTER TABLE "business_user" ADD CONSTRAINT "business_user_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_user" ADD CONSTRAINT "business_user_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

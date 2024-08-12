/*
  Warnings:

  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'OWNER';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role";

-- CreateTable
CREATE TABLE "business_person" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,

    CONSTRAINT "business_person_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "business_person_businessId_personId_key" ON "business_person"("businessId", "personId");

-- AddForeignKey
ALTER TABLE "business_person" ADD CONSTRAINT "business_person_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_person" ADD CONSTRAINT "business_person_personId_fkey" FOREIGN KEY ("personId") REFERENCES "persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `businessId` on the `persons` table. All the data in the column will be lost.
  - Added the required column `business_id` to the `persons` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "persons" DROP CONSTRAINT "persons_businessId_fkey";

-- AlterTable
ALTER TABLE "persons" DROP COLUMN "businessId",
ADD COLUMN     "business_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "persons" ADD CONSTRAINT "persons_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

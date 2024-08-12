/*
  Warnings:

  - Added the required column `business_id` to the `persons` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "persons" ADD COLUMN     "business_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "persons" ADD CONSTRAINT "persons_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

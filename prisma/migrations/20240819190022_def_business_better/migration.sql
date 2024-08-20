/*
  Warnings:

  - You are about to drop the column `default_business` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_default_business_fkey";

-- AlterTable
ALTER TABLE "user_business" ADD COLUMN     "is_default_business" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "default_business",
ADD COLUMN     "businessId" TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE SET NULL ON UPDATE CASCADE;

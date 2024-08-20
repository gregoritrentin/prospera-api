/*
  Warnings:

  - You are about to drop the column `is_default_business` on the `user_business` table. All the data in the column will be lost.
  - You are about to drop the column `businessId` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_businessId_fkey";

-- DropIndex
DROP INDEX "user_business_business_id_user_id_is_default_business_key";

-- AlterTable
ALTER TABLE "user_business" DROP COLUMN "is_default_business";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "businessId",
ADD COLUMN     "default_business" TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_default_business_fkey" FOREIGN KEY ("default_business") REFERENCES "business"("id") ON DELETE SET NULL ON UPDATE CASCADE;

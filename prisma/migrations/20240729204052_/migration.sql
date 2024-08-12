/*
  Warnings:

  - You are about to drop the column `businessId` on the `user_business` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `user_business` table. All the data in the column will be lost.
  - You are about to drop the column `termId` on the `user_terms` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `user_terms` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[business_id,user_id]` on the table `user_business` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,term_id]` on the table `user_terms` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `business_id` to the `user_business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `user_business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `term_id` to the `user_terms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `user_terms` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "user_business" DROP CONSTRAINT "user_business_businessId_fkey";

-- DropForeignKey
ALTER TABLE "user_business" DROP CONSTRAINT "user_business_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_terms" DROP CONSTRAINT "user_terms_termId_fkey";

-- DropForeignKey
ALTER TABLE "user_terms" DROP CONSTRAINT "user_terms_userId_fkey";

-- DropIndex
DROP INDEX "user_business_businessId_userId_key";

-- DropIndex
DROP INDEX "user_terms_userId_termId_key";

-- AlterTable
ALTER TABLE "user_business" DROP COLUMN "businessId",
DROP COLUMN "userId",
ADD COLUMN     "business_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user_terms" DROP COLUMN "termId",
DROP COLUMN "userId",
ADD COLUMN     "term_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_business_business_id_user_id_key" ON "user_business"("business_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_terms_user_id_term_id_key" ON "user_terms"("user_id", "term_id");

-- AddForeignKey
ALTER TABLE "user_terms" ADD CONSTRAINT "user_terms_term_id_fkey" FOREIGN KEY ("term_id") REFERENCES "terms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_terms" ADD CONSTRAINT "user_terms_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_business" ADD CONSTRAINT "user_business_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_business" ADD CONSTRAINT "user_business_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

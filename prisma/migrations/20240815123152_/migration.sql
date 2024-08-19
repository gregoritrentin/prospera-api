/*
  Warnings:

  - You are about to drop the column `businessId` on the `item_group` table. All the data in the column will be lost.
  - You are about to drop the column `businessId` on the `item_taxation` table. All the data in the column will be lost.
  - You are about to drop the column `businessId` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `groupId` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `itemType` on the `items` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[business_id,id_aux]` on the table `items` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `business_id` to the `item_group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `business_id` to the `item_taxation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `business_id` to the `items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `item_type` to the `items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "item_group" DROP CONSTRAINT "item_group_businessId_fkey";

-- DropForeignKey
ALTER TABLE "item_taxation" DROP CONSTRAINT "item_taxation_businessId_fkey";

-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_businessId_fkey";

-- DropIndex
DROP INDEX "items_businessId_id_aux_key";

-- AlterTable
ALTER TABLE "item_group" DROP COLUMN "businessId",
ADD COLUMN     "business_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "item_taxation" DROP COLUMN "businessId",
ADD COLUMN     "business_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "items" DROP COLUMN "businessId",
DROP COLUMN "groupId",
DROP COLUMN "itemType",
ADD COLUMN     "business_id" TEXT NOT NULL,
ADD COLUMN     "group_id" TEXT,
ADD COLUMN     "item_type" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "items_business_id_id_aux_key" ON "items"("business_id", "id_aux");

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_group" ADD CONSTRAINT "item_group_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_taxation" ADD CONSTRAINT "item_taxation_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

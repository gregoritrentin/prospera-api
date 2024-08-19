/*
  Warnings:

  - Added the required column `status` to the `item_group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `item_taxation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "item_group" ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "item_taxation" ADD COLUMN     "status" TEXT NOT NULL;

/*
  Warnings:

  - Added the required column `slug` to the `business` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "business" ADD COLUMN     "slug" TEXT NOT NULL;

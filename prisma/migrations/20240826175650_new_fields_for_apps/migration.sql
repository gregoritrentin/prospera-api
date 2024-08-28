/*
  Warnings:

  - Added the required column `quantity` to the `apps` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `apps` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "apps" ADD COLUMN     "quantity" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;

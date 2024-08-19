/*
  Warnings:

  - Made the column `id_aux` on table `items` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "items" ALTER COLUMN "id_aux" SET NOT NULL;

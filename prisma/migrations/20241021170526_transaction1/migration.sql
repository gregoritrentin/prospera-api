/*
  Warnings:

  - Made the column `pix_id` on table `transactios_pix` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pix_qr_code` on table `transactios_pix` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "transactios_pix" ALTER COLUMN "pix_id" SET NOT NULL,
ALTER COLUMN "pix_qr_code" SET NOT NULL;

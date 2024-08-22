/*
  Warnings:

  - You are about to drop the column `photo_url` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "photo_url",
ADD COLUMN     "file_id" TEXT;

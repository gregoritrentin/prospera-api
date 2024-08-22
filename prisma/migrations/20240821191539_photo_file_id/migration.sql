/*
  Warnings:

  - You are about to drop the column `photo_url` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_photo_url_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "photo_url",
ADD COLUMN     "photo_file_id" TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_photo_file_id_fkey" FOREIGN KEY ("photo_file_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

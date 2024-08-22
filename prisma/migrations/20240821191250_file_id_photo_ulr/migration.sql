/*
  Warnings:

  - You are about to drop the column `file_id` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "file_id",
ADD COLUMN     "photo_url" TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_photo_url_fkey" FOREIGN KEY ("photo_url") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

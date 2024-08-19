/*
  Warnings:

  - You are about to drop the column `photoUrl` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "photoUrl",
ADD COLUMN     "photo_url" TEXT;

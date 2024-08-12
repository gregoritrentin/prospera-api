/*
  Warnings:

  - You are about to drop the column `updateAt` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "updateAt",
ADD COLUMN     "updated_at" TIMESTAMP(3);

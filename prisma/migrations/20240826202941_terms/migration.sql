/*
  Warnings:

  - You are about to drop the column `term` on the `terms` table. All the data in the column will be lost.
  - Added the required column `content` to the `terms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language` to the `terms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startAt` to the `terms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `terms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "terms" DROP COLUMN "term",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "language" TEXT NOT NULL,
ADD COLUMN     "startAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

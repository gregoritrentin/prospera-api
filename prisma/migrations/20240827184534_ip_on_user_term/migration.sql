/*
  Warnings:

  - Added the required column `ip` to the `user_terms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_terms" ADD COLUMN     "ip" TEXT NOT NULL;

/*
  Warnings:

  - A unique constraint covering the columns `[document]` on the table `marketplaces` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `document` to the `marketplaces` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "marketplaces" ADD COLUMN     "document" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "marketplaces_document_key" ON "marketplaces"("document");

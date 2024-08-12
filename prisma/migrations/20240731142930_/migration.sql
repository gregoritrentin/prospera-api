/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `marketpaces` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "marketpaces_name_key" ON "marketpaces"("name");

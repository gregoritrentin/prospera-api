/*
  Warnings:

  - A unique constraint covering the columns `[id,business_id]` on the table `invoices` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "invoices_id_business_id_key" ON "invoices"("id", "business_id");

/*
  Warnings:

  - A unique constraint covering the columns `[business_id,document]` on the table `persons` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "persons_business_id_document_key" ON "persons"("business_id", "document");

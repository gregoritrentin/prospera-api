/*
  Warnings:

  - A unique constraint covering the columns `[transaction_id]` on the table `transaction_boletos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[transaction_id]` on the table `transaction_splits` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "transaction_boletos_transaction_id_key" ON "transaction_boletos"("transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "transaction_splits_transaction_id_key" ON "transaction_splits"("transaction_id");

/*
  Warnings:

  - You are about to drop the `transactions_boletos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "transactions_boletos" DROP CONSTRAINT "transactions_boletos_file_pdf_id_fkey";

-- DropForeignKey
ALTER TABLE "transactions_boletos" DROP CONSTRAINT "transactions_boletos_transaction_id_fkey";

-- DropTable
DROP TABLE "transactions_boletos";

-- CreateTable
CREATE TABLE "transaction_boletos" (
    "id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "document_type" "BoletoDocumentType" NOT NULL,
    "our_number" TEXT NOT NULL,
    "digitable_line" TEXT NOT NULL,
    "barcode" TEXT NOT NULL,
    "pix_qr_code" TEXT NOT NULL,
    "pix_id" TEXT NOT NULL,
    "pdf_file_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "transaction_boletos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transaction_boletos_transaction_id_key" ON "transaction_boletos"("transaction_id");

-- AddForeignKey
ALTER TABLE "transaction_boletos" ADD CONSTRAINT "transaction_boletos_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_boletos" ADD CONSTRAINT "transaction_boletos_pdf_file_id_fkey" FOREIGN KEY ("pdf_file_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

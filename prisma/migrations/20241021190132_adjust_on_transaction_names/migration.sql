/*
  Warnings:

  - You are about to drop the `transactios_boletos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transactios_pix` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "transactios_boletos" DROP CONSTRAINT "transactios_boletos_file_pdf_id_fkey";

-- DropForeignKey
ALTER TABLE "transactios_boletos" DROP CONSTRAINT "transactios_boletos_transaction_id_fkey";

-- DropForeignKey
ALTER TABLE "transactios_pix" DROP CONSTRAINT "transactios_pix_transaction_id_fkey";

-- DropTable
DROP TABLE "transactios_boletos";

-- DropTable
DROP TABLE "transactios_pix";

-- CreateTable
CREATE TABLE "transactions_pix" (
    "id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "pix_type" "pixType" NOT NULL,
    "pix_id" TEXT NOT NULL,
    "pix_qr_code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "transactions_pix_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions_boletos" (
    "id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "document_type" "BoletoDocumentType" NOT NULL,
    "our_number" TEXT NOT NULL,
    "digitable_line" TEXT NOT NULL,
    "barcode" TEXT NOT NULL,
    "pix_qr_code" TEXT NOT NULL,
    "pix_id" TEXT NOT NULL,
    "file_pdf_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "transactions_boletos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transactions_pix_transaction_id_key" ON "transactions_pix"("transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_boletos_transaction_id_key" ON "transactions_boletos"("transaction_id");

-- AddForeignKey
ALTER TABLE "transactions_pix" ADD CONSTRAINT "transactions_pix_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions_boletos" ADD CONSTRAINT "transactions_boletos_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions_boletos" ADD CONSTRAINT "transactions_boletos_file_pdf_id_fkey" FOREIGN KEY ("file_pdf_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

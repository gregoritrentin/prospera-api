-- CreateTable
CREATE TABLE "transactios_pix" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "person_id" TEXT NOT NULL,
    "document_type" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "paymend_date" TIMESTAMP(3),
    "payment_limit_date" TIMESTAMP(3),
    "amount" DOUBLE PRECISION NOT NULL,
    "fee_amount" DOUBLE PRECISION NOT NULL,
    "payment_amount" DOUBLE PRECISION,
    "pix_id" TEXT,
    "pix_qr_code" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "transactios_pix_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transactios_pix" ADD CONSTRAINT "transactios_pix_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactios_pix" ADD CONSTRAINT "transactios_pix_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

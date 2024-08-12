-- AddForeignKey
ALTER TABLE "business" ADD CONSTRAINT "business_marketplace_id_fkey" FOREIGN KEY ("marketplace_id") REFERENCES "marketpaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

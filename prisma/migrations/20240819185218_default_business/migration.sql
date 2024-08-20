-- AlterTable
ALTER TABLE "users" ADD COLUMN     "default_business" TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_default_business_fkey" FOREIGN KEY ("default_business") REFERENCES "business"("id") ON DELETE SET NULL ON UPDATE CASCADE;

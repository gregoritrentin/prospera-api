-- DropForeignKey
ALTER TABLE "emails" DROP CONSTRAINT "emails_business_id_fkey";

-- AlterTable
ALTER TABLE "emails" ALTER COLUMN "business_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "emails" ADD CONSTRAINT "emails_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE SET NULL ON UPDATE CASCADE;

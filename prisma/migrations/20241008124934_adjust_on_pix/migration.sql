-- DropForeignKey
ALTER TABLE "transactios_pix" DROP CONSTRAINT "transactios_pix_person_id_fkey";

-- AlterTable
ALTER TABLE "transactios_pix" ALTER COLUMN "person_id" DROP NOT NULL,
ALTER COLUMN "due_date" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "transactios_pix" ADD CONSTRAINT "transactios_pix_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_group_id_fkey";

-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_taxation_id_fkey";

-- AlterTable
ALTER TABLE "items" ALTER COLUMN "taxation_id" DROP NOT NULL,
ALTER COLUMN "group_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "item_group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_taxation_id_fkey" FOREIGN KEY ("taxation_id") REFERENCES "item_taxation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

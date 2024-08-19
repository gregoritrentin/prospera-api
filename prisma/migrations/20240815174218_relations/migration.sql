/*
  Warnings:

  - Made the column `taxation_id` on table `items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `group_id` on table `items` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "items" ALTER COLUMN "taxation_id" SET NOT NULL,
ALTER COLUMN "group_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "item_group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_taxation_id_fkey" FOREIGN KEY ("taxation_id") REFERENCES "item_taxation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

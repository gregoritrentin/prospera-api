/*
  Warnings:

  - You are about to drop the column `apps_id` on the `business_apps` table. All the data in the column will be lost.
  - Added the required column `app_id` to the `business_apps` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "business_apps" DROP CONSTRAINT "business_apps_apps_id_fkey";

-- AlterTable
ALTER TABLE "business_apps" DROP COLUMN "apps_id",
ADD COLUMN     "app_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "business_apps" ADD CONSTRAINT "business_apps_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "apps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

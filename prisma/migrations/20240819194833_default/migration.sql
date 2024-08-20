/*
  Warnings:

  - A unique constraint covering the columns `[business_id,user_id,is_default_business]` on the table `user_business` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_business_business_id_user_id_is_default_business_key" ON "user_business"("business_id", "user_id", "is_default_business");

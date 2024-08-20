/*
  Warnings:

  - You are about to drop the `PriceList` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "PriceList";

-- CreateTable
CREATE TABLE "price_list" (
    "id" TEXT NOT NULL,
    "price_list" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "price_list_pkey" PRIMARY KEY ("id")
);

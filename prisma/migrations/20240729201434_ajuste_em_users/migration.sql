/*
  Warnings:

  - You are about to drop the `business_user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "business_user" DROP CONSTRAINT "business_user_businessId_fkey";

-- DropForeignKey
ALTER TABLE "business_user" DROP CONSTRAINT "business_user_userId_fkey";

-- DropTable
DROP TABLE "business_user";

-- CreateTable
CREATE TABLE "user_business" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,

    CONSTRAINT "user_business_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_business_businessId_userId_key" ON "user_business"("businessId", "userId");

-- AddForeignKey
ALTER TABLE "user_business" ADD CONSTRAINT "user_business_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_business" ADD CONSTRAINT "user_business_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

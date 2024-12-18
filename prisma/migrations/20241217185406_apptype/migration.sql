/*
  Warnings:

  - Changed the type of `type` on the `apps` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AppType" AS ENUM ('UNIT', 'PERCENTAGE');

-- AlterTable
ALTER TABLE "apps" DROP COLUMN "type",
ADD COLUMN     "type" "AppType" NOT NULL;

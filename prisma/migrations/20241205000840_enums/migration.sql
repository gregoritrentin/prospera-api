-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AbrasfVersion" ADD VALUE 'v20';
ALTER TYPE "AbrasfVersion" ADD VALUE 'v201';
ALTER TYPE "AbrasfVersion" ADD VALUE 'v202';
ALTER TYPE "AbrasfVersion" ADD VALUE 'v203';

/*
  Warnings:

  - The values [v10] on the enum `AbrasfVersion` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AbrasfVersion_new" AS ENUM ('v100', 'v200', 'v201', 'v202', 'v203', 'v204');
ALTER TABLE "nfse_city_configurations" ALTER COLUMN "abrasf_version" TYPE "AbrasfVersion_new" USING ("abrasf_version"::text::"AbrasfVersion_new");
ALTER TYPE "AbrasfVersion" RENAME TO "AbrasfVersion_old";
ALTER TYPE "AbrasfVersion_new" RENAME TO "AbrasfVersion";
DROP TYPE "AbrasfVersion_old";
COMMIT;

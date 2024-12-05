/*
  Warnings:

  - Added the required column `namespace` to the `nfse_city_configurations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider` to the `nfse_city_configurations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schema_version` to the `nfse_city_configurations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "nfse_city_configurations" ADD COLUMN     "namespace" TEXT NOT NULL,
ADD COLUMN     "provider" TEXT NOT NULL,
ADD COLUMN     "schema_version" TEXT NOT NULL,
ADD COLUMN     "soap_version" TEXT NOT NULL DEFAULT '1.1',
ADD COLUMN     "xml_sign_method" TEXT NOT NULL DEFAULT 'SHA1',
ALTER COLUMN "timeout" SET DEFAULT 30000,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

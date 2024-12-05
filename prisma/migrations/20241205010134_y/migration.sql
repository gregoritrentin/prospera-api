/*
  Warnings:

  - You are about to drop the column `namespace` on the `nfse_city_configurations` table. All the data in the column will be lost.
  - You are about to drop the column `schema_version` on the `nfse_city_configurations` table. All the data in the column will be lost.
  - You are about to drop the column `soap_version` on the `nfse_city_configurations` table. All the data in the column will be lost.
  - You are about to drop the column `specific_fields` on the `nfse_city_configurations` table. All the data in the column will be lost.
  - You are about to drop the column `timeout` on the `nfse_city_configurations` table. All the data in the column will be lost.
  - You are about to drop the column `xml_sign_method` on the `nfse_city_configurations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "nfse_city_configurations" DROP COLUMN "namespace",
DROP COLUMN "schema_version",
DROP COLUMN "soap_version",
DROP COLUMN "specific_fields",
DROP COLUMN "timeout",
DROP COLUMN "xml_sign_method";

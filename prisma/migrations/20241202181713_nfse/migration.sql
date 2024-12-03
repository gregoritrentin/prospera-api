-- CreateEnum
CREATE TYPE "NfseSubstituteReason" AS ENUM ('REGISTRATION_ERROR', 'VALUE_ERROR', 'SERVICE_ERROR', 'OTHER');

-- CreateEnum
CREATE TYPE "NfseCancelReason" AS ENUM ('DUPLICATE_EMISSION', 'FILLING_ERROR', 'SERVICE_NOT_PROVIDED', 'FRAUD', 'OTHER');

-- CreateEnum
CREATE TYPE "RpsType" AS ENUM ('RPS', 'NFCONJUGADA', 'CUPOM');

-- CreateEnum
CREATE TYPE "NfseEventType" AS ENUM ('ISSUANCE', 'CANCELLATION', 'QUERY', 'REPLACEMENT', 'AUTHORIZATION', 'REJECTION', 'PROCESSING', 'BATCH_PROCESSING', 'ERROR_CORRECTION', 'STATUS_UPDATE');

-- CreateEnum
CREATE TYPE "NfseEventStatus" AS ENUM ('SUCCESS', 'ERROR', 'WARNING', 'PENDING', 'TIMEOUT', 'PARTIAL');

-- CreateEnum
CREATE TYPE "AbrasfVersion" AS ENUM ('v10', 'v204');

-- CreateEnum
CREATE TYPE "IssRequirement" AS ENUM ('EXIGIVEL', 'ISENTO', 'IMUNE', 'EXPORTACAO', 'SUSPENSO_DECISAO_JUDICIAL', 'SUSPENSO_PROCESSO_ADMIN');

-- CreateEnum
CREATE TYPE "OperationType" AS ENUM ('TAXATION_IN_CITY', 'TAXATION_OUT_CITY', 'EXEMPTION', 'IMMUNE', 'SUSPENDED_JUDICIAL', 'SUSPENDED_ADMINISTRATIVE');

-- CreateEnum
CREATE TYPE "NfseStatus" AS ENUM ('AUTHORIZED', 'CANCELED', 'DRAFT', 'PENDING', 'ERROR', 'REPLACED', 'PROCESSING', 'REJECTED');

-- CreateEnum
CREATE TYPE "ServiceCode" AS ENUM ('S01_01', 'S01_02', 'S01_03', 'S01_04', 'S01_05', 'S01_06', 'S01_07', 'S01_08', 'S01_09', 'S02_01', 'S03_02', 'S03_03', 'S03_04', 'S03_05', 'S04_01', 'S04_02', 'S04_03', 'S04_04', 'S04_05', 'S04_06', 'S04_07', 'S04_08', 'S04_09', 'S04_10', 'S04_11', 'S04_12', 'S04_13', 'S04_14', 'S04_15', 'S04_16', 'S04_17', 'S04_18', 'S04_19', 'S04_20', 'S04_21', 'S04_22', 'S04_23', 'S05_01', 'S05_02', 'S05_03', 'S05_04', 'S05_05', 'S05_06', 'S05_07', 'S05_08', 'S05_09', 'S06_01', 'S06_02', 'S06_03', 'S06_04', 'S06_05', 'S06_06', 'S07_01', 'S07_02', 'S07_03', 'S07_04', 'S07_05', 'S07_06', 'S07_07', 'S07_08', 'S07_09', 'S07_10', 'S07_11', 'S07_12', 'S07_13', 'S07_14', 'S07_15', 'S07_16', 'S07_17', 'S07_18', 'S07_19', 'S07_20', 'S08_01', 'S08_02', 'S09_01', 'S09_02', 'S09_03', 'S10_01', 'S10_02', 'S10_03', 'S10_04', 'S10_05', 'S10_06', 'S10_07', 'S10_08', 'S10_09', 'S10_10', 'S11_01', 'S11_02', 'S11_03', 'S11_04', 'S12_01', 'S12_02', 'S12_03', 'S12_04', 'S12_05', 'S12_06', 'S12_07', 'S12_08', 'S12_09', 'S12_10', 'S12_11', 'S12_12', 'S12_13', 'S12_14', 'S12_15', 'S12_16', 'S12_17', 'S13_01', 'S13_02', 'S13_03', 'S13_04', 'S14_01', 'S14_02', 'S14_03', 'S14_04', 'S14_05', 'S14_06', 'S14_07', 'S14_08', 'S14_09', 'S14_10', 'S14_11', 'S14_12', 'S14_13', 'S15_01', 'S15_02', 'S15_03', 'S15_04', 'S15_05', 'S15_06', 'S15_07', 'S15_08', 'S15_09', 'S15_10', 'S15_11', 'S15_12', 'S15_13', 'S15_14', 'S15_15', 'S15_16', 'S15_17', 'S15_18', 'S16_01', 'S16_02', 'S17_01', 'S17_02', 'S17_03', 'S17_04', 'S17_05', 'S17_06', 'S17_07', 'S17_08', 'S17_09', 'S17_10', 'S17_11', 'S17_12', 'S17_13', 'S17_14', 'S17_15', 'S17_16', 'S17_17', 'S17_18', 'S17_19', 'S17_20', 'S17_21', 'S17_22', 'S17_23', 'S17_24', 'S18_01', 'S19_01', 'S20_01', 'S20_02', 'S20_03', 'S21_01', 'S22_01', 'S23_01', 'S24_01', 'S25_01', 'S25_02', 'S25_03', 'S25_04', 'S26_01', 'S27_01', 'S28_01', 'S29_01', 'S30_01', 'S31_01', 'S32_01', 'S33_01', 'S34_01', 'S35_01', 'S36_01', 'S37_01', 'S38_01', 'S39_01', 'S40_01');

-- CreateTable
CREATE TABLE "nfses" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "person_id" TEXT NOT NULL,
    "rps_number" TEXT NOT NULL,
    "rps_series" TEXT NOT NULL,
    "rps_type" "RpsType" NOT NULL,
    "issue_date" TIMESTAMP(3) NOT NULL,
    "competence_date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "additional_information" TEXT NOT NULL,
    "operation_type" "OperationType" NOT NULL,
    "service_code" "ServiceCode" NOT NULL,
    "iss_requirement" "IssRequirement" NOT NULL,
    "cnae_code" TEXT NOT NULL,
    "city_tax_code" TEXT,
    "retention_iss" BOOLEAN NOT NULL,
    "service_amount" DECIMAL(10,2) NOT NULL,
    "unconditional_discount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "conditional_discount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "calculation_base" DECIMAL(10,2) NOT NULL,
    "net_amount" DECIMAL(10,2) NOT NULL,
    "iss_rate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "pis_rate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "cofins_rate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "ir_rate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "inss_rate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "csll_rate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "iss_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "pis_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "cofins_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "inss_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "ir_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "csll_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "other_retentions" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "incidende_state" TEXT NOT NULL,
    "incidende_city" TEXT NOT NULL,
    "service_state" TEXT NOT NULL,
    "service_city" TEXT NOT NULL,
    "status" "NfseStatus" NOT NULL,
    "batch_number" TEXT,
    "protocol" TEXT,
    "nfse_number" TEXT,
    "substitute_nfse_number" TEXT,
    "substitute_reason" "NfseSubstituteReason",
    "cancel_reason" "NfseCancelReason",
    "pdf_file_id" TEXT,
    "xml_file_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "canceled_at" TIMESTAMP(3),

    CONSTRAINT "nfses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nfse_events" (
    "id" TEXT NOT NULL,
    "nfse_id" TEXT NOT NULL,
    "type" "NfseEventType" NOT NULL,
    "status" "NfseEventStatus" NOT NULL,
    "message" TEXT,
    "request_xml" TEXT,
    "response_xml" TEXT,
    "return_message" TEXT,
    "payload" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "nfse_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nfse_city_configurations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city_code" TEXT NOT NULL,
    "state_code" TEXT NOT NULL,
    "abrasf_version" "AbrasfVersion" NOT NULL,
    "sandbox_url" TEXT NOT NULL,
    "production_url" TEXT NOT NULL,
    "query_url" TEXT,
    "timeout" INTEGER NOT NULL,
    "specific_fields" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "nfse_city_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "nfses_business_id_idx" ON "nfses"("business_id");

-- CreateIndex
CREATE INDEX "nfses_person_id_idx" ON "nfses"("person_id");

-- CreateIndex
CREATE INDEX "nfses_rps_number_idx" ON "nfses"("rps_number");

-- CreateIndex
CREATE INDEX "nfses_nfse_number_idx" ON "nfses"("nfse_number");

-- CreateIndex
CREATE INDEX "nfses_status_idx" ON "nfses"("status");

-- CreateIndex
CREATE INDEX "nfses_issue_date_idx" ON "nfses"("issue_date");

-- CreateIndex
CREATE INDEX "nfse_events_nfse_id_idx" ON "nfse_events"("nfse_id");

-- CreateIndex
CREATE INDEX "nfse_events_type_idx" ON "nfse_events"("type");

-- CreateIndex
CREATE INDEX "nfse_events_created_at_idx" ON "nfse_events"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "nfse_city_configurations_city_code_key" ON "nfse_city_configurations"("city_code");

-- AddForeignKey
ALTER TABLE "nfses" ADD CONSTRAINT "nfses_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfses" ADD CONSTRAINT "nfses_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfses" ADD CONSTRAINT "nfses_incidende_city_fkey" FOREIGN KEY ("incidende_city") REFERENCES "cities"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfses" ADD CONSTRAINT "nfses_incidende_state_fkey" FOREIGN KEY ("incidende_state") REFERENCES "states"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfses" ADD CONSTRAINT "nfses_service_city_fkey" FOREIGN KEY ("service_city") REFERENCES "cities"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfses" ADD CONSTRAINT "nfses_service_state_fkey" FOREIGN KEY ("service_state") REFERENCES "states"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfses" ADD CONSTRAINT "nfses_pdf_file_id_fkey" FOREIGN KEY ("pdf_file_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfses" ADD CONSTRAINT "nfses_xml_file_id_fkey" FOREIGN KEY ("xml_file_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfse_events" ADD CONSTRAINT "nfse_events_nfse_id_fkey" FOREIGN KEY ("nfse_id") REFERENCES "nfses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfse_city_configurations" ADD CONSTRAINT "nfse_city_configurations_city_code_fkey" FOREIGN KEY ("city_code") REFERENCES "cities"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfse_city_configurations" ADD CONSTRAINT "nfse_city_configurations_state_code_fkey" FOREIGN KEY ("state_code") REFERENCES "states"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

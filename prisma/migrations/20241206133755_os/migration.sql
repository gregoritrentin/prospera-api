-- AlterTable
ALTER TABLE "service_orders" ADD COLUMN     "finished_at" TIMESTAMP(3),
ADD COLUMN     "scheduled_at" TIMESTAMP(3),
ADD COLUMN     "started_at" TIMESTAMP(3);

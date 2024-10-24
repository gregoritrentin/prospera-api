-- CreateTable
CREATE TABLE "whatsapps" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "whatsapps_pkey" PRIMARY KEY ("id")
);

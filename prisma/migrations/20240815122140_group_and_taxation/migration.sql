-- CreateTable
CREATE TABLE "items" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "itemType" TEXT NOT NULL,
    "id_aux" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "groupId" TEXT,
    "taxation_id" TEXT,
    "ncm" TEXT,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_group" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "group" TEXT NOT NULL,

    CONSTRAINT "item_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_taxation" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "taxation" TEXT NOT NULL,

    CONSTRAINT "item_taxation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "items_businessId_id_aux_key" ON "items"("businessId", "id_aux");

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_group" ADD CONSTRAINT "item_group_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_taxation" ADD CONSTRAINT "item_taxation_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "account_balance_snapshots" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "account_balance_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "account_balance_snapshots_account_id_idx" ON "account_balance_snapshots"("account_id");

-- CreateIndex
CREATE INDEX "account_balance_snapshots_month_year_idx" ON "account_balance_snapshots"("month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "account_balance_snapshots_account_id_month_year_key" ON "account_balance_snapshots"("account_id", "month", "year");

-- AddForeignKey
ALTER TABLE "account_balance_snapshots" ADD CONSTRAINT "account_balance_snapshots_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "two_factor_authentications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "two_factor_authentications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "two_factor_authentications_userId_type_idx" ON "two_factor_authentications"("userId", "type");

-- AddForeignKey
ALTER TABLE "two_factor_authentications" ADD CONSTRAINT "two_factor_authentications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

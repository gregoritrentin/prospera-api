/*
  Warnings:

  - Added the required column `filePdfId` to the `transactios_boletos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transactios_boletos" ADD COLUMN     "filePdfId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "transactios_boletos" ADD CONSTRAINT "transactios_boletos_filePdfId_fkey" FOREIGN KEY ("filePdfId") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

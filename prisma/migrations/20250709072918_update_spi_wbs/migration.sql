/*
  Warnings:

  - You are about to drop the column `no_so` on the `SuratTugas` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `SuratTugas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SuratTugas" DROP COLUMN "no_so",
DROP COLUMN "status",
ADD COLUMN     "spi" TEXT,
ADD COLUMN     "wbs" TEXT;

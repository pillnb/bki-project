/*
  Warnings:

  - The values [DIAJUKAN,MENUNGGU_APPROVAL] on the enum `StatusSuratTugas` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `klien` on the `SuratTugas` table. All the data in the column will be lost.
  - You are about to drop the column `lokasi_pekerjaan` on the `SuratTugas` table. All the data in the column will be lost.
  - You are about to drop the column `pekerjaan` on the `SuratTugas` table. All the data in the column will be lost.
  - The primary key for the `pegawai` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `PegawaiSuratTugas` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StatusSuratTugas_new" AS ENUM ('DRAFT', 'MENUNGGU_LEAD', 'MENUNGGU_KOORDINATOR', 'MENUNGGU_SM', 'MENUNGGU_KACAB', 'DISETUJUI', 'BERJALAN', 'SELESAI', 'DITOLAK');
ALTER TABLE "SuratTugas" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "SuratTugas" ALTER COLUMN "status" TYPE "StatusSuratTugas_new" USING ("status"::text::"StatusSuratTugas_new");
ALTER TYPE "StatusSuratTugas" RENAME TO "StatusSuratTugas_old";
ALTER TYPE "StatusSuratTugas_new" RENAME TO "StatusSuratTugas";
DROP TYPE "StatusSuratTugas_old";
ALTER TABLE "SuratTugas" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;

-- DropForeignKey
ALTER TABLE "PegawaiSuratTugas" DROP CONSTRAINT "PegawaiSuratTugas_pegawaiNup_fkey";

-- DropForeignKey
ALTER TABLE "PegawaiSuratTugas" DROP CONSTRAINT "PegawaiSuratTugas_suratTugasId_fkey";

-- AlterTable
ALTER TABLE "SuratTugas" DROP COLUMN "klien",
DROP COLUMN "lokasi_pekerjaan",
DROP COLUMN "pekerjaan",
ADD COLUMN     "catatanPenolakan" TEXT,
ADD COLUMN     "dibuatOlehId" INTEGER,
ADD COLUMN     "disetujuiKacabAt" TIMESTAMP(3),
ADD COLUMN     "disetujuiKoorAt" TIMESTAMP(3),
ADD COLUMN     "disetujuiLeadAt" TIMESTAMP(3),
ADD COLUMN     "disetujuiSmAt" TIMESTAMP(3),
ADD COLUMN     "kepalaCabangId" INTEGER,
ADD COLUMN     "koordinatorId" INTEGER,
ADD COLUMN     "leadInspectorId" INTEGER,
ADD COLUMN     "proyekId" INTEGER,
ADD COLUMN     "seniorManagerId" INTEGER,
ALTER COLUMN "status" SET DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "pegawai" DROP CONSTRAINT "pegawai_pkey" CASCADE,
ADD COLUMN     "tandaTanganUrl" TEXT,
ADD CONSTRAINT "pegawai_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "PegawaiSuratTugas";

-- CreateTable
CREATE TABLE "Proyek" (
    "id" SERIAL NOT NULL,
    "namaProyek" TEXT NOT NULL,
    "klien" TEXT NOT NULL,
    "lokasi" TEXT NOT NULL,

    CONSTRAINT "Proyek_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TimInspektor" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_TimInspektor_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TimInspektor_B_index" ON "_TimInspektor"("B");

-- AddForeignKey
ALTER TABLE "SuratTugas" ADD CONSTRAINT "SuratTugas_proyekId_fkey" FOREIGN KEY ("proyekId") REFERENCES "Proyek"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuratTugas" ADD CONSTRAINT "SuratTugas_leadInspectorId_fkey" FOREIGN KEY ("leadInspectorId") REFERENCES "pegawai"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuratTugas" ADD CONSTRAINT "SuratTugas_koordinatorId_fkey" FOREIGN KEY ("koordinatorId") REFERENCES "pegawai"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuratTugas" ADD CONSTRAINT "SuratTugas_seniorManagerId_fkey" FOREIGN KEY ("seniorManagerId") REFERENCES "pegawai"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuratTugas" ADD CONSTRAINT "SuratTugas_kepalaCabangId_fkey" FOREIGN KEY ("kepalaCabangId") REFERENCES "pegawai"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuratTugas" ADD CONSTRAINT "SuratTugas_dibuatOlehId_fkey" FOREIGN KEY ("dibuatOlehId") REFERENCES "pegawai"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TimInspektor" ADD CONSTRAINT "_TimInspektor_A_fkey" FOREIGN KEY ("A") REFERENCES "SuratTugas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TimInspektor" ADD CONSTRAINT "_TimInspektor_B_fkey" FOREIGN KEY ("B") REFERENCES "pegawai"("id") ON DELETE CASCADE ON UPDATE CASCADE;

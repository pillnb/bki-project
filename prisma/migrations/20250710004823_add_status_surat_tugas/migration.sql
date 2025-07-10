-- CreateEnum
CREATE TYPE "StatusSuratTugas" AS ENUM ('DIAJUKAN', 'MENUNGGU_APPROVAL', 'SELESAI', 'DITOLAK');

-- AlterTable
ALTER TABLE "SuratTugas" ADD COLUMN     "status" "StatusSuratTugas" NOT NULL DEFAULT 'DIAJUKAN';

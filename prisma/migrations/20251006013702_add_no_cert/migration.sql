-- CreateEnum
CREATE TYPE "public"."StatusSertifikat" AS ENUM ('PENDING_APPROVAL', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "public"."SuratTugas" ALTER COLUMN "status" SET DEFAULT 'MENUNGGU_LEAD';

-- CreateTable
CREATE TABLE "public"."Sertifikat" (
    "id" SERIAL NOT NULL,
    "pengajuId" INTEGER NOT NULL,
    "nomorKontrak" TEXT NOT NULL,
    "kompetensi" TEXT NOT NULL,
    "pasar" TEXT NOT NULL,
    "kodeProduksiM" TEXT,
    "kodeProduksiE" TEXT,
    "jumlahHalaman" INTEGER,
    "linkLaporan" TEXT NOT NULL,
    "nomorSertifikat" TEXT,
    "qrCodeDriveId" TEXT,
    "qrCodeUrl" TEXT,
    "qrCodeImageUrl" TEXT,
    "status" "public"."StatusSertifikat" NOT NULL DEFAULT 'PENDING_APPROVAL',
    "approvedBy" INTEGER,
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "keterangan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sertifikat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SertifikatCounter" (
    "id" SERIAL NOT NULL,
    "tahun" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SertifikatCounter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sertifikat_nomorSertifikat_key" ON "public"."Sertifikat"("nomorSertifikat");

-- CreateIndex
CREATE INDEX "Sertifikat_pengajuId_idx" ON "public"."Sertifikat"("pengajuId");

-- CreateIndex
CREATE INDEX "Sertifikat_status_idx" ON "public"."Sertifikat"("status");

-- CreateIndex
CREATE UNIQUE INDEX "SertifikatCounter_tahun_key" ON "public"."SertifikatCounter"("tahun");

-- AddForeignKey
ALTER TABLE "public"."Sertifikat" ADD CONSTRAINT "Sertifikat_pengajuId_fkey" FOREIGN KEY ("pengajuId") REFERENCES "public"."pegawai"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Sertifikat" ADD CONSTRAINT "Sertifikat_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "public"."pegawai"("id") ON DELETE SET NULL ON UPDATE CASCADE;

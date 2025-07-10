-- CreateTable
CREATE TABLE "SuratTugas" (
    "id" SERIAL NOT NULL,
    "nomor_surat" TEXT NOT NULL,
    "klien" TEXT NOT NULL,
    "pekerjaan" TEXT NOT NULL,
    "status_pekerjaan" TEXT,
    "no_service_order" TEXT,
    "bidang_pekerjaan" TEXT,
    "peralatan_inspeksi" TEXT,
    "kebutuhan_material" TEXT,
    "lokasi_pekerjaan" TEXT NOT NULL,
    "tanggal_berangkat" TIMESTAMP(3) NOT NULL,
    "tanggal_kembali" TIMESTAMP(3) NOT NULL,
    "transportasi_operasional" BOOLEAN NOT NULL DEFAULT false,
    "transportasi_ditanggung_klien" BOOLEAN NOT NULL DEFAULT false,
    "transportasi_asal_tujuan" BOOLEAN NOT NULL DEFAULT false,
    "transportasi_dinas" BOOLEAN NOT NULL DEFAULT false,
    "tiket" BOOLEAN NOT NULL DEFAULT false,
    "penginapan" BOOLEAN NOT NULL DEFAULT false,
    "keterangan_lain" TEXT,
    "no_so" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Diajukan',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SuratTugas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PegawaiSuratTugas" (
    "id" SERIAL NOT NULL,
    "suratTugasId" INTEGER NOT NULL,
    "pegawaiNup" TEXT NOT NULL,
    "jabatan" TEXT,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),

    CONSTRAINT "PegawaiSuratTugas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SuratTugas_nomor_surat_key" ON "SuratTugas"("nomor_surat");

-- AddForeignKey
ALTER TABLE "PegawaiSuratTugas" ADD CONSTRAINT "PegawaiSuratTugas_suratTugasId_fkey" FOREIGN KEY ("suratTugasId") REFERENCES "SuratTugas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PegawaiSuratTugas" ADD CONSTRAINT "PegawaiSuratTugas_pegawaiNup_fkey" FOREIGN KEY ("pegawaiNup") REFERENCES "pegawai"("nup") ON DELETE RESTRICT ON UPDATE CASCADE;

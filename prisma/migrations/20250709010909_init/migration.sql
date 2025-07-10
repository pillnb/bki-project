-- CreateTable
CREATE TABLE "pegawai" (
    "nup" TEXT NOT NULL,
    "nama_pegawai" TEXT NOT NULL,
    "status_pegawai" TEXT,
    "jabatan" TEXT,
    "tempat_lahir" TEXT,
    "tanggal_lahir" DATE,
    "alamat" TEXT,
    "warga_negara" TEXT,
    "agama" TEXT,
    "no_telepon" TEXT,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "role" TEXT DEFAULT 'pegawai',
    "username" TEXT,
    "id" SERIAL NOT NULL,
    "nik" VARCHAR(32),

    CONSTRAINT "pegawai_pkey" PRIMARY KEY ("nup")
);

-- CreateTable
CREATE TABLE "pelatihan" (
    "id_pelatihan" SERIAL NOT NULL,
    "nup" TEXT,
    "kualifikasi" TEXT,
    "penyelenggara" TEXT,
    "nomor_sertifikat" TEXT,
    "tanggal_awal" DATE,
    "masa_berlaku" DATE,
    "status" TEXT,
    "keterangan_utilisasi" TEXT,
    "tahun" INTEGER,
    "tanggal_akhir" DATE,

    CONSTRAINT "pelatihan_pkey" PRIMARY KEY ("id_pelatihan")
);

-- CreateTable
CREATE TABLE "pengalaman_kerja" (
    "id_pengalaman" SERIAL NOT NULL,
    "nup" TEXT,
    "tahun" INTEGER,
    "pengalaman_kerja" TEXT,
    "perusahaan" TEXT,

    CONSTRAINT "pengalaman_kerja_pkey" PRIMARY KEY ("id_pengalaman")
);

-- CreateIndex
CREATE UNIQUE INDEX "unique_nup" ON "pegawai"("nup");

-- CreateIndex
CREATE UNIQUE INDEX "idx_pegawai_username" ON "pegawai"("username");

-- CreateIndex
CREATE UNIQUE INDEX "unique_id" ON "pegawai"("id");

-- AddForeignKey
ALTER TABLE "pelatihan" ADD CONSTRAINT "pelatihan_nup_fkey" FOREIGN KEY ("nup") REFERENCES "pegawai"("nup") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pengalaman_kerja" ADD CONSTRAINT "pengalaman_kerja_nup_fkey" FOREIGN KEY ("nup") REFERENCES "pegawai"("nup") ON DELETE CASCADE ON UPDATE NO ACTION;

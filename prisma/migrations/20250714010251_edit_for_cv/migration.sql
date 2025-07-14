-- AlterTable
ALTER TABLE "pegawai" ADD COLUMN     "jenjang_pend" TEXT,
ADD COLUMN     "pendidikan" TEXT,
ADD COLUMN     "tahun_pend" INTEGER;

-- AlterTable
ALTER TABLE "pelatihan" ADD COLUMN     "lokasi" TEXT;

-- AlterTable
ALTER TABLE "pengalaman_kerja" ADD COLUMN     "lokasi" TEXT;

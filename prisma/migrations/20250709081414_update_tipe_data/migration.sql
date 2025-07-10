/*
  Warnings:

  - The `peralatan_inspeksi` column on the `SuratTugas` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `kebutuhan_material` column on the `SuratTugas` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `lokasi_pekerjaan` column on the `SuratTugas` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "SuratTugas" DROP COLUMN "peralatan_inspeksi",
ADD COLUMN     "peralatan_inspeksi" TEXT[],
DROP COLUMN "kebutuhan_material",
ADD COLUMN     "kebutuhan_material" TEXT[],
DROP COLUMN "lokasi_pekerjaan",
ADD COLUMN     "lokasi_pekerjaan" TEXT[],
ALTER COLUMN "tanggal_berangkat" DROP NOT NULL,
ALTER COLUMN "tanggal_kembali" DROP NOT NULL;

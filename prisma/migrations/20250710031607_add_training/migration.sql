/*
  Warnings:

  - You are about to drop the column `kualifikasi` on the `pelatihan` table. All the data in the column will be lost.
  - The `status` column on the `pelatihan` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "StatusPelatihan" AS ENUM ('ON_GOING', 'SELESAI');

-- AlterTable
ALTER TABLE "pelatihan" DROP COLUMN "kualifikasi",
ADD COLUMN     "file_sertifikat" TEXT,
ADD COLUMN     "nama_pelatihan" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "StatusPelatihan";

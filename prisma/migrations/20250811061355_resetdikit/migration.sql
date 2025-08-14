/*
  Warnings:

  - The `role` column on the `pegawai` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "pegawai" DROP COLUMN "role",
ADD COLUMN     "role" TEXT[] DEFAULT ARRAY['pegawai']::TEXT[];

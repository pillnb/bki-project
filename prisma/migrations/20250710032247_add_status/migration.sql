/*
  Warnings:

  - Made the column `status` on table `pelatihan` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "pelatihan" ALTER COLUMN "status" SET NOT NULL;

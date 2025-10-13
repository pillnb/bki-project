/*
  Warnings:

  - You are about to drop the column `approvedBy` on the `Sertifikat` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Sertifikat" DROP CONSTRAINT "Sertifikat_approvedBy_fkey";

-- AlterTable
ALTER TABLE "public"."Sertifikat" DROP COLUMN "approvedBy";

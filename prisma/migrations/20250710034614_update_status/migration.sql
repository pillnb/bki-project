/*
  Warnings:

  - The values [SELESAI] on the enum `StatusPelatihan` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StatusPelatihan_new" AS ENUM ('ON_GOING', 'VALID', 'EXPIRED');
ALTER TABLE "pelatihan" ALTER COLUMN "status" TYPE "StatusPelatihan_new" USING ("status"::text::"StatusPelatihan_new");
ALTER TYPE "StatusPelatihan" RENAME TO "StatusPelatihan_old";
ALTER TYPE "StatusPelatihan_new" RENAME TO "StatusPelatihan";
DROP TYPE "StatusPelatihan_old";
COMMIT;

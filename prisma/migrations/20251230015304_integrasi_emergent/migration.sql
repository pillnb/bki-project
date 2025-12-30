-- CreateEnum
CREATE TYPE "public"."ToolCondition" AS ENUM ('Good', 'Damaged');

-- CreateEnum
CREATE TYPE "public"."EmergentRole" AS ENUM ('SuperAdmin', 'Admin', 'User', 'Management');

-- CreateTable
CREATE TABLE "public"."bki_modules" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "path" TEXT NOT NULL,
    "external_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "roles" TEXT[],

    CONSTRAINT "bki_modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."em_tools" (
    "id" TEXT NOT NULL,
    "equipment_name" TEXT NOT NULL,
    "brand_type" TEXT NOT NULL,
    "serial_no" TEXT NOT NULL,
    "inventory_code" TEXT NOT NULL,
    "asset_number" TEXT,
    "periodic_inspection_date" DATE,
    "calibration_date" DATE,
    "calibration_validity_months" INTEGER NOT NULL DEFAULT 12,
    "condition" "public"."ToolCondition" NOT NULL,
    "description" TEXT,
    "equipment_location" TEXT NOT NULL,
    "calibration_certificate" TEXT,
    "equipment_manual" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "em_tools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."em_stock_items" (
    "id" TEXT NOT NULL,
    "item_name" TEXT NOT NULL,
    "brand_specifications" TEXT NOT NULL,
    "available_quantity" INTEGER NOT NULL DEFAULT 0,
    "unit" TEXT NOT NULL,
    "description" TEXT,
    "purchase_receipt" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "em_stock_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."em_calibrations" (
    "id" TEXT NOT NULL,
    "device_name" TEXT NOT NULL,
    "serial_no" TEXT NOT NULL,
    "calibration_date" DATE NOT NULL,
    "calibration_expiry_date" DATE NOT NULL,
    "device_condition" "public"."ToolCondition",
    "calibration_agency" TEXT,
    "calibration_location" TEXT,
    "person_name" TEXT,
    "created_by_pegawai_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "em_calibrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."em_loans" (
    "id" TEXT NOT NULL,
    "borrower_name" TEXT NOT NULL,
    "loan_date" DATE NOT NULL,
    "return_date" DATE NOT NULL,
    "project_name" TEXT NOT NULL,
    "wbs_project_no" TEXT NOT NULL,
    "project_location" TEXT NOT NULL,
    "created_by_pegawai_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "em_loans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."em_loan_items" (
    "id" TEXT NOT NULL,
    "loan_id" TEXT NOT NULL,
    "equipment_name" TEXT NOT NULL,
    "serial_no" TEXT NOT NULL,
    "condition" "public"."ToolCondition" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "em_loan_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."em_calibrations" ADD CONSTRAINT "em_calibrations_created_by_pegawai_id_fkey" FOREIGN KEY ("created_by_pegawai_id") REFERENCES "public"."pegawai"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."em_loans" ADD CONSTRAINT "em_loans_created_by_pegawai_id_fkey" FOREIGN KEY ("created_by_pegawai_id") REFERENCES "public"."pegawai"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."em_loan_items" ADD CONSTRAINT "em_loan_items_loan_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "public"."em_loans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

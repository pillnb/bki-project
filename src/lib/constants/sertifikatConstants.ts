// lib/constants/sertifikatConstants.ts

export const KOMPETENSI_OPTIONS = [
  { value: 'L01', label: 'L01 Pemetaan' },
  { value: 'L02', label: 'L02 Survey/Identifikasi/Inventarisasi' },
  { value: 'L03', label: 'L03 Inspeksi' },
  { value: 'L04', label: 'L04 Assessment' },
  { value: 'L05', label: 'L05 Audit' },
  { value: 'L06', label: 'L06 Pengujian' },
  { value: 'L07', label: 'L07 Pengujian Laboratorium' },
  { value: 'L08', label: 'L08 Monitoring' },
  { value: 'L09', label: 'L09 Supervisi' },
  { value: 'L10', label: 'L10 Konsultansi' },
  { value: 'L11', label: 'L11 Sertifikasi' },
  { value: 'L12', label: 'L12 Training' },
  { value: 'L13', label: 'L13 Labor Survey' }
];

export const PASAR_OPTIONS = [
  { value: 'P1', label: 'P1 MIGAS' },
  { value: 'P2', label: 'P2 MINERBA' },
  { value: 'P3', label: 'P3 EBTKE' },
  { value: 'P4', label: 'P4 KELISTRIKAN' },
  { value: 'P5', label: 'P5 NAKERTRANS' },
  { value: 'P6', label: 'P6 DEPHUB' },
  { value: 'P7', label: 'P7 PERINDUSTRIAN' },
  { value: 'P8', label: 'P8 BKI' },
  { value: 'P9', label: 'P9 LAIN-LAIN' }
];

export const KODE_PRODUKSI_M = [
  'M01', 'M02', 'M03', 'M04', 'M05', 'M06', 'M07', 'M08', 'M09', 'M10',
  'M11', 'M12', 'M13', 'M14', 'M15', 'M16', 'M17', 'M18', 'M19', 'M20',
  'M21', 'M22', 'M23', 'M24', 'M25', 'M26', 'M27', 'M28', 'M29', 'M30',
  'M31', 'M32', 'M33', 'M34', 'M35', 'M36', 'M37', 'M38', 'M39', 'M40',
  'M41', 'M42', 'M43', 'M44', 'M45', 'M46', 'M47', 'M48', 'M49', 'M50', 'M51'
];

export const KODE_PRODUKSI_E = [
  'E01', 'E02', 'E03', 'E04', 'E05', 'E06', 'E07', 'E08', 'E09', 'E10',
  'E11', 'E12', 'E13', 'E14', 'E15', 'E16', 'E17', 'E18', 'E19', 'E20',
  'E21', 'E22', 'E23', 'E24', 'E25', 'E26', 'E27', 'E28', 'E29', 'E30',
  'E31', 'E32', 'E33', 'E34', 'E35', 'E36', 'E37', 'E38', 'E39', 'E40',
  'E41', 'E42', 'E43', 'E44', 'E45', 'E46', 'E47', 'E48', 'E49', 'E50',
  'E51', 'E52', 'E53', 'E54', 'E55'
];

// Labeled options for Kode Produksi M (value + descriptive label)
export const KODE_PRODUKSI_M_OPTIONS = [
  { value: 'M01', label: 'M01 Ship New Building Design & Analysis, Inspection & Supervision' },
  { value: 'M02', label: 'M02 Ship Repair & Modification (Re-activation, Conversion, etc.) Design & Analysis, Inspection & Supervision' },
  { value: 'M03', label: 'M03 Intact Stability Calculation' },
  { value: 'M04', label: 'M04 Hydrodynamic Analysis' },
  { value: 'M05', label: 'M05 Mooring Design, Analysis & Survey' },
  { value: 'M06', label: 'M06 Ship As Built Drawing' },
  { value: 'M07', label: 'M07 Ship Tank / Tank Calibration & Survey' },
  { value: 'M08', label: 'M08 Consultation of Marine Transportation' },
  { value: 'M09', label: 'M09 Machinery Analyses' },
  { value: 'M10', label: 'M10 Structural Analysis' },
  { value: 'M11', label: 'M11 WPS Consultant, Qualification & Certification' },
  { value: 'M12', label: 'M12 Welder Qualification & Certification' },
  { value: 'M13', label: 'M13 Ship Integrity Services (Asset & Certificate Database, Inspection & Testing)' },
  { value: 'M14', label: 'M14 Ship Condition Survey' },
  { value: 'M15', label: 'M15 Ship On and Off Hire Survey' },
  { value: 'M16', label: 'M16 Ship Towing and Lashing Survey & Analysis / Cargo Securing Manual' },
  { value: 'M17', label: 'M17 Ship Draught Survey' },
  { value: 'M18', label: 'M18 Liquid Cargo (Sounding) Quantity Survey' },
  { value: 'M19', label: 'M19 Technical Audit of Ship Performance' },
  { value: 'M20', label: 'M20 Phase Sequence' },
  { value: 'M21', label: 'M21 Speed/RPM Ship Machine' },
  { value: 'M22', label: 'M22 Bollard Pull Test' },
  { value: 'M23', label: 'M23 Ship Speed Trial' },
  { value: 'M24', label: 'M24 Ship Inclining Test' },
  { value: 'M25', label: 'M25 Ship Particulars' },
  { value: 'M26', label: 'M26 Fuel Consumption Test' },
  { value: 'M27', label: 'M27 ISPS Code Consultant, Survey, Verification & Certification (Port)' },
  { value: 'M28', label: 'M28 ISM Code Consultant' },
  { value: 'M29', label: 'M29 SIMOM (Surat Ijin Memasuki Operasi Migas)' },
  { value: 'M30', label: 'M30 Dermaga Keperluan Khusus' },
  { value: 'M31', label: 'M31 Fishing Vessel Certification (KKP)' },
  { value: 'M32', label: 'M32 Marine Labor Convention Consultant' },
  { value: 'M33', label: 'M33 Marine Transportation Statutory Certification Consultant' },
  { value: 'M34', label: 'M34 Marine House Assessment' },
  { value: 'M35', label: 'M35 Vessel Planned Maintenance System' },
  { value: 'M36', label: 'M36 Vessel Condition Survey (SIRE, Vetting & TMSA, OCIMF & OVID)' },
  { value: 'M37', label: 'M37 Vessel Reflagging Certificate' },
  { value: 'M38', label: 'M38 Tenorm' },
  { value: 'M39', label: 'M39 Protection & Indemnity Insurance Survey & Hull & Machinery Survey' },
  { value: 'M40', label: 'M40 Vessel Leakage Test' },
  { value: 'M41', label: 'M41 Hidrografi' },
  { value: 'M42', label: 'M42 Oceanografi' },
  { value: 'M43', label: 'M43 Mooring (SPM/SBM)' },
  { value: 'M44', label: 'M44 Anchoring System & Mooring Line' },
  { value: 'M45', label: 'M45 Port Design & Analysis, Inspection, Supervision' },
  { value: 'M46', label: 'M46 Training (Various)' },
  { value: 'M47', label: 'M47 Marine Labor Supply' },
  { value: 'M48', label: 'M48 VGM Certification' },
  { value: 'M49', label: 'M49 Container Condition Survey' },
  { value: 'M50', label: 'M50 Container Non CSC (Fleet Container, etc.)' },
  { value: 'M51', label: 'M51 Convention for Safe Container (CSC)' },
];

// Labeled options for Kode Produksi E (value + descriptive label)
export const KODE_PRODUKSI_E_OPTIONS = [
  { value: 'E01', label: 'E01 Refinery/Industrial Installation Fitness Inspection, Supervision & Certification' },
  { value: 'E02', label: 'E02 Platform Design & Analysis, Inspection, Supervision & Certification' },
  { value: 'E03', label: 'E03 Pressure Vessel Design & Analysis Inspection, Supervision & Certification' },
  { value: 'E04', label: 'E04 Crane Design & Analysis, Inspection, Supervision & Certification' },
  { value: 'E05', label: 'E05 Pipe Line Design & Analysis Inspection, Supervision & Certification' },
  { value: 'E06', label: 'E06 Rotating Equipment (Pump, Compressor, etc.) Inspection, Supervision & Certification' },
  { value: 'E07', label: 'E07 Electrical Equipment Inspection, Supervision & Certification' },
  { value: 'E08', label: 'E08 Storage Tank Design & Analysis Inspection, Supervision & Certification' },
  { value: 'E09', label: 'E09 RIG Design & Analysis, Inspection, Supervision & Certification' },
  { value: 'E10', label: 'E10 Pressure Safety Valve Design & Analysis, Inspection, Testing & Certification' },
  { value: 'E11', label: 'E11 Metering System Inspection, Supervision & Certification' },
  { value: 'E12', label: 'E12 Safety Devices / Equipment / System / Installation Inspection, Supervision & Certification' },
  { value: 'E13', label: 'E13 Risk Based Inspection (RBI) Consultant & Audit' },
  { value: 'E14', label: 'E14 Power Plan Installation, Inspection & Certification (SLO DJK)' },
  { value: 'E15', label: 'E15 Installation of High Voltage Consumer Electricity Utilization, Inspection & Certification (SLO DJK)' },
  { value: 'E16', label: 'E16 Installation of Medium Voltage Consumer Electricity Utilization, Inspection & Certification (SLO DJK)' },
  { value: 'E17', label: 'E17 Rigging/Lifting Gear Design, Inspection, Testing & Certification' },
  { value: 'E18', label: 'E18 Well Head & Drilling Unit (BOP, Tubing Casing, X-Over, etc.) Inspection, Testing & Certification' },
  { value: 'E19', label: 'E19 Valve Inspection, Testing & Certification' },
  { value: 'E20', label: 'E20 Cementing Unit Inspection, Testing & Certification' },
  { value: 'E21', label: 'E21 Boiler Design & Analysis, Inspection, Supervision & Certification' },
  { value: 'E22', label: 'E22 Management System HSE / SMK3 Audit & Certification' },
  { value: 'E23', label: 'E23 Heliport Design & Analysis, Inspection & Certification' },
  { value: 'E24', label: 'E24 Rail Design & Analysis, Testing, Inspection, & Certification' },
  { value: 'E25', label: 'E25 Rigging/Lifting Gear Design, Inspection, Testing & Certification' },
  { value: 'E26', label: 'E26 Lightning Arrestor Design, Inspection, Testing & Certification' },
  { value: 'E27', label: 'E27 Fire & Flame Arrester System Inspection, Testing & Certification' },
  { value: 'E28', label: 'E28 Welder Qualification & Certification' },
  { value: 'E29', label: 'E29 Welding Procedure Specification Consultant, Qualification & Certification' },
  { value: 'E30', label: 'E30 Remaining Life Assessment (RLA) of Refinery & Structural Equipment' },
  { value: 'E31', label: 'E31 Corrosion Protection (Coating/Painting, CP, Etc.) Design, Inspection, Testing & Analysis' },
  { value: 'E32', label: 'E32 HAZOP/HAZID Audit, Verification & Consultant' },
  { value: 'E33', label: 'E33 Top Side Facilities Independent Verification' },
  { value: 'E34', label: 'E34 Oil & Gas Asset Integrity' },
  { value: 'E35', label: 'E35 Oil & Gas Equipment Feasibility Study' },
  { value: 'E36', label: 'E36 Oil & Gas Structural (Local & Global) Analysis' },
  { value: 'E37', label: 'E37 Oil & Gas FEED' },
  { value: 'E38', label: 'E38 Various Non Destructive Test/Examination (NDT/E)' },
  { value: 'E39', label: 'E39 Material Mechanical & Chemical Destructive Test (DT)' },
  { value: 'E40', label: 'E40 Underwater Survey' },
  { value: 'E41', label: 'E41 Wire Rope Test' },
  { value: 'E42', label: 'E42 Casing–Tubing Inspection, Testing & Certification' },
  { value: 'E43', label: 'E43 Box Crossover Thread Inspection, Testing & Certification' },
  { value: 'E44', label: 'E44 Working at Height/Rope Access Technique (RAT)' },
  { value: 'E45', label: 'E45 Oil & Gas VSD Transport Skid Design, Inspection, Testing & Certification' },
  { value: 'E46', label: 'E46 Oil & Gas Container Metal Box Design, Inspection, Testing & Certification' },
  { value: 'E47', label: 'E47 Oil & Gas Basket Inspection Design, Inspection, Testing & Certification' },
  { value: 'E48', label: 'E48 Oil & Gas Skid and Spreader Bar Inspection, Testing & Certification' },
  { value: 'E49', label: 'E49 Transport Tank Inspection Design, Inspection, Testing & Certification' },
  { value: 'E50', label: 'E50 Energy & Industrial Man Power Supply' },
  { value: 'E51', label: 'E51 Survey Lifting Batu Bara (Minerba)' },
  { value: 'E52', label: 'E52 Various Industrial, Social Mapping & Survey' },
  { value: 'E53', label: 'E53 Survey Barang Modal Bukan Baru (KEMENDAG)' },
  { value: 'E54', label: 'E54 Information Technology System & Infrastructure' },
  { value: 'E55', label: 'E55 Civil & Industrial Infrastructure' },
];

export const KODE_E_MULTIPAGE = ['E10', 'E17', 'E25', 'E46', 'E47', 'E48'];

// Types
export type StatusSertifikat = 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';

export interface SertifikatData {
  id: number;
  pengajuId: number;
  parentId?: number | null;
  nomorKontrak: string;
  kompetensi: string;
  pasar: string;
  kodeProduksiM?: string | null;
  kodeProduksiE?: string | null;
  jumlahHalaman?: number | null;
  linkLaporan: string;
  nomorSertifikat?: string | null;
  qrCodeDriveId?: string | null;
  qrCodeUrl?: string | null;
  qrCodeImageUrl?: string | null;
  status: StatusSertifikat;
  approvedAt?: Date | null;
  rejectedAt?: Date | null;
  keterangan?: string | null;
  createdAt: Date;
  updatedAt: Date;
  pengaju?: {
    nup: string;
    nama_pegawai: string;
  };
}

export interface SertifikatFormData {
  nomorKontrak: string;
  kompetensi: string;
  pasar: string;
  kodeProduksiM?: string;
  kodeProduksiE?: string;
  jumlahHalaman?: number;
  linkLaporan: string;
}
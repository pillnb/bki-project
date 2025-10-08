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

export const KODE_E_MULTIPAGE = ['E10', 'E17', 'E25', 'E46', 'E47', 'E48'];

// Types
export type StatusSertifikat = 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';

export interface SertifikatData {
  id: number;
  pengajuId: number;
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
  approvedBy?: number | null;
  approvedAt?: Date | null;
  rejectedAt?: Date | null;
  keterangan?: string | null;
  createdAt: Date;
  updatedAt: Date;
  pengaju?: {
    nup: string;
    nama_pegawai: string;
  };
  approver?: {
    nama_pegawai: string;
    nup: string;
  } | null;
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
export type PersonnelStatus = 'ON_DUTY' | 'READY' | 'UNKNOWN';

export interface Personnel {
  id: string | number;
  nama_pegawai: string;
  nup: string;
  status: PersonnelStatus;
  tanggal_berangkat?: string | null;
  tanggal_kembali?: string | null;
  lokasi_pekerjaan?: string | null;
  pekerjaan?: string | null;
  klien?: string | null;
  nomor_surat?: string | null;
  days_remaining?: number | null;
  // tambahan opsional:
  employmentStatus?: 'PKWT' | 'PKWTT' | 'KOMERBA' | string;
}
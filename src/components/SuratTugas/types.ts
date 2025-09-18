export type Pegawai = {
  nup: string;
  nama_pegawai: string;
  status_pegawai: string;
};

export type InspectorRow = {
  id: number;
  pegawaiNup: string;
};

export type StatusSuratTugas =
  | "DRAFT"
  | "MENUNGGU_LEAD"
  | "MENUNGGU_KOORDINATOR"
  | "MENUNGGU_SM"
  | "MENUNGGU_KACAB"
  | "DISETUJUI"
  | "BERJALAN"
  | "SELESAI"
  | "DITOLAK";

export type TimInspektorItem = {
  nama_pegawai: string;
  nup: string;
};

export type SuratTugasItem = {
  id: string;
  nomor_surat?: string;
  klien: string;
  pekerjaan: string;
  proyek?: {
    klien?: string;
    namaProyek?: string;
    lokasi?: string;
  };
  status: StatusSuratTugas;
  no_service_order?: string;
  spi?: string;
  wbs?: string;
  bidang_pekerjaan?: string;
  peralatan_inspeksi?: string[];
  cabang_pinjam?: string;
  pihak_ketiga?: string;
  kebutuhan_material?: string[];
  lokasi?: string;
  tanggal_berangkat?: string;
  tanggal_kembali?: string;
  transportasi_operasional?: boolean;
  transportasi_ditanggung_klien?: boolean;
  transportasi_asal_tujuan?: boolean;
  transportasi_dinas?: boolean;
  tiket?: boolean;
  penginapan?: boolean;
  createdAt: string;
  updatedAt: string;
  leadInspector?: string | { 
    nup?: string; 
    nama_pegawai?: string 
  };
  ttd_lead_inspector?: string;
  timInspektor: TimInspektorItem[];
  dibuatOleh?: {
    nama_pegawai: string;
  };
};

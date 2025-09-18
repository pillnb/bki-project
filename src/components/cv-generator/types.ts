export type StatusPelatihanLite = "ON_GOING" | "VALID" | "EXPIRED";

export type DataDiri = {
  nup?: string | null;
  status_pegawai?: string | null;
  jabatan?: string | null;
  nama_pegawai?: string | null;
  email?: string | null;
  tempat_lahir?: string | null;
  tanggal_lahir?: string | Date | null;
  agama?: string | null;
  warga_negara?: string | null;
  jenjang_pend?: string | null;
  pendidikan?: string | null;
  tahun_pend?: number | null;
}

export type KualifikasiItem = {
  id_pelatihan: number;
  nama_pelatihan: string | null;
  penyelenggara: string | null;
  nomor_sertifikat: string | null;
  tahun: number | null;
  tanggal_awal: string | Date | null;
  tanggal_akhir: string | Date | null;
  masa_berlaku: string | Date | null;
  status: StatusPelatihanLite | null | string;
  keterangan_utilisasi: string | null;
  lokasi: string | null;
};

export type PengalamanItem = {
  id_pengalaman: number;
  pengalaman_kerja: string | null;
  perusahaan: string | null;
  tahun_awal: number | null;
  tahun_akhir: number | null;
  lokasi: string | null;
};

export type CVGeneratorClientProps = {
  initialDataDiri: DataDiri;
  initialDataKualifikasi: KualifikasiItem[];
  initialDataPengalaman: PengalamanItem[];
  nup: string;
};
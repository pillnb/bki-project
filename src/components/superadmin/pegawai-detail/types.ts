// src/components/superadmin/pegawai-detail/types.ts
export interface Kualifikasi {
  id_pelatihan: number;
  nama_pelatihan: string;
  penyelenggara: string;
  nomor_sertifikat: string;
  tahun: number;
  tanggal_awal: string;
  tanggal_akhir: string;
  masa_berlaku: string;
  status: string;
  keterangan_utilisasi: string;
  lokasi: string;
}

export interface PengalamanKerja {
  id: number;
  pengalaman_kerja: string;
  perusahaan: string;
  tahun_awal: number;
  tahun_akhir: number;
  lokasi: string;
}

export interface PegawaiDetail {
  id: number;
  nup: string;
  nama_pegawai: string;
  status_pegawai: string;
  jabatan: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  alamat: string;
  warga_negara: string;
  agama: string;
  no_telepon: string;
  email: string;
  password: string;
  role: string[];
  username: string;
  nik: string;
  jenjang_pend: string;
  pendidikan: string;
  tahun_pend: number;
  tandaTanganUrl: string;
  cv_generated_at: string;
  kualifikasi: Kualifikasi[];
  pengalaman_kerja: PengalamanKerja[];
  created_at: string;
  updated_at: string;
}
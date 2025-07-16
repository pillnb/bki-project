"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';

// Interface untuk form, sudah benar
interface FormData {
  // Data Pribadi
  nama_pegawai: string;
  nik: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  alamat: string;
  no_telepon: string;
  email: string;
  agama: string;
  warga_negara: string;

  // Data Kepegawaian
  nup: string;
  jabatan: string;
  status_pegawai: string;

  // Data Pendidikan
  jenjang_pend: string;
  pendidikan: string;
  tahun_pend: string;

  // Pengalaman Kerja
  pengalaman_kerja: Array<{
    id?: number;
    tahun: string;
    pengalaman_kerja: string;
    perusahaan: string;
    lokasi: string;
  }>;

  // Pelatihan
  pelatihan: Array<{
    id_pelatihan?: number;
    nama_pelatihan: string;
    penyelenggara: string;
    lokasi: string;
    nomor_sertifikat: string;
    tanggal_awal: string;
    tanggal_akhir: string;
    masa_berlaku: string;
    status: string;
    keterangan_utilisasi: string;
    tahun: string;
  }>;

  // Data Akun
  username: string;
  password?: string;
  confirm_password?: string;
  role: string;
  status?: string;
}


// Interface untuk data yang datang dari API (struktur lama)
interface PegawaiFromAPI {
  id: number;
  nup: string;
  nama_pegawai: string;
  email: string;
  no_telepon: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  alamat: string;
  agama: string;
  warga_negara: string;
  jabatan: string;
  status_pegawai: string;
  username: string;
  status: string;
  nik?: string;
  jenjang_pend?: string;
  pendidikan?: string;
  tahun_pend?: number | null;
  // ✅ PERBAIKAN 1: Ubah nama field ini kembali ke 'kualifikasi'
  kualifikasi: Array<{
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
  }>;
  pengalaman_kerja: Array<{
    id: number;
    posisi: string;
    perusahaan: string;
    durasi: string;
    deskripsi: string;
  }>;
}


export default function EditPegawaiForm() {
  const params = useParams();
  const router = useRouter();
  const nup = Array.isArray(params?.nup) ? params.nup[0] : params?.nup;

  const [formData, setFormData] = useState<FormData>({
    nama_pegawai: '', nik: '', tempat_lahir: '', tanggal_lahir: '', alamat: '',
    no_telepon: '', email: '', agama: '', warga_negara: 'Indonesia', nup: '',
    jabatan: '', status_pegawai: '', jenjang_pend: '', pendidikan: '',
    tahun_pend: '', pengalaman_kerja: [], pelatihan: [], username: '',
    password: '', confirm_password: '', role: 'pegawai', status: 'active',
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!nup) {
      setError("NUP tidak ditemukan.");
      setLoading(false);
      return;
    };

    const fetchPegawaiData = async () => {
      try {
        const res = await fetch(`/api/pegawai/${nup}`);
        if (!res.ok) {
          throw new Error('Gagal mengambil data pegawai');
        }
        const data: PegawaiFromAPI = await res.json();

        const formatDateForInput = (dateString: string | null | undefined) => {
          if (!dateString) return '';
          try {
            return new Date(dateString).toISOString().split('T')[0];
          } catch (e) {
            return '';
          }
        };

        setFormData({
          nama_pegawai: data.nama_pegawai || '',
          nik: data.nik || '',
          tempat_lahir: data.tempat_lahir || '',
          tanggal_lahir: formatDateForInput(data.tanggal_lahir),
          alamat: data.alamat || '',
          no_telepon: data.no_telepon || '',
          email: data.email || '',
          agama: data.agama || '',
          warga_negara: data.warga_negara || 'Indonesia',
          nup: data.nup || '',
          jabatan: data.jabatan || '',
          status_pegawai: data.status_pegawai || '',
          jenjang_pend: data.jenjang_pend || '',
          pendidikan: data.pendidikan || '',
          tahun_pend: data.tahun_pend?.toString() || '',
          username: data.username || '',
          role: 'pegawai',
          status: data.status || 'active',
          password: '',
          confirm_password: '',
          
          // ✅ PERBAIKAN 2: Gunakan 'data.kualifikasi' untuk memetakan data
          pelatihan: data.kualifikasi?.map(p => ({
            id_pelatihan: p.id_pelatihan,
            nama_pelatihan: p.nama_pelatihan || '',
            penyelenggara: p.penyelenggara || '',
            lokasi: p.lokasi || '',
            nomor_sertifikat: p.nomor_sertifikat || '',
            tanggal_awal: formatDateForInput(p.tanggal_awal),
            tanggal_akhir: formatDateForInput(p.tanggal_akhir),
            masa_berlaku: formatDateForInput(p.masa_berlaku),
            status: p.status || 'VALID',
            keterangan_utilisasi: p.keterangan_utilisasi || '',
            tahun: p.tahun?.toString() || '',
          })) || [],

          pengalaman_kerja: data.pengalaman_kerja?.map(p => ({
            id: p.id,
            pengalaman_kerja: p.posisi || '',
            perusahaan: p.perusahaan || '',
            tahun: p.durasi?.substring(0, 4) || '',
            lokasi: ''
          })) || [],
        });

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPegawaiData();
  }, [nup]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNikChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nikValue = e.target.value;
    setFormData(prev => ({
      ...prev,
      nik: nikValue,
      username: nikValue
    }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      pengalaman_kerja: [...prev.pengalaman_kerja, {
        tahun: '', pengalaman_kerja: '', perusahaan: '', lokasi: ''
      }]
    }));
  };

  const removeExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      pengalaman_kerja: prev.pengalaman_kerja.filter((_, i) => i !== index)
    }));
  };

  const updateExperience = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      pengalaman_kerja: prev.pengalaman_kerja.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addPelatihan = () => {
    setFormData(prev => ({
      ...prev,
      pelatihan: [...prev.pelatihan, {
        nama_pelatihan: '', penyelenggara: '', lokasi: '', nomor_sertifikat: '',
        tanggal_awal: '', tanggal_akhir: '', masa_berlaku: '', status: 'VALID',
        keterangan_utilisasi: '', tahun: ''
      }]
    }));
  };

  const removePelatihan = (index: number) => {
    setFormData(prev => ({
      ...prev,
      pelatihan: prev.pelatihan.filter((_, i) => i !== index)
    }));
  };

  const updatePelatihan = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      pelatihan: prev.pelatihan.map((pel, i) =>
        i === index ? { ...pel, [field]: value } : pel
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (formData.password && formData.password !== formData.confirm_password) {
      alert('Password dan konfirmasi password tidak cocok!');
      setIsSubmitting(false);
      return;
    }

    try {
      const submitData = {
        ...formData,
        tahun_pend: formData.tahun_pend ? parseInt(formData.tahun_pend) : null,
        pengalaman_kerja: formData.pengalaman_kerja.map(exp => ({
          ...exp,
          tahun: exp.tahun ? parseInt(exp.tahun) : null
        })),
        pelatihan: formData.pelatihan.map(pel => ({
          ...pel,
          tahun: pel.tahun ? parseInt(pel.tahun) : null
        }))
      };

      const res = await fetch(`/api/pegawai/${nup}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal memperbarui data pegawai');
      }

      alert('Data pegawai berhasil diperbarui!');
      router.push(`/dashboard/admin/detail-pegawai/${nup}`);

    } catch (error: any) {
      console.error('Error:', error);
      alert(error.message || 'Terjadi kesalahan saat menyimpan data!');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-blue-50">Memuat data...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-blue-50 text-red-600">{error}</div>;
  }

  // Sisa kode JSX tidak berubah, jadi tidak saya sertakan lagi agar ringkas.
  // Anda bisa langsung salin seluruh blok kode ini dan tempelkan di file Anda.
  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <div className="bg-blue-900 shadow rounded-b-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-5">
            <Link
              href={`/dashboard/admin/detail-pegawai/${nup}`}
              className="p-2 hover:bg-blue-800 rounded-lg transition bg-blue-800/40"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Edit Data Pegawai</h1>
              <p className="text-blue-100">Perbarui informasi untuk {formData.nama_pegawai}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Data Pribadi */}
          <div className="bg-white rounded-xl shadow p-8">
            <h2 className="text-lg font-bold text-blue-900 mb-6">Data Pribadi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap <span className="text-red-600">*</span></label>
                <input
                  type="text" name="nama_pegawai" value={formData.nama_pegawai} onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">NIK <span className="text-red-600">*</span></label>
                <input
                  type="text" name="nik" value={formData.nik} onChange={handleNikChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  maxLength={32} required
                />
                <p className="text-xs text-gray-500 mt-1">NIK akan digunakan sebagai username untuk login</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email <span className="text-red-600">*</span></label>
                <input
                  type="email" name="email" value={formData.email} onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tempat Lahir</label>
                <input
                  type="text" name="tempat_lahir" value={formData.tempat_lahir} onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Lahir</label>
                <input
                  type="date" name="tanggal_lahir" value={formData.tanggal_lahir} onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">No. Telepon <span className="text-red-600">*</span></label>
                <input
                  type="tel" name="no_telepon" value={formData.no_telepon} onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Agama</label>
                <select name="agama" value={formData.agama} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black">
                  <option value="">Pilih Agama</option>
                  <option value="Islam">Islam</option>
                  <option value="Kristen">Kristen</option>
                  <option value="Katolik">Katolik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddha">Buddha</option>
                  <option value="Konghucu">Konghucu</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kewarganegaraan</label>
                <input
                  type="text" name="warga_negara" value={formData.warga_negara} onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
                <textarea
                  name="alamat" value={formData.alamat} onChange={handleInputChange} rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
              </div>
            </div>
          </div>

          {/* Data Kepegawaian */}
          <div className="bg-white rounded-xl shadow p-8">
            <h2 className="text-lg font-bold text-blue-900 mb-6">Data Kepegawaian</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">NUP <span className="text-red-600">*</span></label>
                  <input
                      type="text" name="nup" value={formData.nup} onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-black"
                      required readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">NUP tidak dapat diubah</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jabatan <span className="text-red-600">*</span></label>
                <input
                  type="text" name="jabatan" value={formData.jabatan} onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status Pegawai <span className="text-red-600">*</span></label>
                <select name="status_pegawai" value={formData.status_pegawai} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black" required>
                  <option value="KOMERBA">KOMERBA</option>
                  <option value="PKWTT">PKWTT</option>
                  <option value="PKWT">PKWT</option>
                </select>
              </div>
            </div>
          </div>

          {/* Data Pendidikan */}
          <div className="bg-white rounded-xl shadow p-8">
            <h2 className="text-lg font-bold text-blue-900 mb-6">Data Pendidikan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Jenjang Pendidikan</label>
                    <select name="jenjang_pend" value={formData.jenjang_pend} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black">
                        <option value="">Pilih Jenjang</option>
                        <option value="SD">SD</option>
                        <option value="SMP">SMP</option>
                        <option value="SMA">SMA</option>
                        <option value="SMK">SMK</option>
                        <option value="D3">D3</option>
                        <option value="D4">D4</option>
                        <option value="S1">S1</option>
                        <option value="S2">S2</option>
                        <option value="S3">S3</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Jurusan & Nama Institusi</label>
                    <input
                        type="text" name="pendidikan" value={formData.pendidikan} onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                        placeholder="Cth: Teknik Elektro ITB"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tahun Lulus</label>
                    <input
                        type="number" name="tahun_pend" value={formData.tahun_pend} onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                        min="1900" max="2030"
                    />
                </div>
            </div>
          </div>

          {/* Pengalaman Kerja */}
          <div className="bg-white rounded-xl shadow p-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-blue-900">Pengalaman Kerja</h2>
                <button type="button" onClick={addExperience} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition shadow">
                    <Plus className="w-4 h-4" />
                    Tambah Pengalaman
                </button>
            </div>
            <div className="space-y-6">
                {formData.pengalaman_kerja.map((exp, index) => (
                    <div key={index} className="border border-blue-100 rounded-xl p-4 bg-blue-50">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-blue-900">Pengalaman {index + 1}</h3>
                            <button type="button" onClick={() => removeExperience(index)} className="text-red-600 hover:text-red-700 bg-red-50 rounded-full p-1">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tahun</label>
                                <input type="number" value={exp.tahun} onChange={(e) => updateExperience(index, 'tahun', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                                    placeholder="2020" min="1900" max="2030" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Perusahaan</label>
                                <input type="text" value={exp.perusahaan} onChange={(e) => updateExperience(index, 'perusahaan', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                                    placeholder="Nama Perusahaan" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi</label>
                                <input type="text" value={exp.lokasi} onChange={(e) => updateExperience(index, 'lokasi', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                                    placeholder="Kota" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Pengalaman Kerja (Posisi)</label>
                                <input type="text" value={exp.pengalaman_kerja} onChange={(e) => updateExperience(index, 'pengalaman_kerja', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                                    placeholder="Posisi/Jabatan Kerja" />
                            </div>
                        </div>
                    </div>
                ))}
                {formData.pengalaman_kerja.length === 0 && (
                    <div className="text-center py-8 text-blue-400">
                        <p>Belum ada pengalaman kerja yang ditambahkan.</p>
                    </div>
                )}
            </div>
          </div>
          
          {/* Data Pelatihan */}
          <div className="bg-white rounded-xl shadow p-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-blue-900">Data Pelatihan & Sertifikasi</h2>
                <button type="button" onClick={addPelatihan} className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow">
                    <Plus className="w-4 h-4" />
                    Tambah Pelatihan
                </button>
            </div>
            <div className="space-y-6">
                {formData.pelatihan.map((pel, index) => (
                    <div key={index} className="border border-green-100 rounded-xl p-4 bg-green-50">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-green-900">Pelatihan {index + 1}</h3>
                            <button type="button" onClick={() => removePelatihan(index)} className="text-red-600 hover:text-red-700 bg-red-50 rounded-full p-1">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Pelatihan</label>
                                <input type="text" value={pel.nama_pelatihan} onChange={(e) => updatePelatihan(index, 'nama_pelatihan', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Penyelenggara</label>
                                <input type="text" value={pel.penyelenggara} onChange={(e) => updatePelatihan(index, 'penyelenggara', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi</label>
                                <input type="text" value={pel.lokasi} onChange={(e) => updatePelatihan(index, 'lokasi', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Sertifikat</label>
                                <input type="text" value={pel.nomor_sertifikat} onChange={(e) => updatePelatihan(index, 'nomor_sertifikat', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai</label>
                                <input type="date" value={pel.tanggal_awal} onChange={(e) => updatePelatihan(index, 'tanggal_awal', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Selesai</label>
                                <input type="date" value={pel.tanggal_akhir} onChange={(e) => updatePelatihan(index, 'tanggal_akhir', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Masa Berlaku</label>
                                <input type="date" value={pel.masa_berlaku} onChange={(e) => updatePelatihan(index, 'masa_berlaku', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select value={pel.status} onChange={(e) => updatePelatihan(index, 'status', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black">
                                    <option value="VALID">VALID</option>
                                    <option value="EXPIRED">EXPIRED</option>
                                    <option value="ON_GOING">ON GOING</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tahun</label>
                                <input type="number" value={pel.tahun} onChange={(e) => updatePelatihan(index, 'tahun', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Keterangan Utilisasi</label>
                                <textarea value={pel.keterangan_utilisasi} onChange={(e) => updatePelatihan(index, 'keterangan_utilisasi', e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black" />
                            </div>
                        </div>
                    </div>
                ))}
                {formData.pelatihan.length === 0 && (
                    <div className="text-center py-8 text-green-400">
                        <p>Belum ada pelatihan yang ditambahkan.</p>
                    </div>
                )}
            </div>
          </div>
          
          {/* Data Akun */}
          <div className="bg-white rounded-xl shadow p-8">
            <h2 className="text-lg font-bold text-blue-900 mb-6">Data Akun</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text" name="username" value={formData.username}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-black"
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">Username otomatis diisi dari NIK dan tidak dapat diubah.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status Akun</label>
                <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black">
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password Baru (Opsional)</label>
                <input
                  type="password" name="password" value={formData.password} onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  placeholder="Kosongkan jika tidak ingin diubah"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password Baru</label>
                <input
                  type="password" name="confirm_password" value={formData.confirm_password} onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  placeholder="Kosongkan jika tidak ingin diubah"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6">
            <Link
              href={`/dashboard/admin/detail-pegawai/${nup}`}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
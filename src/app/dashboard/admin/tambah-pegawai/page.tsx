"use client";
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';

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
  status_pegawai: string;
  jabatan: string;

  // Data Pendidikan
  jenjang_pend: string;
  pendidikan: string;
  tahun_pend: string;

  // Pengalaman Kerja
  pengalaman_kerja: Array<{
    tahun: string;
    pengalaman_kerja: string;
    perusahaan: string;
    lokasi: string;
  }>;

  // Pelatihan
  pelatihan: Array<{
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
  password: string;
  confirm_password: string;
  role: string;
}

interface PelatihanTagProps {
  pelatihan: any;
  index: number;
  onRemove: () => void;
}

function PelatihanTag({ pelatihan, index, onRemove }: PelatihanTagProps) {
  return (
    <div className="bg-green-100 border border-green-300 rounded-lg p-3 mb-2">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-green-800">{pelatihan.nama_pelatihan}</h4>
          <p className="text-sm text-green-600">{pelatihan.penyelenggara} - {pelatihan.tahun}</p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-red-600 hover:text-red-700 bg-red-50 rounded-full p-1 ml-2"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

interface FormErrors {
  nik?: string;
  email?: string;
  no_telepon?: string;
  tempat_lahir?: string;
  tanggal_lahir?: string;
  agama?: string;
  warga_negara?: string;
  nama_pegawai?: string;
  nup?: string;
  confirm_password?: string;
  [key: string]: string | undefined;
}

export default function TambahPegawaiForm() {
  const [errors, setErrors] = useState<FormErrors>({});
  const [nikKeyError, setNikKeyError] = useState("");
  const [telpKeyError, setTelpKeyError] = useState("");

  const [formData, setFormData] = useState<FormData>({
    nama_pegawai: '',
    nik: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    alamat: '',
    no_telepon: '',
    email: '',
    agama: '',
    warga_negara: 'Indonesia',
    nup: '',
    jabatan: '',
    status_pegawai: 'KOMERBA',
    jenjang_pend: '',
    pendidikan: '',
    tahun_pend: '',
    pengalaman_kerja: [],
    pelatihan: [],
    username: '',
    password: 'password123',
    confirm_password: 'password123',
    role: 'pegawai'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);


  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'nik':
        if (!value.trim()) {
          error = 'NIK harus diisi';
        } else if (!/^\d+$/.test(value)) {
          error = 'NIK harus berupa angka';
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = 'Email harus diisi';
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            error = 'Format email tidak valid';
          }
        }
        break;
      case 'no_telepon':
        if (!value.trim()) {
          error = 'Nomor telepon harus diisi';
        } else if (!/^\d+$/.test(value)) {
          error = 'Nomor telepon harus berupa angka';
        }
        break;
      case 'tempat_lahir':
        if (!value.trim()) {
          error = 'Tempat lahir harus diisi';
        }
        break;
      case 'tanggal_lahir':
        if (!value) {
          error = 'Tanggal lahir harus diisi';
        }
        break;
      case 'agama':
        if (!value) {
          error = 'Agama harus dipilih';
        }
        break;
      case 'warga_negara':
        if (!value.trim()) {
          error = 'Kewarganegaraan harus diisi';
        }
        break;
      case 'nama_pegawai':
        if (!value.trim()) {
          error = 'Nama pegawai harus diisi';
        }
        break;
      case 'nup':
        if (!value.trim()) {
          error = 'NUP harus diisi';
        }
        break;
    }
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
    return error;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    validateField(name, value);
  };

  const handleNikChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nikValue = e.target.value;
    setFormData(prev => ({
      ...prev,
      nik: nikValue,
      username: nikValue
    }));
    validateField('nik', nikValue);
  };

  const validateForm = () => {
    const fieldsToValidate = [
      'nama_pegawai',
      'nik',
      'email',
      'no_telepon',
      'tempat_lahir',
      'tanggal_lahir',
      'agama',
      'warga_negara',
      'nup'
    ];
    const newErrors: FormErrors = {};
    let hasError = false;
    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field as keyof Omit<FormData, 'pengalaman_kerja' | 'pelatihan'>] as string);
      if (error) {
        newErrors[field] = error;
        hasError = true;
      }
    });
    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Password dan konfirmasi password tidak cocok';
      hasError = true;
    }
    setErrors(newErrors);
    return !hasError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!validateForm()) {
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
        pelatihan: formData.pelatihan?.map?.(pel => ({
          ...pel,
          tahun: pel.tahun ? parseInt(pel.tahun) : null
        }))
      };
      const res = await fetch('/api/pegawai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });
      if (!res.ok) {
        throw new Error('Gagal menambah pegawai');
      }
      alert('Data pegawai berhasil ditambahkan!');
      window.location.href = '/dashboard/admin';
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat menyimpan data!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      pengalaman_kerja: [...prev.pengalaman_kerja, {
        tahun: '',
        pengalaman_kerja: '',
        perusahaan: '',
        lokasi: ''
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
        nama_pelatihan: '',
        penyelenggara: '',
        lokasi: '',
        nomor_sertifikat: '',
        tanggal_awal: '',
        tanggal_akhir: '',
        masa_berlaku: '',
        status: 'VALID',
        keterangan_utilisasi: '',
        tahun: ''
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

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <div className="bg-blue-900 shadow rounded-b-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-5">
            <Link
              href="/dashboard/admin"
              className="p-2 hover:bg-blue-800 rounded-lg transition bg-blue-800/40"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Tambah Pegawai Baru</h1>
              <p className="text-blue-100">Lengkapi data pegawai di bawah ini</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="nama_pegawai"
                  value={formData.nama_pegawai}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
                    errors.nama_pegawai ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.nama_pegawai && (
                  <p className="text-xs text-red-500 mt-1">{errors.nama_pegawai}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NIK <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="nik"
                  value={formData.nik}
                  onChange={handleNikChange}
                  onKeyDown={e => {
                    if (!/^[0-9]$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                      setNikKeyError('NIK harus berupa angka');
                      e.preventDefault();
                    } else {
                      setNikKeyError("");
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
                    errors.nik || nikKeyError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  maxLength={32}
                  pattern="[0-9]*"
                  title="NIK harus berupa angka"
                  required
                />
                {nikKeyError && (
                  <p className="text-xs text-red-500 mt-1">{nikKeyError}</p>
                )}
                {errors.nik && (
                  <p className="text-xs text-red-500 mt-1">{errors.nik}</p>
                )}
                {!errors.nik && !nikKeyError && (
                  <p className="text-xs text-gray-500 mt-1">NIK akan digunakan sebagai username untuk login</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tempat Lahir <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="tempat_lahir"
                  value={formData.tempat_lahir}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
                    errors.tempat_lahir ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.tempat_lahir && (
                  <p className="text-xs text-red-500 mt-1">{errors.tempat_lahir}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Lahir <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  name="tanggal_lahir"
                  value={formData.tanggal_lahir}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
                    errors.tanggal_lahir ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.tanggal_lahir && (
                  <p className="text-xs text-red-500 mt-1">{errors.tanggal_lahir}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  No. Telepon <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  name="no_telepon"
                  value={formData.no_telepon}
                  onChange={handleInputChange}
                  onKeyDown={e => {
                    if (!/^[0-9]$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                      setTelpKeyError('Nomor telepon harus berupa angka');
                      e.preventDefault();
                    } else {
                      setTelpKeyError("");
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
                    errors.no_telepon || telpKeyError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  pattern="[0-9]*"
                  title="Nomor telepon harus berupa angka"
                  required
                />
                {telpKeyError && (
                  <p className="text-xs text-red-500 mt-1">{telpKeyError}</p>
                )}
                {errors.no_telepon && (
                  <p className="text-xs text-red-500 mt-1">{errors.no_telepon}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agama <span className="text-red-600">*</span>
                </label>
                <select
                  name="agama"
                  value={formData.agama}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
                    errors.agama ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Pilih Agama</option>
                  <option value="Islam">Islam</option>
                  <option value="Kristen">Kristen</option>
                  <option value="Katolik">Katolik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddha">Buddha</option>
                  <option value="Konghucu">Konghucu</option>
                </select>
                {errors.agama && (
                  <p className="text-xs text-red-500 mt-1">{errors.agama}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kewarganegaraan <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="warga_negara"
                  value={formData.warga_negara}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
                    errors.warga_negara ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.warga_negara && (
                  <p className="text-xs text-red-500 mt-1">{errors.warga_negara}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat
                </label>
                <textarea
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleInputChange}
                  rows={3}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NUP <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="nup"
                  value={formData.nup}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jabatan <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="jabatan"
                  value={formData.jabatan}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Pegawai <span className="text-red-600">*</span>
                </label>
                <select
                  name="status_pegawai"
                  value={formData.status_pegawai}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  required
                >
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenjang Pendidikan
                </label>
                <select
                  name="jenjang_pend"
                  value={formData.jenjang_pend}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                >
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jurusan & Nama Institusi
                </label>
                <input
                  type="text"
                  name="pendidikan"
                  value={formData.pendidikan}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  placeholder="Cth: Teknik Elektro Institut Teknologi Bandung"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tahun Lulus
                </label>
                <input
                  type="number"
                  name="tahun_pend"
                  value={formData.tahun_pend}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  min="1900"
                  max="2030"
                />
              </div>
            </div>
          </div>

          {/* Pengalaman Kerja */}
          <div className="bg-white rounded-xl shadow p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-blue-900">Pengalaman Kerja</h2>
              <button
                type="button"
                onClick={addExperience}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition shadow"
              >
                <Plus className="w-4 h-4" />
                Tambah Pengalaman
              </button>
            </div>

            <div className="space-y-6">
              {formData.pengalaman_kerja.map((exp, index) => (
                <div key={index} className="border border-blue-100 rounded-xl p-4 bg-blue-50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-blue-900">
                      Pengalaman {index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className="text-red-600 hover:text-red-700 bg-red-50 rounded-full p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tahun <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        value={exp.tahun}
                        onChange={(e) => updateExperience(index, 'tahun', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                        placeholder="2020"
                        min="1900"
                        max="2030"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Perusahaan <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={exp.perusahaan}
                        onChange={(e) => updateExperience(index, 'perusahaan', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                        placeholder="Nama Perusahaan"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lokasi <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={exp.lokasi}
                        onChange={(e) => updateExperience(index, 'lokasi', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                        placeholder="Kota"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pengalaman Kerja <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={exp.pengalaman_kerja}
                        onChange={(e) => updateExperience(index, 'pengalaman_kerja', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                        placeholder="Posisi/Jabatan Kerja"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {formData.pengalaman_kerja.length === 0 && (
                <div className="text-center py-8 text-blue-400">
                  <p>Belum ada pengalaman kerja yang ditambahkan.</p>
                  <p className="text-sm">Klik tombol "Tambah Pengalaman" untuk menambahkan data.</p>
                </div>
              )}
            </div>
          </div>

          {/* Data Pelatihan */}
          <div className="bg-white rounded-xl shadow p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-blue-900">Data Pelatihan & Sertifikasi</h2>
              <button
                type="button"
                onClick={addPelatihan}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow"
              >
                <Plus className="w-4 h-4" />
                Tambah Pelatihan
              </button>
            </div>

            <div className="space-y-6">
              {formData.pelatihan.map((pel, index) => (
                <div key={index} className="border border-green-100 rounded-xl p-4 bg-green-50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-green-900">
                      Pelatihan {index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removePelatihan(index)}
                      className="text-red-600 hover:text-red-700 bg-red-50 rounded-full p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Pelatihan <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={pel.nama_pelatihan}
                        onChange={(e) => updatePelatihan(index, 'nama_pelatihan', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                        placeholder="Nama Pelatihan/Kualifikasi"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Penyelenggara <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={pel.penyelenggara}
                        onChange={(e) => updatePelatihan(index, 'penyelenggara', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                        placeholder="Nama Penyelenggara"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lokasi
                      </label>
                      <input
                        type="text"
                        value={pel.lokasi}
                        onChange={(e) => updatePelatihan(index, 'lokasi', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                        placeholder="Kota Penyelenggaraan"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nomor Sertifikat <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={pel.nomor_sertifikat}
                        onChange={(e) => updatePelatihan(index, 'nomor_sertifikat', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                        placeholder="Nomor Sertifikat"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tanggal Mulai
                      </label>
                      <input
                        type="date"
                        value={pel.tanggal_awal}
                        onChange={(e) => updatePelatihan(index, 'tanggal_awal', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tanggal Selesai
                      </label>
                      <input
                        type="date"
                        value={pel.tanggal_akhir}
                        onChange={(e) => updatePelatihan(index, 'tanggal_akhir', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Masa Berlaku
                      </label>
                      <input
                        type="date"
                        value={pel.masa_berlaku}
                        onChange={(e) => updatePelatihan(index, 'masa_berlaku', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={pel.status}
                        onChange={(e) => updatePelatihan(index, 'status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                      >
                        <option value="VALID">VALID</option>
                        <option value="EXPIRED">EXPIRED</option>
                        <option value="ON_GOING">ON GOING</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tahun <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        value={pel.tahun}
                        onChange={(e) => updatePelatihan(index, 'tahun', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                        placeholder="2023"
                        min="1900"
                        max="2030"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Keterangan Utilisasi
                      </label>
                      <textarea
                        value={pel.keterangan_utilisasi}
                        onChange={(e) => updatePelatihan(index, 'keterangan_utilisasi', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                        placeholder="apakah sudah refresh atau belum, jika sudah kapan..."
                      />
                    </div>
                  </div>
                </div>
              ))}

              {formData.pelatihan.length === 0 && (
                <div className="text-center py-8 text-green-400">
                  <p>Belum ada pelatihan yang ditambahkan.</p>
                  <p className="text-sm">Klik tombol "Tambah Pelatihan" untuk menambahkan data.</p>
                </div>
              )}
            </div>
          </div>

          {/* Data Akun */}
          <div className="bg-white rounded-xl shadow p-8">
            <h2 className="text-lg font-bold text-blue-900 mb-6">Data Akun</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-black"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">Username otomatis diisi dari NIK</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-600">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konfirmasi Password <span className="text-red-600">*</span>
                </label>
                <input
                  type="password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  required
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6">
            <Link
              href="/dashboard/admin"
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
                  Simpan Pegawai
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
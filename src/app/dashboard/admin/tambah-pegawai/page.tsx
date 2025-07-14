"use client";
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';

interface FormData {
  // Data Pribadi
  nama_lengkap: string;
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
  departemen: string;
  tanggal_bergabung: string;
  status_pegawai: string;
  
  // Kualifikasi
  kualifikasi: string[];
  
  // Pengalaman Kerja
  pengalaman_kerja: Array<{
    posisi: string;
    perusahaan: string;
    durasi: string;
    deskripsi: string;
  }>;
  
  // Data Akun
  username: string;
  password: string;
  confirm_password: string;
}

interface KualifikasiTagProps {
  skill: string;
  onRemove: () => void;
}

function KualifikasiTag({ skill, onRemove }: KualifikasiTagProps) {
  return (
    <div className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
      <span>{skill}</span>
      <button
        type="button"
        onClick={onRemove}
        className="hover:bg-blue-200 rounded-full p-1"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

export default function TambahPegawaiForm() {
  const [formData, setFormData] = useState<FormData>({
    nama_lengkap: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    alamat: '',
    no_telepon: '',
    email: '',
    agama: '',
    warga_negara: 'Indonesia',
    nup: '',
    jabatan: '',
    departemen: '',
    tanggal_bergabung: '',
    status_pegawai: 'Kontrak',
    kualifikasi: [],
    pengalaman_kerja: [],
    username: '',
    password: '',
    confirm_password: ''
  });

  const [newSkill, setNewSkill] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.kualifikasi.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        kualifikasi: [...prev.kualifikasi, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      kualifikasi: prev.kualifikasi.filter(skill => skill !== skillToRemove)
    }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      pengalaman_kerja: [...prev.pengalaman_kerja, {
        posisi: '',
        perusahaan: '',
        durasi: '',
        deskripsi: ''
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validasi
    if (formData.password !== formData.confirm_password) {
      alert('Password dan konfirmasi password tidak cocok!');
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Data yang akan disimpan:', formData);
      alert('Data pegawai berhasil ditambahkan!');
      
      // Redirect ke dashboard admin
      window.location.href = '/dashboard/admin';
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat menyimpan data!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-4">
            <Link
              href="/dashboard/admin"
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tambah Pegawai Baru</h1>
              <p className="text-gray-600">Lengkapi data pegawai di bawah ini</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Data Pribadi */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Data Pribadi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  name="nama_lengkap"
                  value={formData.nama_lengkap}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tempat Lahir
                </label>
                <input
                  type="text"
                  name="tempat_lahir"
                  value={formData.tempat_lahir}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  name="tanggal_lahir"
                  value={formData.tanggal_lahir}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  No. Telepon *
                </label>
                <input
                  type="tel"
                  name="no_telepon"
                  value={formData.no_telepon}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agama
                </label>
                <select
                  name="agama"
                  value={formData.agama}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kewarganegaraan
                </label>
                <input
                  type="text"
                  name="warga_negara"
                  value={formData.warga_negara}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Data Kepegawaian */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Data Kepegawaian</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NUP *
                </label>
                <input
                  type="text"
                  name="nup"
                  value={formData.nup}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jabatan *
                </label>
                <input
                  type="text"
                  name="jabatan"
                  value={formData.jabatan}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departemen *
                </label>
                <select
                  name="departemen"
                  value={formData.departemen}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Pilih Departemen</option>
                  <option value="IT">IT</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                  <option value="Design">Design</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Bergabung *
                </label>
                <input
                  type="date"
                  name="tanggal_bergabung"
                  value={formData.tanggal_bergabung}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Pegawai *
                </label>
                <select
                  name="status_pegawai"
                  value={formData.status_pegawai}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="Tetap">Tetap</option>
                  <option value="Kontrak">Kontrak</option>
                  <option value="Magang">Magang</option>
                </select>
              </div>
            </div>
          </div>

          {/* Kualifikasi & Keahlian */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Kualifikasi & Keahlian</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tambah Keahlian
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Misal: React, Laravel, UI/UX Design"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {formData.kualifikasi.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keahlian yang Ditambahkan
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {formData.kualifikasi.map((skill, index) => (
                      <KualifikasiTag
                        key={index}
                        skill={skill}
                        onRemove={() => removeSkill(skill)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pengalaman Kerja */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Pengalaman Kerja</h2>
              <button
                type="button"
                onClick={addExperience}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <Plus className="w-4 h-4" />
                Tambah Pengalaman
              </button>
            </div>
            
            <div className="space-y-6">
              {formData.pengalaman_kerja.map((exp, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-900">
                      Pengalaman {index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Posisi
                      </label>
                      <input
                        type="text"
                        value={exp.posisi}
                        onChange={(e) => updateExperience(index, 'posisi', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Misal: Frontend Developer"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Perusahaan
                      </label>
                      <input
                        type="text"
                        value={exp.perusahaan}
                        onChange={(e) => updateExperience(index, 'perusahaan', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Misal: PT. Teknologi Indonesia"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Durasi
                      </label>
                      <input
                        type="text"
                        value={exp.durasi}
                        onChange={(e) => updateExperience(index, 'durasi', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Misal: 2020 - 2023"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deskripsi
                      </label>
                      <textarea
                        value={exp.deskripsi}
                        onChange={(e) => updateExperience(index, 'deskripsi', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Deskripsi singkat tentang pekerjaan..."
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              {formData.pengalaman_kerja.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>Belum ada pengalaman kerja yang ditambahkan.</p>
                  <p className="text-sm">Klik tombol "Tambah Pengalaman" untuk menambahkan data.</p>
                </div>
              )}
            </div>
          </div>

          {/* Data Akun */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Data Akun Login</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konfirmasi Password *
                </label>
                <input
                  type="password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {formData.password && formData.confirm_password && formData.password !== formData.confirm_password && (
                  <p className="text-red-600 text-sm mt-1">Password dan konfirmasi password tidak cocok</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Save className="w-5 h-5" />
              {isSubmitting ? 'Menyimpan...' : 'Simpan Data Pegawai'}
            </button>
            
            <Link
              href="/dashboard/admin"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Batal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
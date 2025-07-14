"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Eye, Edit, Trash2, Filter } from 'lucide-react';

interface Pegawai {
  nup: string;
  nama_pegawai: string;
  status_pegawai?: string;
  jabatan?: string;
  tempat_lahir?: string;
  tanggal_lahir?: string;
  alamat?: string;
  warga_negara?: string;
  agama?: string;
  no_telepon?: string;
  email?: string;
  nik?: string;
  jenjang_pend?: string;
  pendidikan?: string;
  tahun_pend?: number;
}

interface DeleteModalProps {
  isOpen: boolean;
  pegawai: Pegawai | null;
  onClose: () => void;
  onConfirm: () => void;
}

function DeleteModal({ isOpen, pegawai, onClose, onConfirm }: DeleteModalProps) {
  if (!isOpen || !pegawai) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Konfirmasi Penghapusan</h3>
        <p className="text-gray-700 mb-6">
          Apakah Anda yakin ingin menghapus data pegawai <strong>{pegawai.nama_pegawai}</strong>? 
          Tindakan ini tidak dapat diurungkan.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardClient() {
  const [pegawaiData, setPegawaiData] = useState<Pegawai[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState<Pegawai[]>(pegawaiData);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    pegawai: null as Pegawai | null
  });

  // Fetch pegawai data from API on mount
  useEffect(() => {
    async function fetchPegawai() {
      try {
        const res = await fetch('/api/pegawai');
        if (!res.ok) throw new Error('Gagal mengambil data pegawai');
        const data = await res.json();
        setPegawaiData(data);
      } catch (err) {
        setPegawaiData([]);
      }
    }
    fetchPegawai();
  }, []);

  // Filter data berdasarkan pencarian
  useEffect(() => {
    const filtered = pegawaiData.filter(pegawai =>
      pegawai.nama_pegawai?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pegawai.jabatan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pegawai.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pegawai.nup?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, pegawaiData]);

  const handleDelete = (pegawai: Pegawai) => {
    setDeleteModal({
      isOpen: true,
      pegawai: pegawai
    });
  };

  const confirmDelete = () => {
    if (deleteModal.pegawai) {
      setPegawaiData(prev =>
        prev
          .map(p =>
            p.nup === deleteModal.pegawai!.nup
              ? { ...p, status_pegawai: 'inactive' }
              : p
          )
          .filter(p => p.status_pegawai !== 'inactive')
      );
      setDeleteModal({ isOpen: false, pegawai: null });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h3 className="text-lg font-bold text-blue-900 mb-4">Pencarian & Filter</h3>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama, jabatan, email, atau NUP..."
              className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-blue-50 text-blue-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center px-3 py-2 border border-blue-200 rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <div className="px-6 py-4 border-b border-blue-100 rounded-t-xl flex items-center justify-between">
          <h3 className="text-lg font-bold text-blue-900">
            Daftar Pegawai ({filteredData.length})
          </h3>
          <Link
            href="/dashboard/admin/tambah-pegawai"
            className="inline-flex items-center px-4 py-2 bg-blue-900 text-white font-bold rounded-lg hover:bg-blue-800 transition shadow"
          >
            <span className="mr-2">Tambah Pegawai</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </Link>
        </div>
        <table className="min-w-full divide-y divide-blue-100">
          <thead className="bg-blue-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">No.</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">NUP</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Nama Pegawai</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Status Pegawai</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Jabatan</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Tempat Lahir</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Tanggal Lahir</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Alamat</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Warga Negara</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Agama</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">No. Telepon</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">NIK</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Jenjang Pendidikan</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Pendidikan</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Tahun Pendidikan</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-blue-50">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={17} className="px-6 py-8 text-center text-blue-400">
                  {searchTerm ? 'Tidak ada data yang sesuai dengan pencarian' : 'Belum ada data pegawai'}
                </td>
              </tr>
            ) : (
              filteredData.map((pegawai, index) => (
                <tr key={pegawai.nup} className={index % 2 === 0 ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-blue-50"}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-900">{index + 1}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-blue-900">{pegawai.nup}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-900">{pegawai.nama_pegawai}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-900">{pegawai.status_pegawai || '-'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-900">{pegawai.jabatan || '-'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-900">{pegawai.tempat_lahir || '-'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-900">{pegawai.tanggal_lahir ? new Date(pegawai.tanggal_lahir).toLocaleDateString('id-ID') : '-'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-900">{pegawai.alamat || '-'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-900">{pegawai.warga_negara || '-'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-900">{pegawai.agama || '-'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-900">{pegawai.no_telepon || '-'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-900">{pegawai.email || '-'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-900">{pegawai.nik || '-'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-900">{pegawai.jenjang_pend || '-'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-900">{pegawai.pendidikan || '-'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-900">{pegawai.tahun_pend || '-'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-900">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/admin/detail-pegawai/${pegawai.nup}`}
                        className="p-2 text-blue-700 hover:bg-blue-100 rounded-lg transition"
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/dashboard/admin/edit-pegawai/${pegawai.nup}`}
                        className="p-2 text-green-700 hover:bg-green-100 rounded-lg transition"
                        title="Edit Data"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(pegawai)}
                        className="p-2 text-red-700 hover:bg-red-100 rounded-lg transition"
                        title="Hapus Data"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        pegawai={deleteModal.pegawai}
        onClose={() => setDeleteModal({ isOpen: false, pegawai: null })}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

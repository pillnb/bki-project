"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Eye, Edit, Trash2, Filter, Download } from 'lucide-react';

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
  const [isDownloading, setIsDownloading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

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

  useEffect(() => {
    const filtered = pegawaiData.filter(pegawai =>
      pegawai.nama_pegawai?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pegawai.jabatan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pegawai.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pegawai.nup?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, pegawaiData]);

  const handleDownload = async (templateType: 'fq140' | 'fq183') => {
    setIsDownloading(true);
    try {
      const response = await fetch(`/api/download/${templateType}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal mengunduh file.');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Report_${templateType.toUpperCase()}_Personil.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (error: any) {
      console.error('Download error:', error);
      alert(`Gagal mengunduh file: ${error.message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const totalRows = filteredData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const endIdx = Math.min(startIdx + rowsPerPage, totalRows);
  const paginatedData = filteredData.slice(startIdx, endIdx);

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
        </div>
      </div>

      {/* Daftar Pegawai Header & Tombol Aksi */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-lg font-bold text-blue-900">
            Daftar Pegawai
          </h3>
          <span className="text-sm text-blue-700">
            Menampilkan {totalRows === 0 ? 0 : startIdx + 1} - {endIdx} dari {totalRows} data
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
            <Link
                href="/dashboard/admin/tambah-pegawai"
                className="inline-flex items-center px-4 py-2 bg-blue-900 text-white font-bold rounded-lg hover:bg-blue-800 transition shadow"
            >
                <span className="mr-2">Tambah</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </Link>
            <button
                onClick={() => handleDownload('fq140')}
                disabled={isDownloading}
                className="inline-flex items-center px-4 py-2 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition shadow disabled:bg-gray-400"
            >
                <Download className="mr-2 h-4 w-4" />
                {isDownloading ? 'Proses...' : 'Unduh FQ 140'}
            </button>
             <button
                onClick={() => handleDownload('fq183')}
                disabled={isDownloading}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition shadow disabled:bg-gray-400"
            >
                <Download className="mr-2 h-4 w-4" />
                {isDownloading ? 'Proses...' : 'Unduh FQ 183'}
            </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-blue-100" style={{ tableLayout: 'fixed' }}>
          <thead className="bg-blue-900">
            <tr>
              {/* Kolom No. - Fixed width 60px */}
              <th 
                className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider sticky left-0 z-20 bg-blue-900 border-r border-blue-700"
                style={{ width: '60px', minWidth: '60px', maxWidth: '60px' }}
              >
                No.
              </th>
              {/* Kolom NUP - Fixed width 180px untuk mengakomodasi NUP panjang */}
              <th 
                className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider sticky left-[59px] z-20 bg-blue-900 border-r border-blue-700"
                style={{ width: '180px', minWidth: '180px', maxWidth: '180px' }}
              >
                NUP
              </th>
              {/* Kolom Nama - Fixed width 200px */}
              <th 
                className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider sticky left-[238px] z-20 bg-blue-900 border-r border-blue-700"
                style={{ width: '200px', minWidth: '200px', maxWidth: '200px' }}
              >
                Nama Pegawai
              </th>
              {/* Kolom-kolom lainnya tetap sama */}
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[120px]">Status Pegawai</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[150px]">Jabatan</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[120px]">Tempat Lahir</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[120px]">Tanggal Lahir</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[250px]">Alamat</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[120px]">Warga Negara</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[80px]">Agama</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[130px]">No. Telepon</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[200px]">Email</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[150px]">NIK</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[150px]">Jenjang Pendidikan</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[200px]">Pendidikan</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[120px]">Tahun Pendidikan</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[120px]">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-blue-50">
            {totalRows === 0 ? (
              <tr>
                <td colSpan={17} className="px-6 py-8 text-center text-blue-400">
                  {searchTerm ? 'Tidak ada data yang sesuai dengan pencarian' : 'Belum ada data pegawai'}
                </td>
              </tr>
            ) : (
              paginatedData.map((pegawai, idx) => {
                const index = startIdx + idx;
                const rowBgClass = index % 2 === 0 ? 'bg-blue-50' : 'bg-white';
                
                return (
                  <tr key={pegawai.nup} className={`${rowBgClass} hover:bg-blue-100`}>
                    {/* Kolom No. - Sticky dengan lebar tetap */}
                    <td 
                      className={`px-4 py-3 whitespace-nowrap text-sm text-blue-900 sticky left-0 z-10 border-r border-blue-100 ${rowBgClass}`}
                      style={{ width: '60px', minWidth: '60px', maxWidth: '60px' }}
                    >
                      {index + 1}
                    </td>
                    
                    {/* Kolom NUP - Sticky dengan lebar tetap 180px, teks akan terpotong jika terlalu panjang */}
                    <td 
                      className={`px-4 py-3 text-sm font-bold text-blue-900 sticky left-[59px] z-10 border-r border-blue-100 ${rowBgClass}`}
                      style={{ width: '180px', minWidth: '180px', maxWidth: '180px' }}
                    >
                      <div className="truncate" title={pegawai.nup}>
                        {pegawai.nup}
                      </div>
                    </td>
                    
                    {/* Kolom Nama - Sticky dengan lebar tetap 200px */}
                    <td 
                      className={`px-4 py-3 text-sm text-blue-900 sticky left-[238px] z-10 border-r border-blue-100 ${rowBgClass}`}
                      style={{ width: '200px', minWidth: '200px', maxWidth: '200px' }}
                    >
                      <div className="truncate" title={pegawai.nama_pegawai}>
                        {pegawai.nama_pegawai}
                      </div>
                    </td>
                    
                    {/* Kolom-kolom lainnya tetap sama */}
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        pegawai.status_pegawai === 'KOMERBA' ? 'bg-green-100 text-green-800' :
                        pegawai.status_pegawai === 'PKWTT' ? 'bg-yellow-100 text-yellow-800' :
                        pegawai.status_pegawai === 'PKWT' ? 'bg-yellow-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {pegawai.status_pegawai || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-900">{pegawai.jabatan || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-900">{pegawai.tempat_lahir || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-900">{pegawai.tanggal_lahir ? new Date(pegawai.tanggal_lahir).toLocaleDateString('id-ID') : '-'}</td>
                    <td className="px-4 py-3 text-sm text-blue-900 max-w-[250px] truncate" title={pegawai.alamat || '-'}>{pegawai.alamat || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-900">{pegawai.warga_negara || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-900">{pegawai.agama || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-900">{pegawai.no_telepon || '-'}</td>
                    <td className="px-4 py-3 text-sm text-blue-900 max-w-[200px] truncate" title={pegawai.email || '-'}>{pegawai.email || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-900">{pegawai.nik || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-900">{pegawai.jenjang_pend || '-'}</td>
                    <td className="px-4 py-3 text-sm text-blue-900 max-w-[200px] truncate" title={pegawai.pendidikan || '-'}>{pegawai.pendidikan || '-'}</td>
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
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <button
            className="px-4 py-2 rounded bg-blue-100 text-blue-900 font-semibold disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Sebelumnya
          </button>
          <span className="text-blue-900 font-semibold">
            Halaman {currentPage} dari {totalPages}
          </span>
          <button
            className="px-4 py-2 rounded bg-blue-100 text-blue-900 font-semibold disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Selanjutnya
          </button>
        </div>
      )}

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
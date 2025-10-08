// app/sertifikat/admin/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SertifikatData } from '@/lib/constants/sertifikatConstants';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<SertifikatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'PENDING_APPROVAL' | 'all'>('PENDING_APPROVAL');
  const [selectedItem, setSelectedItem] = useState<SertifikatData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<'approve' | 'reject'>('approve');
  const [keterangan, setKeterangan] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, [filter]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/sertifikat/admin/pending?status=${filter}`);
      
      if (!res.ok) {
        if (res.status === 403) {
          router.push('/sertifikat/admin/login');
          return;
        }
        throw new Error('Failed to fetch');
      }

      const data = await res.json();
      setSubmissions(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item: SertifikatData, action: 'approve' | 'reject') => {
    setSelectedItem(item);
    setModalAction(action);
    setKeterangan('');
    setShowModal(true);
  };

  const handleAction = async () => {
    if (!selectedItem) return;
    
    if (modalAction === 'reject' && !keterangan.trim()) {
      alert('Keterangan penolakan wajib diisi');
      return;
    }

    setProcessing(true);
    try {
      const endpoint = modalAction === 'approve' 
        ? `/api/sertifikat/admin/approve/${selectedItem.id}`
        : `/api/sertifikat/admin/reject/${selectedItem.id}`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keterangan: keterangan.trim() })
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Gagal memproses');
        return;
      }

      // Refresh data
      await fetchSubmissions();
      setShowModal(false);
      setSelectedItem(null);
    } catch (err) {
      alert('Terjadi kesalahan');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING_APPROVAL: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800'
    };
    const labels = {
      PENDING_APPROVAL: 'Pending',
      APPROVED: 'Approved',
      REJECTED: 'Rejected'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
          
          <div className="flex gap-4">
            <button
              onClick={() => setFilter('PENDING_APPROVAL')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'PENDING_APPROVAL'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Pending ({submissions.filter(s => s.status === 'PENDING_APPROVAL').length})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Semua ({submissions.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : submissions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-gray-600">Tidak ada data</p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {item.nomorKontrak}
                      </h3>
                      {getStatusBadge(item.status)}
                    </div>
                    <p className="text-sm text-gray-600">
                      Pengaju: <span className="font-semibold">{item.pengaju?.nama_pegawai}</span> ({item.pengaju?.nup})
                    </p>
                    <p className="text-sm text-gray-600">
                      {item.kodeProduksiM || item.kodeProduksiE} - {item.kompetensi} - {item.pasar}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-600">Tanggal:</span>
                    <p className="font-semibold">{new Date(item.createdAt).toLocaleDateString('id-ID')}</p>
                  </div>
                  {item.jumlahHalaman && (
                    <div>
                      <span className="text-gray-600">Halaman:</span>
                      <p className="font-semibold">{item.jumlahHalaman}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-600">Link Laporan:</span>
                    <a 
                      href={item.linkLaporan} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-semibold block truncate"
                    >
                      Lihat Laporan →
                    </a>
                  </div>
                </div>

                {item.status === 'PENDING_APPROVAL' && (
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => openModal(item, 'approve')}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold transition"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => openModal(item, 'reject')}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold transition"
                    >
                      ✗ Reject
                    </button>
                  </div>
                )}

                {item.keterangan && (
                  <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-sm font-semibold text-gray-700">Keterangan:</p>
                    <p className="text-sm text-gray-600">{item.keterangan}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {modalAction === 'approve' ? 'Approve Pengajuan' : 'Reject Pengajuan'}
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Nomor Kontrak:</strong> {selectedItem.nomorKontrak}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Pengaju:</strong> {selectedItem.pengaju?.nama_pegawai}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keterangan {modalAction === 'reject' && <span className="text-red-500">*</span>}
              </label>
              <textarea
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder={modalAction === 'approve' ? 'Keterangan (opsional)' : 'Alasan penolakan (wajib)'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={4}
                required={modalAction === 'reject'}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={processing}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-semibold transition"
              >
                Batal
              </button>
              <button
                onClick={handleAction}
                disabled={processing}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition text-white ${
                  modalAction === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                } disabled:opacity-50`}
              >
                {processing ? 'Memproses...' : modalAction === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
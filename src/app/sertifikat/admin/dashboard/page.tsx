// app/sertifikat/admin/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SertifikatData } from '@/lib/constants/sertifikatConstants';
import { groupSubmissionsByParentId, getTotalPages } from '@/lib/utils/sertifikatGrouping';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<SertifikatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [filter, setFilter] = useState<'PENDING_APPROVAL' | 'all'>('PENDING_APPROVAL');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['PENDING_APPROVAL']);
  const [selectedItem, setSelectedItem] = useState<SertifikatData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<'approve' | 'reject'>('approve');
  const [keterangan, setKeterangan] = useState('');
  const [processing, setProcessing] = useState(false);
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [counterYear, setCounterYear] = useState<string>(String(new Date().getFullYear()));
  const [counterValue, setCounterValue] = useState<number | null>(null);
  const [counterLoading, setCounterLoading] = useState(false);
  const [counterUseAsNext, setCounterUseAsNext] = useState<boolean>(true);

  useEffect(() => {
    fetchSubmissions();
  }, [filter]);

  useEffect(() => {
    // when selected statuses change and we're viewing 'all', refresh
    if (filter === 'all') fetchSubmissions();
  }, [selectedStatuses]);

  useEffect(() => {
    // fetch counts once on mount
    fetchCounts();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      let url = '/api/sertifikat/admin/pending';
      if (filter === 'PENDING_APPROVAL') url += '?status=PENDING_APPROVAL';
      if (filter === 'all') {
        const qs = selectedStatuses.length ? `?statuses=${encodeURIComponent(selectedStatuses.join(','))}` : '';
        url += qs;
      }
      const res = await fetch(url);
      
      if (!res.ok) {
        if (res.status === 403) {
          router.push('/sertifikat/admin/login');
          return;
        }
        throw new Error('Failed to fetch');
      }

      const data = await res.json();
      setSubmissions(data.data);
      // if API provided count, update counts too
      if (typeof data.count === 'number') {
        if (filter === 'PENDING_APPROVAL') setPendingCount(data.count);
        if (filter === 'all') setTotalCount(data.count);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCounts = async () => {
    try {
      const [rPending, rAll] = await Promise.all([
        fetch('/api/sertifikat/admin/pending?status=PENDING_APPROVAL'),
        fetch('/api/sertifikat/admin/pending?status=all'),
      ]);

      if (rPending.ok) {
        const j = await rPending.json();
        setPendingCount(typeof j.count === 'number' ? j.count : (Array.isArray(j.data) ? j.data.length : 0));
      }
      if (rAll.ok) {
        const j = await rAll.json();
        setTotalCount(typeof j.count === 'number' ? j.count : (Array.isArray(j.data) ? j.data.length : 0));
      }
    } catch (e) {
      console.error('Failed to fetch counts', e);
    }
  };

  const openCounterModal = async () => {
    setShowCounterModal(true);
    await loadCounter(counterYear);
  };

  const loadCounter = async (tahun: string) => {
    setCounterLoading(true);
    try {
      const res = await fetch(`/api/sertifikat/admin/counter?tahun=${encodeURIComponent(tahun)}`);
      if (!res.ok) throw new Error('Failed to fetch counter');
      const j = await res.json();
      setCounterValue(typeof j.sequence === 'number' ? j.sequence : 0);
      setCounterYear(String(j.tahun || tahun));
    } catch (e) {
      console.error('Load counter error', e);
      setCounterValue(null);
    } finally {
      setCounterLoading(false);
    }
  };

  const setCounter = async () => {
    if (!Number.isFinite(counterValue as number) || (counterValue as number) < 0) return alert('Masukkan angka valid >= 0');
    setCounterLoading(true);
    try {
      const res = await fetch('/api/sertifikat/admin/counter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tahun: counterYear, sequence: Number(counterValue), useAsNext: counterUseAsNext })
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        return alert(j.error || 'Gagal menyimpan counter');
      }
      await fetchCounts();
      alert('Counter berhasil diperbarui');
      setShowCounterModal(false);
    } catch (e) {
      console.error('Set counter error', e);
      alert('Terjadi kesalahan');
    } finally {
      setCounterLoading(false);
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
  await fetchCounts();
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

  const grouped = groupSubmissionsByParentId(submissions);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
            <div className="flex items-center gap-3">
              <button onClick={openCounterModal} className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">Atur No Urut</button>
              <button onClick={async () => {
                try {
                  const res = await fetch('/api/sertifikat/admin/export');
                  if (!res.ok) {
                    const j = await res.json().catch(() => ({}));
                    return alert(j.error || 'Gagal mengunduh');
                  }
                  const blob = await res.blob();
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `sertifikat_export_${new Date().toISOString().slice(0,10)}.xlsx`;
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  URL.revokeObjectURL(url);
                } catch (e) {
                  console.error('Download error', e);
                  alert('Terjadi kesalahan saat mengunduh');
                }
              }} className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm">Download XLSX</button>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => setFilter('PENDING_APPROVAL')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'PENDING_APPROVAL'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Semua ({totalCount})
            </button>
          </div>
          {filter === 'all' && (
            <div className="mt-3 bg-white border border-gray-100 rounded-md p-3">
              <div className="text-sm text-gray-700 mb-2 font-bold">Status:</div>
              <div className="flex gap-4 text-gray-700">
                {[
                  { value: 'PENDING_APPROVAL', label: 'Pending' },
                  { value: 'APPROVED', label: 'Approved' },
                  { value: 'REJECTED', label: 'Rejected' }
                ].map(opt => (
                  <label key={opt.value} className="inline-flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={selectedStatuses.includes(opt.value)} onChange={(e) => {
                      setSelectedStatuses(s => {
                        if (e.target.checked) return Array.from(new Set([...s, opt.value]));
                        return s.filter(x => x !== opt.value);
                      });
                    }} />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : grouped.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-gray-600">Tidak ada data</p>
          </div>
        ) : (
          <div className="space-y-4">
            {grouped.map((group, idx) => {
              const first = group[0];
              const isMultiPage = group.length > 1;
              const totalPages = getTotalPages(group);

              return (
                <div key={idx} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{first.nomorKontrak}</h3>
                        {getStatusBadge(first.status)}
                      </div>
                      <p className="text-sm text-gray-600">
                        Pengaju: <span className="font-semibold">{first.pengaju?.nama_pegawai}</span> ({first.pengaju?.nup})
                      </p>
                      <p className="text-sm text-gray-600">
                        {first.kodeProduksiM || first.kodeProduksiE} - {first.kompetensi} - {first.pasar}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-600">Tanggal:</span>
                      <p className="font-semibold text-black">{new Date(first.createdAt).toLocaleDateString('id-ID')}</p>
                    </div>
                    {isMultiPage && (
                      <div>
                        <span className="text-gray-600">Total Halaman:</span>
                        <p className="font-semibold text-black">{totalPages}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-600">Link Laporan:</span>
                      <a href={first.linkLaporan} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-semibold block truncate">Lihat Laporan →</a>
                    </div>
                  </div>

                  {/* Actions: show approve/reject buttons if any in group are pending */}
                  {group.some(g => g.status === 'PENDING_APPROVAL') && (
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button onClick={() => openModal(group.find(g => g.status === 'PENDING_APPROVAL') as SertifikatData, 'approve')} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold transition">✓ Approve</button>
                      <button onClick={() => openModal(group.find(g => g.status === 'PENDING_APPROVAL') as SertifikatData, 'reject')} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold transition">✗ Reject</button>
                    </div>
                  )}

                  {first.keterangan && (
                    <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <p className="text-sm font-semibold text-gray-700">Keterangan:</p>
                      <p className="text-sm text-gray-600 text-black">{first.keterangan}</p>
                    </div>
                  )}

                  {/* If approved, show nomor sertifikat list */}
                  {first.status === 'APPROVED' && first.nomorSertifikat && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                      <p className="text-sm font-semibold text-gray-700 mb-3">Nomor Sertifikat:</p>
                      <div className="space-y-2">
                        {group.map(item => (
                          <div key={item.id} className="flex items-center justify-between bg-white rounded-lg px-4 py-3 border border-gray-200">
                            <p className="text-xs font-mono text-gray-800 break-all flex-1 mr-4">{item.nomorSertifikat}</p>
                            <div className="flex items-center gap-2">
                              {item.qrCodeUrl && (
                                <a href={item.qrCodeUrl} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition">QR Code</a>
                              )}
                              <button
                                type="button"
                                onClick={async () => {
                                  if (!confirm('Hapus sertifikat ini? Nomor urut akan dikembalikan.')) return;
                                  try {
                                    const res = await fetch(`/api/sertifikat/admin/delete/${item.id}`, { method: 'POST' });
                                    if (!res.ok) {
                                      const j = await res.json().catch(() => ({}));
                                      return alert(j.error || 'Gagal menghapus');
                                    }
                                    // Refresh
                                    await fetchSubmissions();
                                    await fetchCounts();
                                  } catch (e) {
                                    console.error('Delete error', e);
                                    alert('Terjadi kesalahan saat menghapus');
                                  }
                                }}
                                className="w-8 h-8 inline-flex items-center justify-center rounded-md bg-red-600 hover:bg-red-700 text-white"
                                title="Hapus sertifikat"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash2 lucide-trash-2 w-4 h-4" aria-hidden="true">
                                  <path d="M3 6h18" />
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                  <line x1="10" x2="10" y1="11" y2="17" />
                                  <line x1="14" x2="14" y1="11" y2="17" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
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
              <p className="text-sm text-gray-600 mb-2"><strong>Nomor Kontrak:</strong> {selectedItem.nomorKontrak}</p>
              <p className="text-sm text-gray-600 mb-2"><strong>Pengaju:</strong> {selectedItem.pengaju?.nama_pegawai}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Keterangan {modalAction === 'reject' && <span className="text-red-500">*</span>}</label>
              <textarea value={keterangan} onChange={(e) => setKeterangan(e.target.value)} placeholder={modalAction === 'approve' ? 'Keterangan (opsional)' : 'Alasan penolakan (wajib)'} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black" rows={4} required={modalAction === 'reject'} />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)} disabled={processing} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-semibold transition">Batal</button>
              <button onClick={handleAction} disabled={processing} className={`flex-1 py-2 px-4 rounded-lg font-semibold transition text-white ${modalAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} disabled:opacity-50`}>{processing ? 'Memproses...' : modalAction === 'approve' ? 'Approve' : 'Reject'}</button>
            </div>
          </div>
        </div>
      )}
      {/* Counter Modal */}
      {showCounterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Atur Nomor Urut Sertifikat</h3>

            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-2">Tahun</label>
              <input value={counterYear} onChange={(e) => setCounterYear(e.target.value)} className="w-full px-3 py-2 border rounded-md text-black" />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-2">Nomor Urut Baru (angka)</label>
              <input type="number" value={counterValue ?? ''} onChange={(e) => setCounterValue(Number(e.target.value))} className="w-full px-3 py-2 border rounded-md text-black" />
              {counterLoading && <div className="text-sm text-gray-500 mt-2">Memuat...</div>}
            </div>

            <div className="mb-4 flex items-center gap-3">
              <input id="useAsNext" type="checkbox" checked={counterUseAsNext} onChange={(e) => setCounterUseAsNext(e.target.checked)} />
              <label htmlFor="useAsNext" className="text-sm text-gray-700">Gunakan sebagai nomor berikutnya</label>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowCounterModal(false)} disabled={counterLoading} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-semibold transition">Batal</button>
              <button onClick={setCounter} disabled={counterLoading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
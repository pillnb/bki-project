// app/sertifikat/my-submissions/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SertifikatData } from '@/lib/constants/sertifikatConstants';

export default function MySubmissionsPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<SertifikatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch('/api/sertifikat/my-submissions');
      
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/sertifikat/login');
          return;
        }
        throw new Error('Failed to fetch');
      }

      const data = await res.json();
      setSubmissions(data.data);
    } catch (err) {
      setError('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING_APPROVAL: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800'
    };
    const labels = {
      PENDING_APPROVAL: 'Menunggu Persetujuan',
      APPROVED: 'Disetujui',
      REJECTED: 'Ditolak'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Memuat data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Pengajuan Sertifikat Saya</h1>
          <button
            onClick={() => router.push('/sertifikat/form')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            + Buat Pengajuan Baru
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {submissions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Belum ada pengajuan</h3>
            <p className="text-gray-600 mb-6">Buat pengajuan sertifikat pertama Anda</p>
            <button
              onClick={() => router.push('/sertifikat/form')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Buat Pengajuan
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.nomorKontrak}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {item.kodeProduksiM || item.kodeProduksiE} - {item.kompetensi} - {item.pasar}
                    </p>
                  </div>
                  {getStatusBadge(item.status)}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-600">Tanggal Pengajuan:</span>
                    <p className="font-semibold">{new Date(item.createdAt).toLocaleDateString('id-ID')}</p>
                  </div>
                  {item.jumlahHalaman && (
                    <div>
                      <span className="text-gray-600">Jumlah Halaman:</span>
                      <p className="font-semibold">{item.jumlahHalaman}</p>
                    </div>
                  )}
                </div>

                {item.status === 'APPROVED' && item.nomorSertifikat && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-700 mb-1">Nomor Sertifikat:</p>
                        <p className="text-xs font-mono text-gray-800 break-all">{item.nomorSertifikat}</p>
                      </div>
                      {item.qrCodeImageUrl && (
                        <img src={item.qrCodeImageUrl} alt="QR Code" className="w-24 h-24 border border-gray-300 rounded" />
                      )}
                    </div>
                    {item.qrCodeUrl && (
                      <a 
                        href={item.qrCodeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
                      >
                        Lihat QR Code →
                      </a>
                    )}
                  </div>
                )}

                {item.status === 'REJECTED' && item.keterangan && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-sm font-semibold text-red-700 mb-1">Alasan Penolakan:</p>
                    <p className="text-sm text-gray-700">{item.keterangan}</p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <a 
                    href={item.linkLaporan} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Lihat Laporan Inspeksi →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
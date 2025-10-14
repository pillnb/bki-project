// app/sertifikat/login/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function SertifikatLoginPage() {
  const router = useRouter();
  const [nup, setNup] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pegawaiList, setPegawaiList] = useState<Array<{ nup: string; nama_pegawai: string }>>([]);
  const [pegName, setPegName] = useState<string | null>(null);
  const [loadingPegawai, setLoadingPegawai] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/sertifikat/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nup: nup.trim() })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login gagal');
        setLoading(false);
        return;
      }

      // Redirect ke form
      router.push('/sertifikat/form');
      
    } catch (err) {
      setError('Terjadi kesalahan koneksi');
      setLoading(false);
    }
  };

  useEffect(() => {
    // load pegawai list for datalist dropdown
    (async () => {
      setLoadingPegawai(true);
      try {
        const res = await fetch('/api/pegawai');
        if (!res.ok) return;
        const data = await res.json();
        // expect array of pegawai with nup and nama_pegawai
        setPegawaiList(Array.isArray(data) ? data.map((p: any) => ({ nup: p.nup, nama_pegawai: p.nama_pegawai })) : []);
      } catch (e) {
        // ignore silently
      } finally {
        setLoadingPegawai(false);
      }
    })();
  }, []);

  // update peg name tooltip when nup changes
  useEffect(() => {
    if (!nup) return setPegName(null);
    const found = pegawaiList.find(p => p.nup === nup);
    setPegName(found ? found.nama_pegawai : null);
  }, [nup, pegawaiList]);

  // close dropdown on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Sistem Sertifikat BKI
          </h1>
          <p className="text-gray-600">
            Login dengan NUP Anda
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nomor Urut Pegawai (NUP)
            </label>
            <div ref={containerRef} className="relative">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={nup}
                  onChange={(e) => { setNup(e.target.value); setShowDropdown(true); }}
                  placeholder={loadingPegawai ? 'Memuat daftar pegawai...' : 'Ketik atau pilih NUP'}
                  className="w-full px-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  required
                  disabled={loading}
                  aria-describedby="nup-help"
                  title={pegName || ''}
                />

                <button
                  type="button"
                  onClick={() => setShowDropdown(s => !s)}
                  aria-expanded={showDropdown}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-700 hover:bg-gray-100 rounded-r-lg"
                  style={{ borderLeft: '1px solid rgba(209, 213, 219, 1)' }}
                  aria-label="Toggle daftar NUP"
                >
                  <svg className={`w-4 h-4 transform ${showDropdown ? 'rotate-180' : 'rotate-0'}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {showDropdown && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  {pegawaiList.length === 0 ? (
                    <div className="p-3 text-sm text-gray-500">Tidak ada data</div>
                  ) : (
                    (pegawaiList
                      .filter(p => {
                        const q = nup.trim().toLowerCase();
                        if (!q) return true;
                        return p.nup.toLowerCase().includes(q) || p.nama_pegawai.toLowerCase().includes(q);
                      })
                      .slice(0, 300)
                      .map(p => (
                        <button
                          key={p.nup}
                          type="button"
                          onClick={() => { setNup(p.nup); setShowDropdown(false); inputRef.current?.focus(); }}
                          className="w-full text-left px-4 py-2 hover:bg-blue-50"
                          title={p.nama_pegawai}
                        >
                          <div className="text-sm text-gray-800">{p.nup}</div>
                          <div className="text-xs text-gray-500">{p.nama_pegawai}</div>
                        </button>
                      ))
                    )
                  )}
                </div>
              )}
            </div>

            <div id="nup-help" className="mt-2 text-sm text-gray-500">
              {pegName ? (
                <span title={pegName}>Nama: <strong className="text-black">{pegName}</strong></span>
              ) : (
                <span>{loadingPegawai ? 'Memuat daftar pegawai...' : 'Klik panah untuk melihat daftar NUP atau ketik untuk mencari'}</span>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Memverifikasi...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Hanya pegawai terdaftar yang dapat mengakses sistem ini
          </p>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import type { Personnel, PersonnelStatus } from '@/components/status-personel/types';

type Props = {
  data: Personnel[];
  formatDate: (v?: string | null) => string;
  calcDurationDays: (a?: string | null, b?: string | null) => number | null;
  daysRemainingText: (p: Personnel) => string | null;
};

const Badge = ({ status }: { status: PersonnelStatus }) => {
  const base = 'px-3 py-1 rounded-full text-xs font-bold border';
  const cls =
    status === 'ON_DUTY'
      ? 'bg-red-100 text-red-800 border-red-200'
      : status === 'READY'
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-blue-100 text-blue-800 border-blue-200';
  return <span className={`${base} ${cls}`}>{status === 'ON_DUTY' ? 'On Duty' : status === 'READY' ? 'Ready' : 'Unknown'}</span>;
};

export function PersonnelTable({ data, formatDate, calcDurationDays, daysRemainingText }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-blue-100" style={{ tableLayout: 'fixed' }}>
        <thead className="bg-blue-900">
          <tr>
            <th
              className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider sticky left-0 z-20 bg-blue-900 border-r border-blue-700"
              style={{ width: '260px', minWidth: '260px', maxWidth: '260px' }}
            >
              Personel
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[120px]">Status</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[200px]">Tanggal Tugas</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[160px]">Lokasi</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[240px]">Detail Pekerjaan</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[180px]">Info Tambahan</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-blue-50">
          {data.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-blue-400">
                Tidak ada data personel
              </td>
            </tr>
          ) : (
            data.map((p, idx) => {
              const rowBg = idx % 2 === 0 ? 'bg-blue-50' : 'bg-white';
              return (
                <tr key={p.id} className={`${rowBg} hover:bg-blue-100`}>
                  {/* sticky kolom personel */}
                  <td
                    className={`px-4 py-3 text-sm text-blue-900 sticky left-0 z-10 border-r border-blue-100 ${rowBg}`}
                    style={{ width: '260px', minWidth: '260px', maxWidth: '260px' }}
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <User className="h-5 w-5 text-blue-700" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold truncate" title={p.nama_pegawai}>{p.nama_pegawai}</div>
                        <div className="text-xs text-blue-700 truncate" title={p.nup}>{p.nup}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <Badge status={p.status} />
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-900">
                    <div className="flex items-start">
                      <Calendar className="h-4 w-4 mr-2 text-blue-400 mt-0.5" />
                      <div>
                        <div className="font-semibold">{formatDate(p.tanggal_berangkat)}</div>
                        <div className="text-blue-700">s/d {formatDate(p.tanggal_kembali)}</div>
                        <div className="text-xs text-blue-500 mt-1">
                          Durasi: {calcDurationDays(p.tanggal_berangkat, p.tanggal_kembali) ?? 'N/A'} hari
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-900">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-blue-400" />
                      <span className="truncate" title={p.lokasi_pekerjaan || ''}>{p.lokasi_pekerjaan || '-'}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-sm text-blue-900">
                    <div className="font-semibold truncate" title={p.pekerjaan || ''}>{p.pekerjaan || '-'}</div>
                    <div className="text-blue-700 truncate" title={p.klien || ''}>{p.klien || '-'}</div>
                    <div className="text-xs text-blue-500 mt-1 truncate" title={p.nomor_surat || ''}>
                      {p.nomor_surat || 'No surat belum tersedia'}
                    </div>
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-900">
                    {p.status === 'ON_DUTY' ? (
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-blue-400" />
                          <span>{daysRemainingText(p)}</span>
                        </div>
                        {typeof p.days_remaining === 'number' && p.days_remaining < 0 && (
                          <div className="text-xs text-red-600 font-bold">⚠ Terlambat kembali</div>
                        )}
                        {typeof p.days_remaining === 'number' && p.days_remaining <= 2 && p.days_remaining >= 0 && (
                          <div className="text-xs text-orange-600 font-bold">🔔 Segera kembali</div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-green-700 font-bold">Siap tugas</div>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
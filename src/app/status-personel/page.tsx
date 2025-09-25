'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '@/app/dashboard/pegawai/Navbar';
import { toast } from 'sonner';
import { Header } from '@/components/status-personel/Header';
import { SummaryCards } from '@/components/status-personel/SummaryCards';
import { FiltersBar } from '@/components/status-personel/FiltersBar';
import { PersonnelTable } from '@/components/status-personel/PersonnelTable';
import type { Personnel, PersonnelStatus } from '@/components/status-personel/types';

type ApiAssignments = {
  nup: string;
  nama_pegawai?: string;
  tanggal_berangkat?: string | null;
  tanggal_kembali?: string | null;
  lokasi_pekerjaan?: string | null;
  pekerjaan?: string | null;
  klien?: string | null;
  nomor_surat?: string | null;
}[];

type ApiPegawai = {
  nup: string;
  nama_pegawai: string;
  status_pegawai?: 'PKWT' | 'PKWTT' | 'KOMERBA' | string;
}[];


type LocalPersonnel = Omit<Personnel, 'employmentStatus'> & {
  employmentStatus?: string;
};

// helpers
const formatDate = (dateString?: string | null) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

const calcDurationDays = (start?: string | null, end?: string | null) => {
  if (!start || !end) return null;
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  if (Number.isNaN(s) || Number.isNaN(e)) return null;
  return Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
};

const isNowBetween = (start?: string | null, end?: string | null) => {
  if (!start || !end) return false;
  const now = new Date();
  const s = new Date(start);
  const e = new Date(end);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return false;
  // inklusif: mulai 00:00 start sampai 23:59:59 end
  return (
    now >= new Date(s.getFullYear(), s.getMonth(), s.getDate()) &&
    now <= new Date(e.getFullYear(), e.getMonth(), e.getDate(), 23, 59, 59, 999)
  );
};

const daysRemainingFrom = (end?: string | null) => {
  if (!end) return null;
  const diff = Math.ceil((new Date(end).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diff > 0) return `${diff} hari lagi`;
  if (diff === 0) return 'Hari ini';
  return 'Terlambat';
};

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center">
            <div className="h-14 w-14 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mb-4" />
            <p className="text-blue-900 font-semibold text-lg tracking-wide">Loading</p>
            <p className="text-blue-600 text-sm mt-1">Menyiapkan status personel...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StatusPersonelPage() {
  const [data, setData] = useState<LocalPersonnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | 'ON_DUTY' | 'READY'>('all');

  // filter kontrak (checkbox): default PKWT/PKWTT/KOMERBA sesuai requirement
  const [employmentFilter, setEmploymentFilter] = useState<string[]>(['PKWT', 'PKWTT', 'KOMERBA']);

  const fetchData = async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);

      // roster pegawai
      const resPeg = await fetch('/api/pegawai');
      if (!resPeg.ok) throw new Error(`Pegawai HTTP ${resPeg.status}`);
      const allPegawai: ApiPegawai = await resPeg.json();

      // hanya PKWT, PKWTT, KOMERBA (tidak termasuk FREELANCE)
      const eligible = allPegawai.filter((p) =>
        ['PKWT', 'PKWTT', 'KOMERBA'].includes((p.status_pegawai || '').toUpperCase())
      );

      // assignments
      const resAsg = await fetch('/api/status-personel');
      if (!resAsg.ok) throw new Error(`Status HTTP ${resAsg.status}`);
      const asgJson = await resAsg.json();
      if (!asgJson.success) throw new Error(asgJson.error || 'Gagal ambil status personel');
      const assignments: ApiAssignments = asgJson.data || [];

      const byNup = new Map<string, ApiAssignments>();
      for (const a of assignments) {
        const key = (a.nup || '').toString();
        if (!key) continue;
        const arr = byNup.get(key) || [];
        arr.push(a);
        byNup.set(key, arr);
      }

      const merged: LocalPersonnel[] = eligible.map((peg) => {
        const nup = peg.nup;
        const nama_pegawai = peg.nama_pegawai;
        const personAssignments = byNup.get(nup) || [];

        // pilih penugasan aktif; jika lebih dari 1, ambil yang paling cepat selesai
        const active = personAssignments
          .filter((a) => isNowBetween(a.tanggal_berangkat, a.tanggal_kembali))
          .sort(
            (a, b) =>
              new Date(a.tanggal_kembali || 0).getTime() - new Date(b.tanggal_kembali || 0).getTime()
          )[0];

        const status: PersonnelStatus = active ? 'ON_DUTY' : 'READY';

        return {
          id: nup,
          nama_pegawai,
          nup,
          status,
          tanggal_berangkat: active?.tanggal_berangkat ?? null,
          tanggal_kembali: active?.tanggal_kembali ?? null,
          lokasi_pekerjaan: active?.lokasi_pekerjaan ?? null,
          pekerjaan: active?.pekerjaan ?? null,
          klien: active?.klien ?? null,
          nomor_surat: active?.nomor_surat ?? null,
          days_remaining: active
            ? Math.ceil((new Date(active.tanggal_kembali!).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
            : null,
          employmentStatus: peg.status_pegawai ?? undefined, // simpan kontrak buat difilter
        };
      });

      setData(merged);
      setLastUpdated(new Date().toLocaleString('id-ID'));
      toast.success('Data personel berhasil diperbarui');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Terjadi kesalahan';
      toast.error(`Gagal memuat data: ${msg}`);
      setData([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data
      // filter kontrak kerja via checkbox
      .filter((p) => {
        if (employmentFilter.length === 0) return true;
        const s = (p.employmentStatus || '').toUpperCase();
        return employmentFilter.includes(s);
      })
      // filter text + status personel
      .filter((p) => {
        const matchesSearch =
          p.nama_pegawai?.toLowerCase().includes(q) ||
          p.nup?.toLowerCase().includes(q) ||
          p.lokasi_pekerjaan?.toLowerCase().includes(q) ||
          p.pekerjaan?.toLowerCase().includes(q) ||
          p.klien?.toLowerCase().includes(q) ||
          p.nomor_surat?.toLowerCase().includes(q);
        const matchesStatus = status === 'all' || p.status === status;
        return matchesSearch && matchesStatus;
      });
  }, [data, search, status, employmentFilter]);

  const onDuty = data.filter((p) => p.status === 'ON_DUTY').length;
  const ready = data.filter((p) => p.status === 'READY').length;

  const handleExport = () => {
    if (filtered.length === 0) {
      toast.warning('Tidak ada data untuk diekspor');
      return;
    }
    const headers = [
      'Nama Pegawai',
      'NUP',
      'Status',
      'Tanggal Berangkat',
      'Tanggal Kembali',
      'Lokasi Pekerjaan',
      'Pekerjaan',
      'Klien',
      'Nomor Surat',
      'Sisa Hari',
      'Durasi (hari)',
    ];
    const rows = filtered.map((p) => [
      `"${p.nama_pegawai || ''}"`,
      `"${p.nup || ''}"`,
      `"${p.status}"`,
      `"${formatDate(p.tanggal_berangkat)}"`,
      `"${formatDate(p.tanggal_kembali)}"`,
      `"${p.lokasi_pekerjaan || ''}"`,
      `"${p.pekerjaan || ''}"`,
      `"${p.klien || ''}"`,
      `"${p.nomor_surat || ''}"`,
      `"${p.status === 'ON_DUTY' ? daysRemainingFrom(p.tanggal_kembali) ?? '' : 'Ready'}"`,
      `"${calcDurationDays(p.tanggal_berangkat, p.tanggal_kembali) ?? ''}"`,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `status-personel-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Header lastUpdated={lastUpdated} onRefresh={() => fetchData(true)} refreshing={refreshing} />


        {/* Card Pencarian & Filter: tema biru seperti contoh */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h3 className="text-lg font-bold text-blue-900 mb-4">Pencarian &amp; Filter</h3>

          <FiltersBar
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
            filteredCount={filtered.length}
            totalCount={data.length}
            onExport={handleExport}
            employmentFilter={employmentFilter}
            setEmploymentFilter={setEmploymentFilter}
          />
        </div>

        {/* Summary */}
        <div className="mt-6">
          <SummaryCards onDuty={onDuty} ready={ready} total={data.length} />
        </div>

        {/* Header Tabel */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-lg font-bold text-blue-900">Daftar Personel</h3>
            <span className="text-sm text-blue-700">
              Menampilkan {filtered.length} dari {data.length} personel
            </span>
          </div>
        </div>

        {/* Tabel Personel*/}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <PersonnelTable
            data={filtered}
            formatDate={formatDate}
            calcDurationDays={calcDurationDays}
            daysRemainingText={(p) => (p.status === 'ON_DUTY' ? daysRemainingFrom(p.tanggal_kembali) : null)}
          />
        </div>

      </div>
    </div>
  );
}
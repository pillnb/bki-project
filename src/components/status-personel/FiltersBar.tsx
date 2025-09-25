'use client';

import React from 'react';
import { Download, Filter, Search } from 'lucide-react';

type Props = {
  search: string;
  setSearch: (v: string) => void;
  status: 'all' | 'ON_DUTY' | 'READY';
  setStatus: (v: 'all' | 'ON_DUTY' | 'READY') => void;
  filteredCount: number;
  totalCount: number;
  onExport: () => void;
  employmentFilter: string[];
  setEmploymentFilter: React.Dispatch<React.SetStateAction<string[]>>;
};

const EMPLOYMENT_OPTIONS = ['PKWT', 'PKWTT', 'KOMERBA'];

export function FiltersBar({
  search,
  setSearch,
  status,
  setStatus,
  filteredCount,
  totalCount,
  onExport,
  employmentFilter,
  setEmploymentFilter,
}: Props) {
  return (
    <>
      {/* grid utama: kiri (search) | kanan (status+export) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* kiri: search bar */}
        <div className="md:col-span-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama, NUP, lokasi, pekerjaan, atau klien..."
              className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-blue-50 text-blue-900"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* kanan: status personel (atas) + export csv (bawah), rata kanan */}
        <div className="md:col-span-4 flex flex-col gap-3 md:items-end">
          <div className="relative w-full md:w-64">
            
            
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 h-5 w-5" />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'all' | 'ON_DUTY' | 'READY')}
              className="pl-10 pr-4 py-2 w-full border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-blue-50 text-blue-900 appearance-none"
            >
              <option value="all">Semua Status Personel</option>
              <option value="ON_DUTY">On Duty</option>
              <option value="READY">Ready</option>
            </select>
          </div>

          <button
            onClick={onExport}
            className="inline-flex items-center justify-center md:w-64 px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition shadow disabled:bg-gray-400"
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* checkbox status pegawai di bawah, full width */}
      <div className="mt-4">
        <label className="text-xs text-blue-900 font-semibold mb-1 block">Status Pegawai</label>
        <div className="flex flex-wrap gap-3">
          {EMPLOYMENT_OPTIONS.map((opt) => {
            const checked = employmentFilter.includes(opt);
            return (
              <label key={opt} className="inline-flex items-center gap-2 text-blue-900 text-xs font-medium">
                <input
                  type="checkbox"
                  className="accent-blue-700"
                  checked={checked}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setEmploymentFilter((prev) => [...prev, opt]);
                    } else {
                      setEmploymentFilter((prev) => prev.filter((s) => s !== opt));
                    }
                  }}
                />
                {opt}
              </label>
            );
          })}
        </div>

        <div className="mt-3 text-sm text-blue-700">
          Menampilkan {filteredCount} dari {totalCount} personel
        </div>
      </div>
    </>
  );
}
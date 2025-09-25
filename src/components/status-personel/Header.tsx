import React from 'react';
import { RefreshCw } from 'lucide-react';

type Props = {
  lastUpdated: string | null;
  onRefresh: () => void;
  refreshing: boolean;
};

export function Header({ lastUpdated, onRefresh, refreshing }: Props) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Status Personel</h1>
          <p className="text-gray-600">Monitor status dan ketersediaan personel berdasarkan surat tugas</p>
          {lastUpdated && <p className="text-sm text-gray-500 mt-1">Terakhir diperbarui: {lastUpdated}</p>}
        </div>
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Memperbarui...' : 'Perbarui'}
        </button>
      </div>
    </div>
  );
}
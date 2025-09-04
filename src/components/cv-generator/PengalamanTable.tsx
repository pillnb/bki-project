import React from "react";
import type { PengalamanItem } from "./types";

export default function PengalamanTable({
  items,
  onAddClick,
}: {
  items: PengalamanItem[];
  onAddClick: () => void;
}) {
  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-800">Pengalaman Kerja</h2>
        <button
          onClick={onAddClick}
          className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors font-semibold"
        >
          Tambah Pengalaman
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-100">
              <Th>Tahun</Th>
              <Th>Pengalaman Kerja</Th>
              <Th>Perusahaan</Th>
              <Th>Lokasi</Th>
            </tr>
          </thead>
          <tbody>
            {items?.length > 0 ? (
              items.map((item, i) => (
                <tr key={item.id_pengalaman} className={i % 2 === 0 ? "bg-white hover:bg-blue-50" : "bg-gray-50 hover:bg-blue-50"}>
                  <Td>{item.tahun_awal === item.tahun_akhir ? item.tahun_awal : `${item.tahun_awal} - ${item.tahun_akhir}`}</Td>
                  <Td>{item.pengalaman_kerja}</Td>
                  <Td>{item.perusahaan}</Td>
                  <Td>{item.lokasi || "-"}</Td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-2 text-center text-gray-500 bg-white">
                  Belum ada data pengalaman kerja
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-2 font-bold text-blue-900 border-b border-gray-300 text-left">{children}</th>;
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-2 text-black border-b border-gray-200">{children}</td>;
}
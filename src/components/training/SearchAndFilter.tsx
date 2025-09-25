"use client";

import React, { useEffect, useRef, useState } from "react";

type Option = { value: "VALID" | "ON_GOING" | "EXPIRED"; label: string };

const statusOptions: Option[] = [
  { value: "VALID", label: "Valid" },
  { value: "ON_GOING", label: "On Going" },
  { value: "EXPIRED", label: "Expired" },
];

export default function SearchAndFilter({
  filter,
  setFilter,
  statusFilter,
  setStatusFilter,
  total,
}: {
  filter: string;
  setFilter: (v: string) => void;
  statusFilter: string[];
  setStatusFilter: (v: string[]) => void;
  total: number;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const toggleOption = (opt: Option["value"]) => {
    let next: string[];
    if (statusFilter.includes("ALL")) next = [opt];
    else if (statusFilter.includes(opt)) next = statusFilter.filter((s) => s !== opt);
    else next = [...statusFilter, opt];
    if (next.length === 0) next = ["ALL"];
    setStatusFilter(next);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
      <div className="flex flex-col md:flex-row md:items-center gap-2 w-full">
        <div className="relative w-full md:w-96">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4-4m0 0A7 7 0 104 4a7 7 0 0013 13z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Cari nama, penyelenggara, atau status..."
            className="border border-gray-300 rounded-full px-10 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        <div className="relative min-w-[180px] text-black" ref={dropdownRef}>
          <button
            type="button"
            className="border border-gray-300 rounded-full px-4 py-2 w-full text-left text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
            onClick={() => setOpen((v) => !v)}
          >
            <span>
              {statusFilter.length === 0 || statusFilter.includes("ALL")
                ? "Semua Status"
                : statusOptions
                    .filter((opt) => statusFilter.includes(opt.value))
                    .map((opt) => opt.label)
                    .join(", ")}
            </span>
            <svg
              className={`ml-2 h-4 w-4 transition-transform ${open ? "rotate-180" : "rotate-0"}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {open && (
            <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-56 overflow-y-auto">
              <div
                className="px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer"
                onClick={() => setStatusFilter(["ALL"])}
              >
                <input type="checkbox" checked={statusFilter.includes("ALL")} readOnly className="mr-2 accent-blue-600" />
                <span>Semua Status</span>
              </div>
              {statusOptions.map((opt) => (
                <div
                  key={opt.value}
                  className={`px-4 py-2 hover:bg-blue-50 flex items-center cursor-pointer ${
                    statusFilter.includes(opt.value) ? "bg-blue-50" : ""
                  }`}
                  onClick={() => toggleOption(opt.value)}
                >
                  <input type="checkbox" checked={statusFilter.includes(opt.value)} readOnly className="mr-2 accent-blue-600" />
                  <span>{opt.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="text-sm text-gray-600 mt-2 md:mt-0">Total: {total} training</div>
    </div>
  );
}
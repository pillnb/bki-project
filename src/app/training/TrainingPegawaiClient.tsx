"use client";
import React, { useState, useRef, useEffect } from "react";
import Navbar from "../dashboard/pegawai/Navbar";

// Interface untuk type safety
interface Training {
  id: number;
  nama: string;
  penyelenggara: string;
  tanggalMulai: string;
  tanggalSelesaiEstimasi: string;
  tahun: number;
  status: "ON_GOING" | "VALID" | "EXPIRED";
  tanggalSelesaiAktual?: string;
  noSertifikat?: string;
  file?: File | string;
  file_url?: string;
  tanggalKadaluarsa?: string;
}

interface AddFormData {
  nama: string;
  penyelenggara: string;
  tanggalMulai: string;
  tanggalSelesaiEstimasi: string;
  tahun: string;
}

interface CompleteFormData {
  id: number | null;
  tanggalSelesaiAktual: string;
  noSertifikat: string;
  file: File | null;
  tanggalKadaluarsa: string;
}

function formatDate(date: string): string {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function validateFile(file: File): string | null {
  const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
  const maxSize = 2 * 1024 * 1024; // 2MB
  if (!allowedTypes.includes(file.type)) {
    return "Format file tidak didukung. Hanya PDF, PNG, JPG, dan JPEG yang diizinkan.";
  }
  if (file.size > maxSize) {
    return "Ukuran file terlalu besar. Maksimal 2MB.";
  }
  return null;
}

function validateDateRange(startDate: string, endDate: string): boolean {
  return new Date(startDate) <= new Date(endDate);
}

function isCertificateExpired(expiryDate: string): boolean {
  if (!expiryDate) return false;
  return new Date(expiryDate) < new Date();
}

type Props = {
  nup?: string;
  pegawai?: any;
};

export default function TrainingPegawaiClient({ nup, pegawai }: Props) {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentNup, setCurrentNup] = useState<string>("");
  const [filter, setFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string[]>(["ALL"]);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const statusOptions = [
    { value: "VALID", label: "Valid" },
    { value: "ON_GOING", label: "On Going" },
    { value: "EXPIRED", label: "Expired" },
  ];
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const [sortKey, setSortKey] = useState<keyof Training>("nama");
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showCompleteForm, setShowCompleteForm] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string>("");
  const [dateError, setDateError] = useState<string>("");
  const [addForm, setAddForm] = useState<AddFormData>({
    nama: "",
    penyelenggara: "",
    tanggalMulai: "",
    tanggalSelesaiEstimasi: "",
    tahun: ""
  });
  const [completeForm, setCompleteForm] = useState<CompleteFormData>({
    id: null,
    tanggalSelesaiAktual: "",
    noSertifikat: "",
    file: null,
    tanggalKadaluarsa: ""
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch current user's NUP and trainings
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        // Jika nup sudah diberikan sebagai prop, gunakan itu
        if (nup) {
          setCurrentNup(nup);
          const res = await fetch(`/api/training?nup=${nup}`);
          if (!res.ok) throw new Error("Gagal mengambil data training");
          const data = await res.json();
          setTrainings(data);
        } else {
          // Jika tidak, fetch dari cookie (untuk user yang login)
          const res = await fetch("/api/training");
          if (!res.ok) throw new Error("Gagal mengambil data training");
          const data = await res.json();
          setTrainings(data);
          
          // Ambil NUP dari data pegawai yang login
          const userRes = await fetch("/api/pegawai/current");
          if (userRes.ok) {
            const userData = await userRes.json();
            setCurrentNup(userData.nup);
          }
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [nup]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setStatusDropdownOpen(false);
      }
    }
    if (statusDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [statusDropdownOpen]);

  // Effect untuk update status expired berdasarkan tanggal kadaluarsa
  useEffect(() => {
    const checkExpiredCertificates = () => {
      setTrainings(prevTrainings => 
        prevTrainings.map(training => {
          if (training.status === "VALID" && training.tanggalKadaluarsa) {
            const isExpired = isCertificateExpired(training.tanggalKadaluarsa);
            return isExpired ? { ...training, status: "EXPIRED" as const } : training;
          }
          return training;
        })
      );
    };
    checkExpiredCertificates();
    const interval = setInterval(checkExpiredCertificates, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredTrainings = React.useMemo(() => {
    let result = trainings.filter((t) => {
      if (!t || typeof t !== 'object') return false;
      // Defensive: skip if any field is missing or not string
      const nama = typeof t.nama === 'string' ? t.nama : '';
      const penyelenggara = typeof t.penyelenggara === 'string' ? t.penyelenggara : '';
      const status = typeof t.status === 'string' ? t.status : '';
      return (
        nama.toLowerCase().includes(filter.toLowerCase()) ||
        penyelenggara.toLowerCase().includes(filter.toLowerCase()) ||
        status.toLowerCase().includes(filter.toLowerCase())
      );
    });
    if (!(statusFilter.includes("ALL") || statusFilter.length === 0)) {
      result = result.filter((t) => statusFilter.includes(t.status));
    }
    return result.sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;
      if (aValue < bValue) return sortAsc ? -1 : 1;
      if (aValue > bValue) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [trainings, filter, sortKey, sortAsc, statusFilter]);

  const resetAddForm = () => {
    setAddForm({
      nama: "",
      penyelenggara: "",
      tanggalMulai: "",
      tanggalSelesaiEstimasi: "",
      tahun: ""
    });
    setDateError("");
  };

  const resetCompleteForm = () => {
    setCompleteForm({
      id: null,
      tanggalSelesaiAktual: "",
      noSertifikat: "",
      file: null,
      tanggalKadaluarsa: ""
    });
    setFileError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Tambah training
  const handleAddTraining = async (e: React.FormEvent) => {
    e.preventDefault();
    setDateError("");
    if (!validateDateRange(addForm.tanggalMulai, addForm.tanggalSelesaiEstimasi)) {
      setDateError("Tanggal selesai harus sama atau setelah tanggal mulai");
      return;
    }
    
    if (!currentNup) {
      setDateError("NUP tidak ditemukan. Silakan login ulang.");
      return;
    }

    try {
      const res = await fetch("/api/training", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nup: currentNup,
          nama_pelatihan: addForm.nama,
          penyelenggara: addForm.penyelenggara,
          tanggal_awal: addForm.tanggalMulai,
          tanggal_akhir: addForm.tanggalSelesaiEstimasi,
          masa_berlaku: addForm.tanggalSelesaiEstimasi,
          tahun: Number(addForm.tahun),
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal menambah training");
      }
      
      const created = await res.json();
      // Map API response to Training interface
      const mapped: Training = {
        id: created.id_pelatihan ?? created.id,
        nama: created.nama_pelatihan ?? created.nama,
        penyelenggara: created.penyelenggara,
        tanggalMulai: created.tanggal_awal ?? created.tanggalMulai,
        tanggalSelesaiEstimasi: created.tanggal_akhir ?? created.tanggalSelesaiEstimasi,
        tahun: created.tahun,
        status: created.status || "ON_GOING",
        tanggalSelesaiAktual: created.tanggal_akhir ?? created.tanggalSelesaiAktual,
        noSertifikat: created.nomor_sertifikat ?? created.noSertifikat,
        tanggalKadaluarsa: created.masa_berlaku ?? created.tanggalKadaluarsa,
      };
      
      setTrainings(prev => [mapped, ...prev]);
      resetAddForm();
      setShowAddForm(false);
    } catch (err) {
      console.error("Error adding training:", err);
      setDateError(err instanceof Error ? err.message : "Gagal menambah training");
    }
  };

  // Selesaikan training
  const handleCompleteTraining = async (e: React.FormEvent) => {
    e.preventDefault();
    setFileError("");
    if (!completeForm.file) {
      setFileError("File sertifikat wajib diupload");
      return;
    }
    const fileValidationError = validateFile(completeForm.file);
    if (fileValidationError) {
      setFileError(fileValidationError);
      return;
    }
    try {
      // TODO: Upload file to storage and get URL, here we use dummy URL
      const uploadedFileUrl = "https://dummy.url/sertifikat.pdf";
      const res = await fetch("/api/training", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_pelatihan: completeForm.id,
          data: {
            nomor_sertifikat: completeForm.noSertifikat,
            tanggal_akhir: completeForm.tanggalSelesaiAktual,
            masa_berlaku: completeForm.tanggalKadaluarsa,
            file_url: uploadedFileUrl,
          },
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal menyelesaikan training");
      }
      
      const updated = await res.json();
      // Map API response to Training interface
      const mapped: Training = {
        id: updated.id_pelatihan ?? updated.id,
        nama: updated.nama_pelatihan ?? updated.nama,
        penyelenggara: updated.penyelenggara,
        tanggalMulai: updated.tanggal_awal ?? updated.tanggalMulai,
        tanggalSelesaiEstimasi: updated.tanggal_akhir ?? updated.tanggalSelesaiEstimasi,
        tahun: updated.tahun,
        status: updated.status || "VALID",
        tanggalSelesaiAktual: updated.tanggal_akhir ?? updated.tanggalSelesaiAktual,
        noSertifikat: updated.nomor_sertifikat ?? updated.noSertifikat,
        tanggalKadaluarsa: updated.masa_berlaku ?? updated.tanggalKadaluarsa,
      };
      
      setTrainings(prev => prev.map(t => t.id === mapped.id ? mapped : t));
      setShowCompleteForm(false);
      resetCompleteForm();
    } catch (err) {
      console.error("Error completing training:", err);
      setFileError(err instanceof Error ? err.message : "Gagal menyelesaikan training");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validationError = validateFile(file);
      if (validationError) {
        setFileError(validationError);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }
      setCompleteForm((prev) => ({ ...prev, file }));
    }
  };

  const openCompleteForm = (training: Training) => {
    setCompleteForm({
      id: training.id,
      tanggalSelesaiAktual: training.tanggalSelesaiEstimasi,
      noSertifikat: "",
      file: null,
      tanggalKadaluarsa: ""
    });
    setShowCompleteForm(true);
  };

  const handleSort = (key: keyof Training) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e9f1fa] pb-10">
        <Navbar />
        <div className="max-w-6xl mx-auto mt-12 px-4">
          <div className="text-center py-8">
            <div className="text-blue-900">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e9f1fa] pb-10">
      <Navbar />
      <div className="max-w-6xl mx-auto mt-12 px-4">
        {/* Pegawai Info */}
        {pegawai && (
          <div className="rounded-xl shadow-lg p-6 flex items-center gap-6 mb-8" style={{ backgroundColor: '#193288' }}>
            <div className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center text-4xl font-bold text-white border-2 border-white border-solid shadow-md">
              <span role="img" aria-label="avatar">🧑🏽‍💼</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{pegawai?.nama_pegawai || '-'}</h2>
              <div className="text-white text-sm">Status Pegawai: <span className="font-bold text-white">{pegawai?.status_pegawai || '-'}</span></div>
              <div className="text-white text-sm">NUP: <span className="font-bold text-white">{pegawai?.nup || '-'}</span></div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-blue-900">Training Pegawai</h1>
          <button
            className="bg-blue-900 text-white px-4 py-2 rounded font-semibold hover:bg-blue-800 shadow transition-colors"
            onClick={() => setShowAddForm(true)}
          >
            Tambah Training
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6 mb-8">
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
              {/* Status Filter Dropdown */}
              <div className="relative min-w-[180px]" ref={statusDropdownRef}>
                <button
                  type="button"
                  className="border border-gray-300 rounded-full px-4 py-2 w-full text-left text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
                  onClick={() => setStatusDropdownOpen((open) => !open)}
                >
                  <span>
                    {statusFilter.length === 0 || statusFilter.includes("ALL")
                      ? "Semua Status"
                      : statusOptions.filter(opt => statusFilter.includes(opt.value)).map(opt => opt.label).join(", ")}
                  </span>
                  <svg className={`ml-2 h-4 w-4 transition-transform ${statusDropdownOpen ? "rotate-180" : "rotate-0"}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {statusDropdownOpen && (
                  <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-56 overflow-y-auto animate-fadeIn">
                    <div
                      className="px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer"
                      onClick={() => setStatusFilter(["ALL"])}
                    >
                      <input
                        type="checkbox"
                        checked={statusFilter.includes("ALL")}
                        readOnly
                        className="mr-2 accent-blue-600"
                      />
                      <span>Semua Status</span>
                    </div>
                    {statusOptions.map(opt => (
                      <div
                        key={opt.value}
                        className={`px-4 py-2 hover:bg-blue-50 flex items-center cursor-pointer ${statusFilter.includes(opt.value) ? "bg-blue-50" : ""}`}
                        onClick={() => {
                          let newFilter: string[];
                          if (statusFilter.includes("ALL")) newFilter = [opt.value];
                          else if (statusFilter.includes(opt.value)) newFilter = statusFilter.filter(s => s !== opt.value);
                          else newFilter = [...statusFilter, opt.value];
                          if (newFilter.length === 0) newFilter = ["ALL"];
                          setStatusFilter(newFilter);
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={statusFilter.includes(opt.value)}
                          readOnly
                          className="mr-2 accent-blue-600"
                        />
                        <span>{opt.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-600 mt-2 md:mt-0">
              Total: {filteredTrainings.length} training
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded">
              <thead>
                <tr className="bg-blue-100 text-blue-900">
                  <th 
                    className="py-3 px-4 text-left cursor-pointer hover:bg-blue-200 transition-colors"
                    onClick={() => handleSort("nama")}
                  >
                    Nama Training {sortKey === "nama" && (sortAsc ? "↑" : "↓")}
                  </th>
                  <th 
                    className="py-3 px-4 text-left cursor-pointer hover:bg-blue-200 transition-colors"
                    onClick={() => handleSort("penyelenggara")}
                  >
                    Penyelenggara {sortKey === "penyelenggara" && (sortAsc ? "↑" : "↓")}
                  </th>
                  <th 
                    className="py-3 px-4 text-left cursor-pointer hover:bg-blue-200 transition-colors"
                    onClick={() => handleSort("tanggalMulai")}
                  >
                    Tanggal Mulai {sortKey === "tanggalMulai" && (sortAsc ? "↑" : "↓")}
                  </th>
                  <th 
                    className="py-3 px-4 text-left cursor-pointer hover:bg-blue-200 transition-colors"
                    onClick={() => handleSort("tanggalSelesaiEstimasi")}
                  >
                    Tanggal Selesai {sortKey === "tanggalSelesaiEstimasi" && (sortAsc ? "↑" : "↓")}
                  </th>
                  <th 
                    className="py-3 px-4 text-left cursor-pointer hover:bg-blue-200 transition-colors"
                    onClick={() => handleSort("status")}
                  >
                    Status {sortKey === "status" && (sortAsc ? "↑" : "↓")}
                  </th>
                  <th className="py-3 px-4 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrainings.map((training) => (
                  <tr key={training.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-black">{training.nama}</td>
                    <td className="py-3 px-4 text-black">{training.penyelenggara}</td>
                    <td className="py-3 px-4 text-black">{formatDate(training.tanggalMulai)}</td>
                    <td className="py-3 px-4 text-black">{formatDate(training.tanggalSelesaiEstimasi)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        training.status === "VALID" 
                          ? "bg-green-100 text-green-800" 
                          : training.status === "EXPIRED" 
                          ? "bg-red-100 text-red-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {training.status === "VALID" ? "Valid" : training.status === "EXPIRED" ? "Expired" : "On Going"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {training.status === "ON_GOING" && (
                        <button
                          onClick={() => openCompleteForm(training)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                        >
                          Selesaikan
                        </button>
                      )}
                      {(training.status === "VALID" || training.status === "EXPIRED") && (
                        <div className="flex flex-col items-start gap-1">
                          <button
                            title="Edit Training"
                            className="flex items-center gap-1 bg-blue-900 hover:bg-blue-800 text-white px-3 py-1 rounded text-xs font-semibold transition-colors"
                            onClick={() => {
                              setCompleteForm({
                                id: training.id,
                                tanggalSelesaiAktual: training.tanggalSelesaiAktual || training.tanggalSelesaiEstimasi || "",
                                noSertifikat: training.noSertifikat || "",
                                file: null,
                                tanggalKadaluarsa: training.tanggalKadaluarsa || ""
                              });
                              setShowCompleteForm(true);
                            }}
                          >
                            {/* Heroicons Pencil Square - better looking pencil */}
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 20 20" 
                                fill="currentColor" 
                                className="w-4 h-4"
                            >
                                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                            </svg>
                            <span>Edit</span>
                            </button>
                          {training.file || training.file_url ? (
                            <a
                              href={training.file_url || (typeof training.file === 'string' ? training.file : undefined)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-gray-400 hover:underline mt-0.5"
                              style={{ fontSize: '11px' }}
                            >
                              Lihat Sertifikat
                            </a>
                          ) : null}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredTrainings.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Tidak ada training yang ditemukan.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Training Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4 text-black">Tambah Training</h2>
            <form onSubmit={handleAddTraining}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-black">
                  Nama Training <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={addForm.nama}
                  onChange={(e) => setAddForm(prev => ({ ...prev, nama: e.target.value }))}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-black">
                  Penyelenggara <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={addForm.penyelenggara}
                  onChange={(e) => setAddForm(prev => ({ ...prev, penyelenggara: e.target.value }))}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-black">
                  Tanggal Mulai <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={addForm.tanggalMulai}
                  onChange={(e) => setAddForm(prev => ({ ...prev, tanggalMulai: e.target.value }))}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-black">
                  Tanggal Selesai Estimasi <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={addForm.tanggalSelesaiEstimasi}
                  onChange={(e) => setAddForm(prev => ({ ...prev, tanggalSelesaiEstimasi: e.target.value }))}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-black">
                  Tahun <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={addForm.tahun}
                  onChange={(e) => setAddForm(prev => ({ ...prev, tahun: e.target.value }))}
                />
              </div>
              {dateError && <div className="text-red-500 text-sm mb-4">{dateError}</div>}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    resetAddForm();
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                 className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 transition-colors"
               >
                 Tambah
               </button>
             </div>
           </form>
         </div>
       </div>
     )}

     {/* Complete Training Modal */}
     {showCompleteForm && (
       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
         <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
           <h2 className="text-xl font-bold mb-4 text-black">Selesaikan Training</h2>
           <form onSubmit={handleCompleteTraining}>
             <div className="mb-4">
               <label className="block text-sm font-medium mb-1 text-black">
                 Tanggal Selesai Aktual <span className="text-red-600">*</span>
               </label>
               <input
                 type="date"
                 required
                 className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                 value={completeForm.tanggalSelesaiAktual}
                 onChange={(e) => setCompleteForm(prev => ({ ...prev, tanggalSelesaiAktual: e.target.value }))}
               />
             </div>
             <div className="mb-4">
               <label className="block text-sm font-medium mb-1 text-black">
                 Nomor Sertifikat <span className="text-red-600">*</span>
               </label>
               <input
                 type="text"
                 required
                 className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                 value={completeForm.noSertifikat}
                 onChange={(e) => setCompleteForm(prev => ({ ...prev, noSertifikat: e.target.value }))}
               />
             </div>
             <div className="mb-4">
               <label className="block text-sm font-medium mb-1 text-black">
                 Tanggal Kadaluarsa <span className="text-red-600">*</span>
               </label>
               <input
                 type="date"
                 required
                 className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                 value={completeForm.tanggalKadaluarsa}
                 onChange={(e) => setCompleteForm(prev => ({ ...prev, tanggalKadaluarsa: e.target.value }))}
               />
             </div>
             <div className="mb-4">
               <label className="block text-sm font-medium mb-1 text-black">
                 Upload Sertifikat <span className="text-red-600">*</span>
               </label>
               <input
                 type="file"
                 ref={fileInputRef}
                 accept=".pdf,.png,.jpg,.jpeg"
                 required
                 className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                 onChange={handleFileChange}
               />
               <p className="text-xs text-gray-500 mt-1">Format: PDF, PNG, JPG, JPEG. Maksimal 5MB</p>
             </div>
             {fileError && <div className="text-red-500 text-sm mb-4">{fileError}</div>}
             <div className="flex justify-end gap-2">
               <button
                 type="button"
                 onClick={() => {
                   setShowCompleteForm(false);
                   resetCompleteForm();
                 }}
                 className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
               >
                 Batal
               </button>
               <button
                 type="submit"
                 className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
               >
                 Selesaikan
               </button>
             </div>
           </form>
         </div>
       </div>
     )}
   </div>
 );
}
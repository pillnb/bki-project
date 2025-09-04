"use client";

import React from "react";
import { CheckCircle, Clock, FileText, XCircle } from "lucide-react";
import { StatusSuratTugas } from "./types";

export default function ProgressTracker({
  status,
  createdAt,
}: {
  status: StatusSuratTugas;
  createdAt?: string;
}) {
  const steps = [
    { key: "DIAJUKAN", label: "Diajukan", icon: FileText },
    { key: "PROSES_APPROVAL", label: "Proses Approval", icon: Clock },
    { key: "DISETUJUI_BERJALAN", label: "Disetujui & Berjalan", icon: Clock },
    { key: "SELESAI", label: "Selesai", icon: CheckCircle },
  ];

  const getStepIndex = (s: StatusSuratTugas) => {
    switch (s) {
      case "DRAFT":
      case "MENUNGGU_LEAD":
        return 0;
      case "MENUNGGU_KOORDINATOR":
      case "MENUNGGU_SM":
      case "MENUNGGU_KACAB":
        return 1;
      case "DISETUJUI":
      case "BERJALAN":
        return 2;
      case "SELESAI":
        return 3;
      case "DITOLAK":
        return -1;
      default:
        return 0;
    }
  };

  const currentStepIndex = getStepIndex(status);

  let diajukanTanggal = "";
  let diajukanJam = "";
  if (createdAt) {
    const t = new Date(createdAt);
    const wita = new Date(
      t.getTime() + t.getTimezoneOffset() * 60000 + 8 * 3600000
    );
    const pad = (n: number) => n.toString().padStart(2, "0");
    diajukanTanggal = `Diajukan pada ${pad(wita.getDate())}.${pad(
      wita.getMonth() + 1
    )}.${wita.getFullYear().toString().slice(2)}`;
    diajukanJam = `pukul ${pad(wita.getHours())}.${pad(
      wita.getMinutes()
    )} WITA`;
  }

  if (status === "DITOLAK") {
    return (
      <div className="flex items-center justify-center p-4 bg-red-50 border border-red-200 rounded-lg">
        <XCircle className="text-red-500 mr-3" size={24} />
        <div className="text-red-700">
          <span className="font-bold">Permohonan Ditolak.</span>
          <p className="text-xs">Silakan hubungi atasan untuk info lanjut.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center w-full max-w-2xl mx-auto mb-6">
      {steps.map((step, index) => {
        const isCompleted = index < currentStepIndex;
        const isCurrent = index === currentStepIndex;
        const Icon = step.icon;
        return (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center text-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                  isCompleted
                    ? "bg-green-500"
                    : isCurrent
                    ? "bg-blue-500"
                    : "bg-gray-300"
                }`}
              >
                {isCompleted ? <CheckCircle size={20} /> : <Icon size={20} />}
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  isCompleted || isCurrent ? "text-blue-600" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
              {index === 0 && createdAt && (
                <div className="flex flex-col items-center mt-1">
                  <span className="text-[10px] text-gray-500 leading-tight">
                    {diajukanTanggal}
                  </span>
                  <span className="text-[10px] text-gray-500 leading-tight">
                    {diajukanJam}
                  </span>
                </div>
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 mt-[-20px] ${
                  isCompleted ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
// src/components/superadmin/pegawai-detail/HeaderBar.tsx
"use client";
import Link from "next/link";
import { ArrowLeft, Edit, Save, X } from "lucide-react";

type Props = {
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  saving?: boolean;
};

export function HeaderBar({ isEditing, onEdit, onCancel, onSave, saving }: Props) {
  return (
    <div className="mx-4 mt-4 bg-white/70 backdrop-blur-md border border-blue-100 rounded-xl shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Link href="/superadmin" className="p-2 hover:bg-blue-100 rounded-lg transition">
              <ArrowLeft className="w-5 h-5 text-blue-900" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-blue-900">Detail Pegawai - Superadmin</h1>
              <p className="text-gray-600">Kelola data pegawai</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={onEdit}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition font-bold shadow"
              >
                <Edit className="w-4 h-4" />
                Edit Data
              </button>
            ) : (
              <>
                <button
                  onClick={onCancel}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-bold shadow"
                >
                  <X className="w-4 h-4" />
                  Batal
                </button>
                <button
                  onClick={onSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold shadow disabled:bg-green-400"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
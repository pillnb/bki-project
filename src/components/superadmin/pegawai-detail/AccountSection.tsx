// src/components/superadmin/pegawai-detail/AccountSection.tsx
"use client";
import type { PegawaiDetail } from "./types";
import { Shield } from "lucide-react";

type Props = {
  form: PegawaiDetail;
  isEditing: boolean;
  onField: (name: keyof PegawaiDetail, value: any) => void;
  pwd: { new_password: string; confirm_password: string };
  setPwd: (v: { new_password: string; confirm_password: string }) => void;
  onRoleToggle: (role: string, checked: boolean) => void;
};

export function AccountSection({ form, isEditing, onField, pwd, setPwd, onRoleToggle }: Props) {
  const ROLES = ["pegawai", "admin", "superadmin"] as const;

  return (
    <div className="bg-white rounded-xl shadow p-8 border border-blue-100">
      <h2 className="text-lg font-bold text-blue-900 mb-6 flex items-center gap-2">
        <Shield className="w-5 h-5 text-blue-400" />
        Data Akun
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
          {isEditing ? (
            <input
              type="text"
              value={form.username ?? ""}
              onChange={(e) => onField("username", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
          ) : (
            <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-black">{form.username}</div>
          )}
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
          {isEditing ? (
            <div className="space-y-2">
              {ROLES.map((role) => (
                <label key={role} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={(form.role ?? []).includes(role)}
                    onChange={(e) => onRoleToggle(role, e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-black capitalize">{role}</span>
                </label>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {(form.role ?? []).map((role) => (
                <span key={role} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm capitalize">
                  {role}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Password fields (editing only) */}
        {isEditing && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password Baru (Opsional)</label>
              <input
                type="password"
                value={pwd.new_password}
                onChange={(e) => setPwd({ ...pwd, new_password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                placeholder="Kosongkan jika tidak ingin diubah"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password Baru</label>
              <input
                type="password"
                value={pwd.confirm_password}
                onChange={(e) => setPwd({ ...pwd, confirm_password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                placeholder="Kosongkan jika tidak ingin diubah"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
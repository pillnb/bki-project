// src/components/superadmin/pegawai-detail/SuperadminPegawaiDetailPage.tsx
"use client";

import { usePegawaiDetail } from "./usePegawaiDetail";
import { HeaderBar } from "./HeaderBar";
import { ProfileHeaderCard } from "./ProfileHeaderCard";
import { AccountSection } from "./AccountSection";
import { PersonalSection } from "./PersonalSection";
import { ContactSection } from "./ContactSection";
import { JobSection } from "./JobSection";
import { EducationSection } from "./EducationSection";
import { ExperienceSection } from "./ExperienceSection";
import { QualificationSection } from "./QualificationSection";
import { SystemInfoSection } from "./SystemInfoSection";

export default function SuperadminPegawaiDetailPage({ nup }: { nup: string }) {
  const {
    data,
    form,
    loading,
    error,
    editing,
    saving,
    setEditing,
    cancelEdit,
    save,
    onField,
    onRoleToggle,
    pengalamanAdd,
    pengalamanRemove,
    pengalamanUpdate,
    kualifikasiAdd,
    kualifikasiRemove,
    kualifikasiUpdate,
    pwd,
    setPwd,
    fmtDate,
  } = usePegawaiDetail(nup);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-blue-900 font-bold text-lg">Memuat data pegawai...</div>
      </div>
    );
  }

  if (error || !data || !form) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-red-600 font-bold text-lg mb-4">{error || "Data pegawai tidak ditemukan."}</div>
        <a href="/superadmin" className="px-4 py-2 bg-blue-900 text-white rounded-lg font-bold">
          Kembali ke Dashboard
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <HeaderBar
        isEditing={editing}
        onEdit={() => setEditing(true)}
        onCancel={cancelEdit}
        onSave={save}
        saving={saving}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <ProfileHeaderCard pegawai={data} />

        <AccountSection
          form={form}
          isEditing={editing}
          onField={onField}
          pwd={pwd}
          setPwd={setPwd}
          onRoleToggle={onRoleToggle}
        />

        <PersonalSection form={form} isEditing={editing} onField={onField} fmtDate={fmtDate} />

        <ContactSection form={form} isEditing={editing} onField={onField} />

        <JobSection form={form} isEditing={editing} onField={onField} />

        <EducationSection form={form} isEditing={editing} onField={onField} />

        <ExperienceSection
          form={form}
          isEditing={editing}
          add={pengalamanAdd}
          remove={pengalamanRemove}
          update={pengalamanUpdate}
        />

        <QualificationSection
          form={form}
          isEditing={editing}
          add={kualifikasiAdd}
          remove={kualifikasiRemove}
          update={kualifikasiUpdate}
          fmtDate={fmtDate}
        />

        <SystemInfoSection form={form} isEditing={editing} onField={onField} fmtDate={fmtDate} />
      </div>
    </div>
  );
}
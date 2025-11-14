"use client";
import UploadTandaTangan from "./UploadTandaTangan";

export default function UploadSignatureSection({
  suratId,
  canUpload,
  onUploaded,
}: { suratId: string; canUpload: boolean; onUploaded: () => void }) {
  if (!canUpload) return null;
  return (
    <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
      <h4 className="text-md font-semibold text-amber-800 mb-3">
        Upload Tanda Tangan Lead Inspector
      </h4>
      <UploadTandaTangan suratId={suratId} onUploadSuccess={onUploaded} />
    </div>
  );
}

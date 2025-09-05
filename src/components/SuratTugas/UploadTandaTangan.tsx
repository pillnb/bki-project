"use client";

import React, { useState } from "react";
import { File, Upload } from 'lucide-react';

export default function UploadTandaTangan({
  suratId,
  onUploadSuccess,
}: {
  suratId: string;
  onUploadSuccess: () => void;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type.startsWith("image/")) {
      setSelectedFile(f);
      setUploadMessage(null);
    } else {
      setSelectedFile(null);
      setUploadMessage("Error: File harus berupa gambar (JPG, PNG, dll.)");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setUploadMessage(null);
    try {
      const formData = new FormData();
      formData.append("signature", selectedFile);
      const res = await fetch(`/api/surat-tugas/${suratId}/upload-signature`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Gagal mengupload tanda tangan");
      setUploadMessage("Tanda tangan berhasil diupload!");
      setSelectedFile(null);
      onUploadSuccess();
    } catch {
      setUploadMessage("Error: Gagal mengupload tanda tangan");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="border-t border-gray-200 pt-4 mt-4">
      <h4 className="font-medium text-gray-900 mb-3">
        Upload Tanda Tangan Lead Inspector
      </h4>
      <div className="space-y-3">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {selectedFile && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              File: {selectedFile.name}
            </span>
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              <Upload size={14} />
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        )}
        {uploadMessage && (
          <div
            className={`text-sm p-2 rounded ${
              uploadMessage.startsWith("Error")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {uploadMessage}
          </div>
        )}
      </div>
    </div>
  );
}
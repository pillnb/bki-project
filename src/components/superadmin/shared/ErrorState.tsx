"use client";
export default function ErrorState({
  message = "Terjadi kesalahan",
}: {
  message?: string;
}) {
  return (
    <div className="text-center py-10 text-red-600 text-sm">{message}</div>
  );
}
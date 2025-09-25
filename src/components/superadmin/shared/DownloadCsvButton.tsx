"use client";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function DownloadCsvButton({
  onClick,
}: {
  onClick: () => void | Promise<void>;
}) {
  return (
    <Button variant="outline" className="rounded-xl" onClick={() => onClick()}>
      <Download className="h-4 w-4 mr-2" /> Export CSV
    </Button>
  );
}
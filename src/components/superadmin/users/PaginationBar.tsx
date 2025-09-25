"use client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { PaginationMeta } from "@/components/superadmin/types";

export default function PaginationBar({
  meta,
  onPageChange,
}: {
  meta: PaginationMeta | null;
  onPageChange: (page: number) => void;
}) {
  if (!meta) return null;
  const { page, totalPages, total } = meta;
  return (
    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white">
      <div className="text-sm text-slate-500">
        {total} data • halaman {page} / {totalPages}
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(1, page - 1))}
              className="cursor-pointer text-slate-600"
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              className="cursor-pointer text-slate-600"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
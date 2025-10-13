import { SertifikatData } from '@/lib/constants/sertifikatConstants';

export function groupSubmissionsByParentId(submissions: SertifikatData[]): SertifikatData[][] {
  // Filter valid submissions
  const validSubmissions = submissions.filter(s => {
    if (s.status === 'PENDING_APPROVAL' || s.status === 'REJECTED') {
      return true;
    }
    return s.status === 'APPROVED' && !!s.nomorSertifikat;
  });

  // Group by parentId atau id jika single
  const map = new Map<number, SertifikatData[]>();

  for (const s of validSubmissions) {
    const groupKey = s.parentId || s.id;
    if (!map.has(groupKey)) {
      map.set(groupKey, []);
    }
    map.get(groupKey)!.push(s);
  }

  // Convert dan sort
  return Array.from(map.values())
    .map(items => {
      items.sort((a, b) => {
        const pageA = getPageNumber(a.nomorSertifikat) || 0;
        const pageB = getPageNumber(b.nomorSertifikat) || 0;
        return pageA - pageB;
      });
      return items;
    })
    .sort((a, b) => {
      return new Date(b[0].createdAt).getTime() - new Date(a[0].createdAt).getTime();
    });
}

// Ambil nomor halaman dari pola nomor sertifikat seperti ...-03-06 (page-total)
export function getPageNumber(nomor?: string | null): number | null {
  if (!nomor) return null;
  const m = nomor.match(/-(\d+)-\d+$/);
  if (!m) return null;
  return Number(m[1]);
}

export function getTotalPages(group: SertifikatData[]): number {
  if (!group || group.length === 0) return 0;
  const first = group[0];
  if (!first.nomorSertifikat) return group.length;
  const m = first.nomorSertifikat.match(/-(\d+)-(\d+)$/);
  if (!m) return group.length;
  return Number(m[2]) || group.length;
}
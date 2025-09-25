// src/app/superadmin/page.tsx
import { Suspense } from "react";
import SuperAdminContent from "./SuperadminClient";

// Loading component
function SuperAdminLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2 text-gray-600">Loading Super Admin...</span>
    </div>
  );
}

export default function SuperadminPage() {
  return (
    <Suspense fallback={<SuperAdminLoading />}>
      <SuperAdminContent />
    </Suspense>
  );
}
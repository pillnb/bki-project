"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" }); // hapus cookie di server
    } catch (e) {
      // boleh diabaikan, kita tetap redirect
    } finally {
      // optional: tetap bersih-bersih storage
      localStorage.clear();
      sessionStorage.clear();
      router.replace("/login"); // atau window.location.href = '/login'
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="group p-2 hover:bg-blue-800 rounded-lg transition-all duration-200 relative"
      title="Logout"
    >
      {/* ...svg & label kamu... */}
      Logout
    </button>
  );
}

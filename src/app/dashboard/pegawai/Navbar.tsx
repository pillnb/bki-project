"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/dashboard/pegawai" },
  { label: "CV Generator", href: "/cv-generator" },
  { label: "Surat Tugas", href: "/surat-tugas" },
  { label: "Training", href: "/training" },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="bg-white shadow-md px-4 py-2 w-full sticky top-0 z-10">
      <div className="max-w-7xl mx-auto">
        <ul className="flex gap-8 justify-center">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`pb-2 border-b-2 transition font-semibold text-base ${
                pathname === item.href
                  ? "border-yellow-400 text-blue-900"
                  : "border-transparent text-gray-700 hover:text-blue-700"
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
        </ul>
      </div>
    </nav>
  );
}

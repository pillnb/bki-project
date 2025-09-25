"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { BarChart3, Users } from "lucide-react";
import { cn } from "@/components/ui/cn";

export default function Sidebar({
  onNavigate,
  collapsed = false,
}: {
  onNavigate?: () => void;
  collapsed?: boolean;
}) {
  const pathname = usePathname();
  const sp = useSearchParams();
  const currentTab: "manage" | "monitor" =
    sp.get("tab") === "monitor" ? "monitor" : "manage";

  function Item({
    href,
    label,
    Icon,
    tab,
  }: {
    href: string;
    label: string;
    Icon: any;
    tab: "manage" | "monitor";
  }) {
    const isActive = pathname === "/superadmin" && currentTab === tab;

    return (
      <Link
        href={href}
        onClick={onNavigate}
        className={cn(
          "w-full flex items-center gap-3 px-2 py-2 rounded-xl border transition-colors",
          isActive
            ? "bg-blue-50 border-blue-200 text-blue-900"
            : "bg-white border-slate-200 hover:bg-slate-50 text-gray-400 hover:text-blue-900"
        )}
        title={label}
      >
        <Icon className="h-5 w-5 shrink-0" />
        <span
          className={cn(
            "whitespace-nowrap transition-all origin-left",
            collapsed
              ? "opacity-0 scale-x-0 w-0"
              : "opacity-100 scale-x-100 w-auto"
          )}
        >
          {label}
        </span>
      </Link>
    );
  }

  return (
    <nav className={cn("space-y-1", collapsed && "items-center flex flex-col")}>
      <Item
        href="/superadmin"
        Icon={Users}
        label="Manage User & Role"
        tab="manage"
      />
      <Item
        href="/superadmin?tab=monitor"
        Icon={BarChart3}
        label="Monitor & Report"
        tab="monitor"
      />
    </nav>
  );
}

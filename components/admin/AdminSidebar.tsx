"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  RiDashboardLine,
  RiCalendarEventLine,
  RiAddCircleLine,
  RiBarChartLine,
  RiLogoutBoxLine,
  RiExternalLinkLine,
} from "react-icons/ri";

const nav = [
  { href: "/admin/dashboard", icon: RiDashboardLine, label: "Dashboard" },
  { href: "/admin/events", icon: RiCalendarEventLine, label: "Events" },
  { href: "/admin/events/add", icon: RiAddCircleLine, label: "Add Event" },
  { href: "/admin/analytics", icon: RiBarChartLine, label: "Analytics" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <aside className="w-56 shrink-0 flex flex-col h-screen bg-dark-2 border-r border-border">
      {/* Brand */}
      <div className="px-4 h-14 flex items-center gap-2.5 border-b border-border shrink-0">
        <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0">
          <Image src="/logo.jpeg" alt="IndriyaX" width={28} height={28} className="object-cover w-full h-full" />
        </div>
        <span className="text-white font-semibold text-sm tracking-tight">
          Indriya<span className="text-primary">X</span>
        </span>
        <span className="ml-auto text-[10px] text-gray-600 font-medium bg-white/5 px-1.5 py-0.5 rounded-md">Admin</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {nav.map(({ href, icon: Icon, label }) => {
          const active =
            pathname === href ||
            (href !== "/admin/dashboard" && href !== "/admin/events/add" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                active
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-gray-500 hover:text-gray-200 hover:bg-white/[0.04]"
              }`}
            >
              <Icon size={16} className={active ? "text-primary" : "text-gray-600 group-hover:text-gray-400"} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-border flex flex-col gap-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-gray-200 hover:bg-white/[0.04] transition-all"
        >
          <RiExternalLinkLine size={16} className="text-gray-600" />
          View Site
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-red-400 hover:bg-red-500/[0.06] transition-all w-full text-left"
        >
          <RiLogoutBoxLine size={16} className="text-gray-600" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

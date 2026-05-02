"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  RiDashboardLine, RiCalendarEventLine, RiAddCircleLine,
  RiBarChartLine, RiLogoutBoxLine, RiEyeLine,
} from "react-icons/ri";

const navItems = [
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
    <aside className="w-60 shrink-0 bg-dark-2 border-r border-border flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg overflow-hidden border border-primary/20 shrink-0">
          <Image src="/logo.jpeg" alt="IndriyaX" width={32} height={32} className="object-cover w-full h-full" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-none">Indriya<span className="text-primary">X</span></p>
          <p className="text-gray-600 text-xs mt-0.5">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-gray-500 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-border flex flex-col gap-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-white hover:bg-white/5 transition-all"
        >
          <RiEyeLine size={16} /> View Site
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all w-full text-left"
        >
          <RiLogoutBoxLine size={16} /> Logout
        </button>
      </div>
    </aside>
  );
}

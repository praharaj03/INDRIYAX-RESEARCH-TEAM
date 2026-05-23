"use client";
import { usePathname, useRouter } from "next/navigation";
import { RiCalendarLine, RiMenuLine, RiLogoutBoxLine } from "react-icons/ri";
import { useState } from "react";

const titles: Record<string, string> = {
  "/admin/dashboard":  "Dashboard",
  "/admin/events":     "Events",
  "/admin/events/add": "Add Event",
  "/admin/news":       "News",
  "/admin/news/add":   "Add Article",
  "/admin/payments":   "Payments",
  "/admin/analytics":  "Analytics",
};

export default function AdminTopbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const title = titles[pathname] ?? "Admin";
  const [loggingOut, setLoggingOut] = useState(false);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });

  async function handleLogout() {
    if (loggingOut) return;
    
    setLoggingOut(true);
    try {
      await fetch("/api/admin/auth/logout", {
        method: "POST",
      });
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      setLoggingOut(false);
    }
  }

  return (
    <header className="h-14 shrink-0 border-b border-border bg-dark-2 px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className="md:hidden text-gray-500 hover:text-white transition-colors p-1 -ml-1"
        >
          <RiMenuLine size={20} />
        </button>
        <span className="text-white text-sm font-semibold">{title}</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
          <RiCalendarLine size={13} />
          <span className="hidden sm:inline">{today}</span>
          <span className="sm:hidden">{new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
        </div>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-1.5 text-gray-500 hover:text-red-400 transition-colors text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          title="Logout"
        >
          <RiLogoutBoxLine size={14} />
          <span className="hidden sm:inline">{loggingOut ? "Logging out..." : "Logout"}</span>
        </button>
      </div>
    </header>
  );
}

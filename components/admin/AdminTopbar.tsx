"use client";
import { usePathname } from "next/navigation";
import { RiCalendarLine } from "react-icons/ri";

const titles: Record<string, { title: string; sub: string }> = {
  "/admin/dashboard": { title: "Dashboard", sub: "Overview" },
  "/admin/events": { title: "Events", sub: "Manage all events" },
  "/admin/events/add": { title: "Add Event", sub: "Create a new event" },
  "/admin/analytics": { title: "Analytics", sub: "Site performance" },
};

export default function AdminTopbar() {
  const pathname = usePathname();
  const page = titles[pathname] ?? { title: "Admin", sub: "IndriyaX" };

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });

  return (
    <header className="h-14 shrink-0 border-b border-border bg-dark-2 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-gray-600 text-xs font-medium">IndriyaX</span>
        <span className="text-gray-700">/</span>
        <span className="text-white text-sm font-semibold">{page.title}</span>
      </div>

      <div className="flex items-center gap-1.5 text-gray-500 text-xs">
        <RiCalendarLine size={13} />
        {today}
      </div>
    </header>
  );
}

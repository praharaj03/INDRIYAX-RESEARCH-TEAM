"use client";
import { usePathname } from "next/navigation";
import { RiShieldUserLine } from "react-icons/ri";

const titles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/events": "Events Manager",
  "/admin/events/add": "Add New Event",
  "/admin/analytics": "Analytics",
};

export default function AdminTopbar() {
  const pathname = usePathname();
  const title = titles[pathname] ?? "Admin";

  return (
    <header className="h-14 border-b border-border bg-dark-2/50 backdrop-blur px-6 flex items-center justify-between shrink-0">
      <h1 className="text-white font-semibold text-base">{title}</h1>
      <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-3 py-1.5 rounded-full">
        <RiShieldUserLine size={13} />
        Administrator
      </div>
    </header>
  );
}

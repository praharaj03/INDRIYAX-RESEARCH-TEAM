import Link from "next/link";
import { RiAddCircleLine, RiCalendarEventLine, RiBarChartLine, RiExternalLinkLine } from "react-icons/ri";

export default function DashboardQuickActions() {
  return (
    <div className="bg-dark-3 border border-border rounded-xl p-4">
      <p className="text-white text-sm font-semibold mb-3">Quick Actions</p>
      <div className="grid grid-cols-2 gap-2">
        <Link
          href="/admin/events/add"
          className="col-span-2 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-dark text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          <RiAddCircleLine size={15} /> Add New Event
        </Link>
        <Link
          href="/admin/events"
          className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-gray-400 text-xs font-medium border border-border hover:border-white/20 hover:text-white transition-colors"
        >
          <RiCalendarEventLine size={13} /> Events
        </Link>
        <Link
          href="/admin/analytics"
          className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-gray-400 text-xs font-medium border border-border hover:border-white/20 hover:text-white transition-colors"
        >
          <RiBarChartLine size={13} /> Analytics
        </Link>
        <Link
          href="/"
          target="_blank"
          className="col-span-2 flex items-center justify-center gap-1.5 py-2 rounded-lg text-gray-500 text-xs border border-border hover:border-white/20 hover:text-white transition-colors"
        >
          <RiExternalLinkLine size={13} /> View Live Site
        </Link>
      </div>
    </div>
  );
}

import { events, news } from "@/lib/data/index";
import Link from "next/link";
import Image from "next/image";
import {
  RiCalendarEventLine, RiHistoryLine, RiNewspaperLine,
  RiAddCircleLine, RiArrowRightLine, RiMapPinLine,
  RiCalendarLine, RiBarChartLine, RiExternalLinkLine,
} from "react-icons/ri";

const upcoming = events.filter((e) => e.type === "upcoming");
const past = events.filter((e) => e.type === "past");
const nextEvent = upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

const stats = [
  { icon: RiCalendarEventLine, label: "Upcoming", value: upcoming.length, color: "text-primary", ring: "bg-primary/10" },
  { icon: RiHistoryLine, label: "Past", value: past.length, color: "text-violet-400", ring: "bg-violet-500/10" },
  { icon: RiNewspaperLine, label: "News", value: news.length, color: "text-emerald-400", ring: "bg-emerald-500/10" },
  { icon: RiCalendarEventLine, label: "Total Events", value: events.length, color: "text-amber-400", ring: "bg-amber-500/10" },
];

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days < 0) return `${Math.abs(days)}d ago`;
  return `in ${days}d`;
}

export default function DashboardPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-white font-bold text-xl tracking-tight">Good to see you 👋</h1>
        <p className="text-gray-500 text-sm mt-0.5">Here's a snapshot of IndriyaX.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(({ icon: Icon, label, value, color, ring }) => (
          <div key={label} className="bg-dark-3 border border-border rounded-xl p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg ${ring} flex items-center justify-center shrink-0`}>
              <Icon size={16} className={color} />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-none">{value}</p>
              <p className="text-gray-500 text-xs mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Recent events */}
        <div className="lg:col-span-2 bg-dark-3 border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <p className="text-white text-sm font-semibold">Recent Events</p>
            <Link href="/admin/events" className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary transition-colors">
              View all <RiArrowRightLine size={11} />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {events.slice(0, 6).map((event) => (
              <div key={event.id} className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors group">
                <div className="w-9 h-9 rounded-lg overflow-hidden border border-border shrink-0">
                  <Image src={event.thumbnail} alt={event.title} width={36} height={36} className="object-cover w-full h-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{event.title}</p>
                  <p className="text-gray-600 text-xs truncate">{event.speaker}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                    event.type === "upcoming"
                      ? "bg-primary/10 text-primary"
                      : "bg-white/5 text-gray-500"
                  }`}>
                    {event.type}
                  </span>
                  <Link
                    href={`/admin/events/${event.id}/edit`}
                    className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-primary transition-all text-xs"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">

          {/* Next event */}
          {nextEvent && (
            <div className="bg-dark-3 border border-border rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-white text-sm font-semibold">Next Event</p>
              </div>
              <div className="p-4">
                <div className="w-full h-24 rounded-lg overflow-hidden mb-3 border border-border">
                  <Image src={nextEvent.thumbnail} alt={nextEvent.title} width={300} height={96} className="object-cover w-full h-full" />
                </div>
                <p className="text-white text-sm font-semibold leading-snug">{nextEvent.title}</p>
                <p className="text-gray-500 text-xs mt-1">{nextEvent.speaker}</p>
                <div className="flex items-center gap-3 mt-2.5">
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <RiCalendarLine size={11} className="text-primary" />
                    {new Date(nextEvent.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <RiMapPinLine size={11} />
                    {nextEvent.venue.split(",")[0]}
                  </span>
                  <span className="ml-auto text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {daysUntil(nextEvent.date)}
                  </span>
                </div>
                <Link
                  href={`/admin/events/${nextEvent.id}/edit`}
                  className="mt-3 flex items-center justify-center gap-1.5 w-full text-xs text-gray-400 hover:text-white border border-border hover:border-white/20 py-2 rounded-lg transition-all"
                >
                  Edit event <RiArrowRightLine size={11} />
                </Link>
              </div>
            </div>
          )}

          {/* Quick actions */}
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

        </div>
      </div>
    </div>
  );
}

import { events, news } from "@/lib/data/index";
import Link from "next/link";
import {
  RiCalendarEventLine, RiHistoryLine, RiNewspaperLine,
  RiGroupLine, RiAddCircleLine, RiArrowRightLine, RiTimeLine,
} from "react-icons/ri";

const upcoming = events.filter((e) => e.type === "upcoming");
const past = events.filter((e) => e.type === "past");

const statCards = [
  { icon: RiCalendarEventLine, label: "Upcoming Events", value: upcoming.length, color: "text-primary", bg: "bg-primary/10 border-primary/20" },
  { icon: RiHistoryLine, label: "Past Events", value: past.length, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
  { icon: RiNewspaperLine, label: "News Articles", value: news.length, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  { icon: RiGroupLine, label: "Total Events", value: events.length, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
];

export default function DashboardPage() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Welcome */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Welcome back 👋</h2>
        <p className="text-gray-500 text-sm mt-1">Here's what's happening with IndriyaX today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className={`bg-dark-3 border rounded-2xl p-5 ${bg}`}>
            <Icon className={`${color} text-xl mb-3`} />
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Events */}
        <div className="lg:col-span-2 bg-dark-3 border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="text-white font-semibold text-sm">All Events</h3>
            <Link href="/admin/events" className="text-primary text-xs hover:underline flex items-center gap-1">
              Manage <RiArrowRightLine size={12} />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {events.slice(0, 5).map((event) => (
              <div key={event.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                <div className={`w-2 h-2 rounded-full shrink-0 ${event.type === "upcoming" ? "bg-primary" : "bg-gray-600"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{event.title}</p>
                  <p className="text-gray-600 text-xs">{event.speaker} · {new Date(event.date).toDateString()}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${
                  event.type === "upcoming"
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "bg-white/5 text-gray-500 border-border"
                }`}>
                  {event.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-4">
          <div className="bg-dark-3 border border-border rounded-2xl p-5">
            <h3 className="text-white font-semibold text-sm mb-4">Quick Actions</h3>
            <div className="flex flex-col gap-2">
              <Link
                href="/admin/events/add"
                className="flex items-center gap-3 bg-primary/10 border border-primary/20 text-primary text-sm font-medium px-4 py-3 rounded-xl hover:bg-primary/20 transition-colors"
              >
                <RiAddCircleLine size={16} /> Add New Event
              </Link>
              <Link
                href="/admin/analytics"
                className="flex items-center gap-3 bg-white/5 border border-border text-gray-400 text-sm font-medium px-4 py-3 rounded-xl hover:text-white hover:bg-white/10 transition-colors"
              >
                <RiGroupLine size={16} /> View Analytics
              </Link>
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-3 bg-white/5 border border-border text-gray-400 text-sm font-medium px-4 py-3 rounded-xl hover:text-white hover:bg-white/10 transition-colors"
              >
                <RiArrowRightLine size={16} /> View Live Site
              </Link>
            </div>
          </div>

          {/* Upcoming soon */}
          <div className="bg-dark-3 border border-border rounded-2xl p-5">
            <h3 className="text-white font-semibold text-sm mb-3">Next Event</h3>
            {upcoming[0] ? (
              <div>
                <p className="text-white text-sm font-medium mb-1">{upcoming[0].title}</p>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <RiTimeLine className="text-primary" size={12} />
                  {new Date(upcoming[0].date).toDateString()}
                </div>
              </div>
            ) : (
              <p className="text-gray-600 text-sm">No upcoming events</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

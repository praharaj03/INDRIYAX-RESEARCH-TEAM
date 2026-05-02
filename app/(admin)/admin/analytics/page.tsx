import { events, news } from "@/lib/data/index";
import { RiBarChartLine, RiCalendarEventLine, RiHistoryLine, RiNewspaperLine, RiGroupLine, RiGlobalLine, RiTimeLine } from "react-icons/ri";

const upcoming = events.filter((e) => e.type === "upcoming");
const past = events.filter((e) => e.type === "past");

const metrics = [
  { icon: RiCalendarEventLine, label: "Upcoming Events", value: upcoming.length, sub: "Active", color: "text-primary", ring: "border-primary/20 bg-primary/5" },
  { icon: RiHistoryLine, label: "Past Events", value: past.length, sub: "Archived", color: "text-purple-400", ring: "border-purple-500/20 bg-purple-500/5" },
  { icon: RiNewspaperLine, label: "News Articles", value: news.length, sub: "Published", color: "text-emerald-400", ring: "border-emerald-500/20 bg-emerald-500/5" },
  { icon: RiGroupLine, label: "Practitioners Trained", value: "1,000+", sub: "All time", color: "text-amber-400", ring: "border-amber-500/20 bg-amber-500/5" },
  { icon: RiGlobalLine, label: "Cities Reached", value: "10+", sub: "Across India", color: "text-pink-400", ring: "border-pink-500/20 bg-pink-500/5" },
  { icon: RiTimeLine, label: "Total Events", value: events.length, sub: "All time", color: "text-sky-400", ring: "border-sky-500/20 bg-sky-500/5" },
];

export default function AnalyticsPage() {
  const upcomingPct = Math.round((upcoming.length / events.length) * 100) || 0;
  const pastPct = 100 - upcomingPct;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Analytics</h2>
        <p className="text-gray-500 text-sm mt-0.5">Site performance and content overview</p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {metrics.map(({ icon: Icon, label, value, sub, color, ring }) => (
          <div key={label} className={`bg-dark-3 border rounded-2xl p-5 ${ring}`}>
            <Icon className={`${color} text-xl mb-3`} />
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5 font-medium">{label}</p>
            <p className="text-xs text-gray-600 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event breakdown */}
        <div className="bg-dark-3 border border-border rounded-2xl p-6">
          <h3 className="text-white font-semibold text-sm mb-5">Event Breakdown</h3>

          <div className="flex flex-col gap-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-400">Upcoming</span>
                <span className="text-primary font-semibold">{upcoming.length} ({upcomingPct}%)</span>
              </div>
              <div className="h-2 bg-dark-4 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${upcomingPct}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-400">Past</span>
                <span className="text-purple-400 font-semibold">{past.length} ({pastPct}%)</span>
              </div>
              <div className="h-2 bg-dark-4 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${pastPct}%` }} />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-border">
            <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-3">Speakers</p>
            <div className="flex flex-col gap-2">
              {events.map((e) => (
                <div key={e.id} className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">{e.speaker}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${
                    e.type === "upcoming" ? "text-primary border-primary/20 bg-primary/5" : "text-gray-500 border-border bg-white/5"
                  }`}>{e.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance placeholder */}
        <div className="bg-dark-3 border border-border rounded-2xl p-6">
          <h3 className="text-white font-semibold text-sm mb-2">Web Performance</h3>
          <p className="text-gray-600 text-xs mb-5">Connect Google Analytics or Vercel Analytics to see real data.</p>

          <div className="flex flex-col gap-4">
            {[
              { label: "Page Views", value: "—", note: "Connect Analytics" },
              { label: "Unique Visitors", value: "—", note: "Connect Analytics" },
              { label: "Avg. Session Duration", value: "—", note: "Connect Analytics" },
              { label: "Bounce Rate", value: "—", note: "Connect Analytics" },
            ].map(({ label, value, note }) => (
              <div key={label} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                <span className="text-gray-400 text-sm">{label}</span>
                <div className="text-right">
                  <span className="text-white font-semibold text-sm">{value}</span>
                  <p className="text-gray-700 text-xs">{note}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 bg-dark-4 border border-border rounded-xl p-4 text-xs text-gray-600">
            💡 Add <code className="text-gray-500">@vercel/analytics</code> or Google Analytics to track real visitor data.
          </div>
        </div>
      </div>
    </div>
  );
}

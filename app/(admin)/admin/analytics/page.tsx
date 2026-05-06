import { events, news } from "@/lib/data/index";
import {
  RiCalendarEventLine, RiHistoryLine, RiNewspaperLine,
  RiGroupLine, RiGlobalLine, RiMicLine, RiBarChartBoxLine,
  RiLineChartLine, RiArrowUpLine,
} from "react-icons/ri";

const upcoming = events.filter((e) => e.type === "upcoming");
const past = events.filter((e) => e.type === "past");

const metrics = [
  { icon: RiCalendarEventLine, label: "Upcoming", value: upcoming.length, color: "text-primary", bg: "bg-primary/10" },
  { icon: RiHistoryLine, label: "Past Events", value: past.length, color: "text-violet-400", bg: "bg-violet-500/10" },
  { icon: RiNewspaperLine, label: "News", value: news.length, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { icon: RiGroupLine, label: "Trained", value: "1,000+", color: "text-amber-400", bg: "bg-amber-500/10" },
  { icon: RiGlobalLine, label: "Cities", value: "10+", color: "text-pink-400", bg: "bg-pink-500/10" },
  { icon: RiMicLine, label: "Speakers", value: events.length, color: "text-sky-400", bg: "bg-sky-500/10" },
];

function initials(name: string) {
  return name === "Multiple Speakers"
    ? "MS"
    : name.replace("Dr. ", "").split(" ").map((w) => w[0]).slice(0, 2).join("");
}

const speakerColors = [
  "bg-primary/20 text-primary",
  "bg-violet-500/20 text-violet-400",
  "bg-emerald-500/20 text-emerald-400",
  "bg-amber-500/20 text-amber-400",
  "bg-pink-500/20 text-pink-400",
  "bg-sky-500/20 text-sky-400",
];

export default function AnalyticsPage() {
  const total = events.length;
  const upcomingPct = Math.round((upcoming.length / total) * 100) || 0;
  const pastPct = 100 - upcomingPct;

  // SVG donut
  const r = 54;
  const circ = 2 * Math.PI * r;
  const upcomingDash = (upcomingPct / 100) * circ;
  const pastDash = (pastPct / 100) * circ;

  return (
    <div className="max-w-5xl mx-auto space-y-5">

      {/* Header */}
      <div>
        <h1 className="text-white font-bold text-xl tracking-tight">Analytics</h1>
        <p className="text-gray-500 text-sm mt-0.5">Content overview and site performance</p>
      </div>

      {/* Metric strip */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {metrics.map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="bg-dark-3 border border-border rounded-xl p-3.5 flex flex-col gap-2">
            <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center`}>
              <Icon size={14} className={color} />
            </div>
            <p className="text-white font-bold text-lg leading-none">{value}</p>
            <p className="text-gray-500 text-xs">{label}</p>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Event breakdown — donut */}
        <div className="lg:col-span-2 bg-dark-3 border border-border rounded-xl p-5">
          <p className="text-white font-semibold text-sm mb-5">Event Breakdown</p>

          {/* Donut */}
          <div className="flex items-center justify-center mb-5">
            <div className="relative">
              <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
                <circle cx="70" cy="70" r={r} fill="none" stroke="#1C2128" strokeWidth="14" />
                {/* Past */}
                <circle
                  cx="70" cy="70" r={r} fill="none"
                  stroke="#a78bfa"
                  strokeWidth="14"
                  strokeDasharray={`${pastDash} ${circ}`}
                  strokeDashoffset={-upcomingDash}
                  strokeLinecap="round"
                />
                {/* Upcoming */}
                <circle
                  cx="70" cy="70" r={r} fill="none"
                  stroke="#00D4FF"
                  strokeWidth="14"
                  strokeDasharray={`${upcomingDash} ${circ}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-white font-bold text-2xl leading-none">{total}</p>
                <p className="text-gray-500 text-xs mt-1">events</p>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0" />
                <span className="text-gray-400 text-sm">Upcoming</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold text-sm">{upcoming.length}</span>
                <span className="text-xs text-gray-600 w-9 text-right">{upcomingPct}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-400 shrink-0" />
                <span className="text-gray-400 text-sm">Past</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold text-sm">{past.length}</span>
                <span className="text-xs text-gray-600 w-9 text-right">{pastPct}%</span>
              </div>
            </div>
          </div>

          {/* Bar */}
          <div className="mt-4 h-1.5 bg-dark-4 rounded-full overflow-hidden flex">
            <div className="h-full bg-primary rounded-l-full transition-all" style={{ width: `${upcomingPct}%` }} />
            <div className="h-full bg-violet-400 rounded-r-full transition-all" style={{ width: `${pastPct}%` }} />
          </div>
        </div>

        {/* Speakers */}
        <div className="lg:col-span-3 bg-dark-3 border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
            <p className="text-white font-semibold text-sm">Speakers</p>
            <span className="text-xs text-gray-600">{events.length} total</span>
          </div>
          <div className="overflow-y-auto max-h-72 divide-y divide-border">
            {events.map((e, i) => (
              <div key={e.id} className="flex items-center gap-3 px-5 py-2.5 hover:bg-white/[0.02] transition-colors">
                <div className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${speakerColors[i % speakerColors.length]}`}>
                  {initials(e.speaker)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-300 text-sm truncate">{e.speaker}</p>
                  <p className="text-gray-600 text-xs truncate">{e.title}</p>
                </div>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium shrink-0 ${
                  e.type === "upcoming" ? "bg-primary/10 text-primary" : "bg-white/5 text-gray-500"
                }`}>
                  {e.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Web performance */}
      <div className="bg-dark-3 border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RiLineChartLine size={15} className="text-gray-500" />
            <p className="text-white font-semibold text-sm">Web Performance</p>
          </div>
          <span className="text-xs text-gray-600 bg-dark-4 border border-border px-2.5 py-1 rounded-lg">Not connected</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-border">
          {[
            { label: "Page Views", icon: RiBarChartBoxLine },
            { label: "Unique Visitors", icon: RiGroupLine },
            { label: "Avg. Session", icon: RiLineChartLine },
            { label: "Bounce Rate", icon: RiArrowUpLine },
          ].map(({ label, icon: Icon }) => (
            <div key={label} className="p-5 flex flex-col gap-2">
              <Icon size={14} className="text-gray-600" />
              <p className="text-2xl font-bold text-gray-700">—</p>
              <p className="text-gray-500 text-xs">{label}</p>
            </div>
          ))}
        </div>

        <div className="px-5 py-4 border-t border-border bg-dark-4/50 flex items-center justify-between">
          <p className="text-gray-600 text-xs">
            Add <code className="text-gray-500 bg-dark-4 px-1.5 py-0.5 rounded text-[11px]">@vercel/analytics</code> or Google Analytics to unlock real data.
          </p>
          <a
            href="https://vercel.com/docs/analytics"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline shrink-0 ml-4"
          >
            Learn how →
          </a>
        </div>
      </div>

    </div>
  );
}

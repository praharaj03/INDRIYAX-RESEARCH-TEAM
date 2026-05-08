import { events } from "@/lib/data/index";

const upcoming = events.filter((e) => e.type === "upcoming");
const past = events.filter((e) => e.type === "past");
const total = events.length;

export default function AnalyticsBreakdown() {
  const upcomingPct = Math.round((upcoming.length / total) * 100) || 0;
  const pastPct = 100 - upcomingPct;
  const r = 54;
  const circ = 2 * Math.PI * r;
  const upcomingDash = (upcomingPct / 100) * circ;
  const pastDash = (pastPct / 100) * circ;

  return (
    <div className="lg:col-span-2 bg-dark-3 border border-border rounded-xl p-5">
      <p className="text-white font-semibold text-sm mb-5">Event Breakdown</p>

      <div className="flex items-center justify-center mb-5">
        <div className="relative">
          <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
            <circle cx="70" cy="70" r={r} fill="none" stroke="#1C2128" strokeWidth="14" />
            <circle cx="70" cy="70" r={r} fill="none" stroke="#a78bfa" strokeWidth="14"
              strokeDasharray={`${pastDash} ${circ}`} strokeDashoffset={-upcomingDash} strokeLinecap="round" />
            <circle cx="70" cy="70" r={r} fill="none" stroke="#00D4FF" strokeWidth="14"
              strokeDasharray={`${upcomingDash} ${circ}`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-white font-bold text-2xl leading-none">{total}</p>
            <p className="text-gray-500 text-xs mt-1">events</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {[
          { label: "Upcoming", count: upcoming.length, pct: upcomingPct, color: "bg-primary" },
          { label: "Past", count: past.length, pct: pastPct, color: "bg-violet-400" },
        ].map(({ label, count, pct, color }) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${color} shrink-0`} />
              <span className="text-gray-400 text-sm">{label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold text-sm">{count}</span>
              <span className="text-xs text-gray-600 w-9 text-right">{pct}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 h-1.5 bg-dark-4 rounded-full overflow-hidden flex">
        <div className="h-full bg-primary rounded-l-full" style={{ width: `${upcomingPct}%` }} />
        <div className="h-full bg-violet-400 rounded-r-full" style={{ width: `${pastPct}%` }} />
      </div>
    </div>
  );
}

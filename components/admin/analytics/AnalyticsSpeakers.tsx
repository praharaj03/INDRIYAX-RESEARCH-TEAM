import { events } from "@/lib/data/index";

const colors = [
  "bg-primary/20 text-primary",
  "bg-violet-500/20 text-violet-400",
  "bg-emerald-500/20 text-emerald-400",
  "bg-amber-500/20 text-amber-400",
  "bg-pink-500/20 text-pink-400",
  "bg-sky-500/20 text-sky-400",
];

function initials(name: string) {
  return name === "Multiple Speakers"
    ? "MS"
    : name.replace("Dr. ", "").split(" ").map((w) => w[0]).slice(0, 2).join("");
}

export default function AnalyticsSpeakers() {
  return (
    <div className="lg:col-span-3 bg-dark-3 border border-border rounded-xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
        <p className="text-white font-semibold text-sm">Speakers</p>
        <span className="text-xs text-gray-600">{events.length} total</span>
      </div>
      <div className="overflow-y-auto max-h-72 divide-y divide-border">
        {events.map((e, i) => (
          <div key={e.id} className="flex items-center gap-3 px-5 py-2.5 hover:bg-white/[0.02] transition-colors">
            <div className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${colors[i % colors.length]}`}>
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
  );
}

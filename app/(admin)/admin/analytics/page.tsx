import { events, news } from "@/lib/data/index";
import {
  RiCalendarEventLine, RiHistoryLine, RiNewspaperLine,
  RiGroupLine, RiGlobalLine, RiMicLine,
} from "react-icons/ri";
import AnalyticsBreakdown from "@/components/admin/analytics/AnalyticsBreakdown";
import AnalyticsSpeakers from "@/components/admin/analytics/AnalyticsSpeakers";
import AnalyticsPerformance from "@/components/admin/analytics/AnalyticsPerformance";

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

export default function AnalyticsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-5">
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

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <AnalyticsBreakdown />
        <AnalyticsSpeakers />
      </div>

      <AnalyticsPerformance />
    </div>
  );
}

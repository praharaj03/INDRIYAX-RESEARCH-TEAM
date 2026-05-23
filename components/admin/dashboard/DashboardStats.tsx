import { RiCalendarEventLine, RiHistoryLine, RiNewspaperLine } from "react-icons/ri";
import { events, news } from "@/lib/data/index";

const upcoming = events.filter((e) => e.type === "upcoming");
const past = events.filter((e) => e.type === "past");

const stats = [
  { icon: RiCalendarEventLine, label: "Upcoming", value: upcoming.length, color: "text-primary", bg: "bg-primary/10" },
  { icon: RiHistoryLine, label: "Past Events", value: past.length, color: "text-violet-400", bg: "bg-violet-500/10" },
  { icon: RiNewspaperLine, label: "News", value: news.length, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { icon: RiCalendarEventLine, label: "Total Events", value: events.length, color: "text-amber-400", bg: "bg-amber-500/10" },
];

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map(({ icon: Icon, label, value, color, bg }) => (
        <div key={label} className="bg-dark-3 border border-border rounded-xl p-4 flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
            <Icon size={16} className={color} />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-none">{value}</p>
            <p className="text-gray-500 text-xs mt-0.5">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

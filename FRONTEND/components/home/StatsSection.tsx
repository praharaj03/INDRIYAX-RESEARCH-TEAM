import AnimateIn from "@/components/ui/AnimateIn";
import {
  RiCalendarEventLine, RiGroupLine,
  RiMapPin2Line, RiShieldCrossLine,
} from "react-icons/ri";
import { events } from "@/lib/data/index";

const stats = [
  { icon: RiCalendarEventLine, value: `${events.filter((e) => e.type === "upcoming").length}`, label: "Upcoming Events" },
  { icon: RiGroupLine, value: "1,000+", label: "Practitioners Trained" },
  { icon: RiMapPin2Line, value: "10+", label: "Cities Reached" },
  { icon: RiShieldCrossLine, value: `${events.filter((e) => e.type === "past").length}`, label: "Past Events" },
];

export default function StatsSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 pb-16">
      <AnimateIn>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="bg-dark-3 border border-border rounded-2xl p-6 text-center hover:border-primary/30 transition-colors"
            >
              <Icon className="text-primary text-2xl mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </AnimateIn>
    </section>
  );
}

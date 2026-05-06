import Link from "next/link";
import AnimateIn from "@/components/ui/AnimateIn";
import EventCard from "@/components/cards/EventCard";
import { RiArrowRightLine } from "react-icons/ri";
import type { Event } from "@/types/event";

interface Props {
  title: string;
  subtitle: string;
  events: Event[];
  viewAllHref: string;
  accentColor?: "primary" | "muted";
}

export default function EventsPreviewSection({
  title, subtitle, events, viewAllHref, accentColor = "primary",
}: Props) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <AnimateIn>
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${accentColor === "primary" ? "text-primary" : "text-gray-500"}`}>
              {subtitle}
            </p>
            <h2 className="text-3xl font-bold text-white">{title}</h2>
          </div>
          <Link
            href={viewAllHref}
            className="group flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition-colors"
          >
            View all <RiArrowRightLine className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </AnimateIn>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((e, i) => (
          <AnimateIn key={e.id} delay={i * 0.1}>
            <EventCard event={e} />
          </AnimateIn>
        ))}
      </div>
    </section>
  );
}

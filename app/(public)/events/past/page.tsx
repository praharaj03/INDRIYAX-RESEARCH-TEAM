import { events } from "@/lib/data/index";
import EventCard from "@/components/cards/EventCard";
import AnimateIn from "@/components/ui/AnimateIn";
import Link from "next/link";
import { RiHistoryLine, RiArrowRightLine } from "react-icons/ri";

export default function PastEventsPage() {
  const past = events.filter((e) => e.type === "past");

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <AnimateIn>
        <div className="flex items-start justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/5 border border-border text-gray-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              <RiHistoryLine /> Archive
            </div>
            <h1 className="text-4xl font-bold text-white">Past Events</h1>
            <p className="text-gray-500 mt-2">{past.length} events — recordings and summaries available</p>
          </div>
          <Link href="/events" className="hidden md:flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition-colors mt-2">
            View all events <RiArrowRightLine />
          </Link>
        </div>
      </AnimateIn>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {past.map((e, i) => (
          <AnimateIn key={e.id} delay={i * 0.07}>
            <EventCard event={e} />
          </AnimateIn>
        ))}
      </div>
    </div>
  );
}

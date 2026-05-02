"use client";
import { useState } from "react";
import { events } from "@/lib/data/index";
import EventCard from "@/components/cards/EventCard";
import AnimateIn from "@/components/ui/AnimateIn";
import { RiCalendarEventLine, RiHistoryLine, RiLayoutGridLine } from "react-icons/ri";

const tabs = [
  { key: "all", label: "All Events", icon: RiLayoutGridLine },
  { key: "upcoming", label: "Upcoming", icon: RiCalendarEventLine },
  { key: "past", label: "Past", icon: RiHistoryLine },
] as const;

type Tab = typeof tabs[number]["key"];

export default function EventsPage() {
  const [active, setActive] = useState<Tab>("all");

  const filtered = active === "all" ? events : events.filter((e) => e.type === active);
  const upcomingCount = events.filter((e) => e.type === "upcoming").length;
  const pastCount = events.filter((e) => e.type === "past").length;

  const counts: Record<Tab, number> = {
    all: events.length,
    upcoming: upcomingCount,
    past: pastCount,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Header */}
      <AnimateIn>
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <RiCalendarEventLine /> Events
          </div>
          <h1 className="text-4xl font-bold text-white">All Events</h1>
          <p className="text-gray-500 mt-2">
            {upcomingCount} upcoming · {pastCount} past
          </p>
        </div>
      </AnimateIn>

      {/* Tabs */}
      <AnimateIn delay={0.05}>
        <div className="flex gap-2 mb-8 p-1 bg-dark-3 border border-border rounded-xl w-fit">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                active === key
                  ? "bg-primary text-dark shadow-lg shadow-primary/20"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              <Icon size={14} />
              {label}
              <span className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${
                active === key ? "bg-dark/20 text-dark" : "bg-white/5 text-gray-600"
              }`}>
                {counts[key]}
              </span>
            </button>
          ))}
        </div>
      </AnimateIn>

      {/* Grid */}
      {filtered.length === 0 ? (
        <AnimateIn>
          <div className="text-center py-20 text-gray-600 border border-border rounded-2xl">
            No events found.
          </div>
        </AnimateIn>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((e, i) => (
            <AnimateIn key={e.id} delay={i * 0.05}>
              <EventCard event={e} />
            </AnimateIn>
          ))}
        </div>
      )}
    </div>
  );
}

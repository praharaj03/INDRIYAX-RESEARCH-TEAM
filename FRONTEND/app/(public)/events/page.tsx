"use client";
import { useState, useEffect } from "react";
import type { Event } from "@/types/event";
import EventCard from "@/components/cards/EventCard";
import AnimateIn from "@/components/ui/AnimateIn";
import { RiCalendarEventLine, RiHistoryLine, RiLayoutGridLine } from "react-icons/ri";
import { getEvents } from "@/services/eventService";

const tabs = [
  { key: "all", label: "All Events", icon: RiLayoutGridLine },
  { key: "ONLINE", label: "Online", icon: RiCalendarEventLine },
  { key: "OFFLINE", label: "Offline", icon: RiHistoryLine },
] as const;

type Tab = (typeof tabs)[number]["key"];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [active, setActive] = useState<Tab>("all");

  useEffect(() => {
    getEvents().then(setEvents).catch(console.error);
  }, []);

  const filtered = active === "all" ? events : events.filter((e) => e.type === active);

  const counts: Record<Tab, number> = {
    all: events.length,
    ONLINE: events.filter((e) => e.type === "ONLINE").length,
    OFFLINE: events.filter((e) => e.type === "OFFLINE").length,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <AnimateIn>
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <RiCalendarEventLine /> Events
          </div>
          <h1 className="text-4xl font-bold text-white">All Events</h1>
          <p className="text-gray-500 mt-2">{events.length} events</p>
        </div>
      </AnimateIn>

      <AnimateIn delay={0.05}>
        <div className="flex gap-2 mb-8 p-1 bg-dark-3 border border-border rounded-xl w-fit">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setActive(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${active === key ? "bg-primary text-dark shadow-lg shadow-primary/20" : "text-gray-500 hover:text-white"}`}>
              <Icon size={14} />
              {label}
              <span className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${active === key ? "bg-dark/20 text-dark" : "bg-white/5 text-gray-600"}`}>
                {counts[key]}
              </span>
            </button>
          ))}
        </div>
      </AnimateIn>

      {filtered.length === 0 ? (
        <AnimateIn>
          <div className="text-center py-20 text-gray-600 border border-border rounded-2xl">No events found.</div>
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

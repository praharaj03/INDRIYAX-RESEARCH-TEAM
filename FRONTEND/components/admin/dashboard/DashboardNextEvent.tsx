"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { RiCalendarLine, RiMapPinLine, RiArrowRightLine } from "react-icons/ri";
import { getEvents } from "@/services/eventService";
import type { Event } from "@/types/event";

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days < 0) return `${Math.abs(days)}d ago`;
  return `in ${days}d`;
}

export default function DashboardNextEvent() {
  const [nextEvent, setNextEvent] = useState<Event | null>(null);

  useEffect(() => {
    getEvents().then((evs) => {
      const upcoming = evs
        .filter((e) => new Date(e.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setNextEvent(upcoming[0] ?? null);
    }).catch(console.error);
  }, []);

  if (!nextEvent) return null;

  return (
    <div className="bg-dark-3 border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <p className="text-white text-sm font-semibold">Next Event</p>
      </div>
      <div className="p-4">
        <div className="w-full h-24 rounded-lg overflow-hidden mb-3 border border-border">
          <Image src={nextEvent.thumbnail} alt={nextEvent.title} width={300} height={96} className="object-cover w-full h-full" />
        </div>
        <p className="text-white text-sm font-semibold leading-snug">{nextEvent.title}</p>
        <p className="text-gray-500 text-xs mt-1">{nextEvent.speaker}</p>
        <div className="flex items-center gap-3 mt-2.5">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <RiCalendarLine size={11} className="text-primary" />
            {new Date(nextEvent.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <RiMapPinLine size={11} />
            {nextEvent.venue.split(",")[0]}
          </span>
          <span className="ml-auto text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            {daysUntil(nextEvent.date)}
          </span>
        </div>
        <Link href={`/admin/events/${nextEvent.id}/edit`}
          className="mt-3 flex items-center justify-center gap-1.5 w-full text-xs text-gray-400 hover:text-white border border-border hover:border-white/20 py-2 rounded-lg transition-all">
          Edit event <RiArrowRightLine size={11} />
        </Link>
      </div>
    </div>
  );
}

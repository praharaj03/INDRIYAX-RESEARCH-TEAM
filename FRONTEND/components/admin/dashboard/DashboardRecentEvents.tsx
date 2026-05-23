"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { RiArrowRightLine } from "react-icons/ri";
import { getEvents } from "@/services/eventService";
import type { Event } from "@/types/event";

export default function DashboardRecentEvents() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    getEvents().then((evs) => setEvents(evs.slice(0, 6))).catch(console.error);
  }, []);

  return (
    <div className="lg:col-span-2 bg-dark-3 border border-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <p className="text-white text-sm font-semibold">Recent Events</p>
        <Link href="/admin/events" className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary transition-colors">
          View all <RiArrowRightLine size={11} />
        </Link>
      </div>
      <div className="divide-y divide-border">
        {events.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-600 text-xs">No events yet</div>
        ) : events.map((event) => (
          <div key={event.id} className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors group">
            <div className="w-9 h-9 rounded-lg overflow-hidden border border-border shrink-0">
              <Image src={event.thumbnail} alt={event.title} width={36} height={36} className="object-cover w-full h-full" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{event.title}</p>
              <p className="text-gray-600 text-xs truncate">{event.speaker}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-primary/10 text-primary">
                {event.type}
              </span>
              <Link href={`/admin/events/${event.id}/edit`}
                className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-primary transition-all text-xs">
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import {
  RiCalendarLine,
  RiMapPinLine,
  RiMicLine,
  RiArrowRightLine,
} from "react-icons/ri";
import type { Event } from "@/types/event";

export default function EventCard({ event }: { event: Event }) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group block bg-dark-3 rounded-2xl overflow-hidden border border-border card-glow transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={event.thumbnail}
          alt={event.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-3/80 to-transparent" />
        <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full border bg-primary/10 text-primary border-primary/30">
          {event.type}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-white text-base leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">
          {event.title}
        </h3>
        <div className="flex flex-col gap-1.5 mb-4">
          <p className="flex items-center gap-1.5 text-xs text-gray-500">
            <RiCalendarLine className="text-primary/70 shrink-0" />
            {new Date(event.date).toDateString()}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-gray-500">
            <RiMapPinLine className="text-primary/70 shrink-0" />
            {event.venue}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-gray-500">
            <RiMicLine className="text-primary/70 shrink-0" />
            {event.speaker}
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs text-primary font-medium">
          View details{" "}
          <RiArrowRightLine className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

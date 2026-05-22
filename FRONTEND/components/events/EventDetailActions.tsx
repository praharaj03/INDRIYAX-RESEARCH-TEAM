import Link from "next/link";
import { RiPlayCircleLine, RiTimeLine, RiMoneyDollarCircleLine } from "react-icons/ri";
import type { Event } from "@/types/event";

export default function EventDetailActions({ event }: { event: Event }) {
  const isPast = new Date(event.date) < new Date();

  if (isPast) {
    return event.recordingLink ? (
      <a href={event.recordingLink} target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-primary text-dark font-semibold px-6 py-3 rounded-xl hover:bg-primary/80 transition-all shadow-lg shadow-primary/25">
        <RiPlayCircleLine size={18} /> Watch Recording
      </a>
    ) : (
      <div className="inline-flex items-center gap-2 text-gray-600 text-sm border border-border px-4 py-2.5 rounded-xl">
        <RiTimeLine /> Recording coming soon...
      </div>
    );
  }

  return (
    <Link href={`/register?eventId=${event.id}`}
      className="inline-flex items-center gap-2 bg-primary text-dark font-semibold px-6 py-3 rounded-xl hover:bg-primary/80 transition-all shadow-lg shadow-primary/25">
      {event.price > 0 ? <><RiMoneyDollarCircleLine size={18} /> Register — ₹{event.price}</> : "Register for this Event"}
    </Link>
  );
}

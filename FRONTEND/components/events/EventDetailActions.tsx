import Link from "next/link";
import { RiPlayCircleLine, RiTimeLine } from "react-icons/ri";
import type { Event } from "@/types/event";

export default function EventDetailActions({ event }: { event: Event }) {
  if (event.type === "past") {
    return event.recordingLink ? (
      <a
        href={event.recordingLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-primary text-dark font-semibold px-6 py-3 rounded-xl hover:bg-primary/80 transition-all shadow-lg shadow-primary/25"
      >
        <RiPlayCircleLine size={18} /> Watch Recording
      </a>
    ) : (
      <div className="inline-flex items-center gap-2 text-gray-600 text-sm border border-border px-4 py-2.5 rounded-xl">
        <RiTimeLine /> Recording coming soon...
      </div>
    );
  }

  return (
    <Link
      href="/register"
      className="inline-flex items-center gap-2 bg-primary text-dark font-semibold px-6 py-3 rounded-xl hover:bg-primary/80 transition-all shadow-lg shadow-primary/25"
    >
      Register for this Event
    </Link>
  );
}

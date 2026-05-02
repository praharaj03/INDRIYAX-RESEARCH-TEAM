import { events } from "@/lib/data/index";
import Link from "next/link";
import Image from "next/image";
import { RiAddCircleLine, RiExternalLinkLine, RiCalendarLine, RiMapPinLine } from "react-icons/ri";

export default function AdminEventsPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Events Manager</h2>
          <p className="text-gray-500 text-sm mt-0.5">{events.length} total events</p>
        </div>
        <Link
          href="/admin/events/add"
          className="flex items-center gap-2 bg-primary text-dark text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-primary/80 transition-all shadow-lg shadow-primary/20"
        >
          <RiAddCircleLine size={16} /> Add Event
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {["All", "Upcoming", "Past"].map((tab) => (
          <button
            key={tab}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
              tab === "All"
                ? "bg-primary/10 text-primary border-primary/20"
                : "bg-dark-3 text-gray-500 border-border hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Events table */}
      <div className="bg-dark-3 border border-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-5 py-3 border-b border-border text-xs text-gray-600 font-semibold uppercase tracking-wider">
          <span>Thumbnail</span>
          <span>Event</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        <div className="divide-y divide-border">
          {events.map((event) => (
            <div key={event.id} className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-5 py-4 items-center hover:bg-white/[0.02] transition-colors">
              {/* Thumbnail */}
              <div className="w-14 h-10 rounded-lg overflow-hidden border border-border shrink-0">
                <Image src={event.thumbnail} alt={event.title} width={56} height={40} className="object-cover w-full h-full" />
              </div>

              {/* Info */}
              <div className="min-w-0">
                <p className="text-white text-sm font-medium truncate">{event.title}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="flex items-center gap-1 text-xs text-gray-600">
                    <RiCalendarLine size={11} /> {new Date(event.date).toDateString()}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-600">
                    <RiMapPinLine size={11} /> {event.venue}
                  </span>
                </div>
              </div>

              {/* Status */}
              <span className={`text-xs px-2.5 py-1 rounded-full border font-medium shrink-0 ${
                event.type === "upcoming"
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-white/5 text-gray-500 border-border"
              }`}>
                {event.type}
              </span>

              {/* Actions */}
              <Link
                href={`/events/${event.slug}`}
                target="_blank"
                className="text-gray-600 hover:text-primary transition-colors shrink-0"
                title="View on site"
              >
                <RiExternalLinkLine size={15} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

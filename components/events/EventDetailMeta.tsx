import { RiCalendarLine, RiMapPinLine, RiMicLine } from "react-icons/ri";
import type { Event } from "@/types/event";

export default function EventDetailMeta({ event }: { event: Event }) {
  const meta = [
    { icon: RiCalendarLine, text: new Date(event.date).toDateString() },
    { icon: RiMapPinLine, text: event.venue },
    { icon: RiMicLine, text: event.speaker },
  ];

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {meta.map(({ icon: Icon, text }) => (
        <div
          key={text}
          className="flex items-center gap-1.5 text-sm text-gray-400 bg-dark-3 border border-border px-3 py-1.5 rounded-lg"
        >
          <Icon className="text-primary shrink-0" /> {text}
        </div>
      ))}
    </div>
  );
}

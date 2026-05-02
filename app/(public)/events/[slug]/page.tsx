import { events } from "@/lib/data/index";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AnimateIn from "@/components/ui/AnimateIn";
import { RiCalendarLine, RiMapPinLine, RiMicLine, RiArrowLeftLine, RiPlayCircleLine, RiTimeLine } from "react-icons/ri";

export function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }));
}

export default function EventDetailPage({ params }: { params: { slug: string } }) {
  const event = events.find((e) => e.slug === params.slug);
  if (!event) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <AnimateIn>
        <Link
          href={event.type === "upcoming" ? "/events/upcoming" : "/events/past"}
          className="inline-flex items-center gap-1.5 text-gray-500 hover:text-primary text-sm mb-8 transition-colors"
        >
          <RiArrowLeftLine /> Back to {event.type === "upcoming" ? "Upcoming" : "Past"} Events
        </Link>
      </AnimateIn>

      <AnimateIn delay={0.05}>
        <div className="relative h-72 w-full rounded-2xl overflow-hidden mb-8 border border-border">
          <Image src={event.thumbnail} alt={event.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent" />
        </div>
      </AnimateIn>

      <AnimateIn delay={0.1}>
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${
          event.type === "upcoming"
            ? "bg-primary/10 text-primary border-primary/30"
            : "bg-white/5 text-gray-400 border-border"
        }`}>
          {event.type === "upcoming" ? "Upcoming Event" : "Past Event"}
        </span>

        <h1 className="text-3xl md:text-4xl font-bold text-white mt-4 mb-4 leading-tight">{event.title}</h1>

        <div className="flex flex-wrap gap-4 mb-6">
          {[
            { icon: RiCalendarLine, text: new Date(event.date).toDateString() },
            { icon: RiMapPinLine, text: event.venue },
            { icon: RiMicLine, text: event.speaker },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-1.5 text-sm text-gray-400 bg-dark-3 border border-border px-3 py-1.5 rounded-lg">
              <Icon className="text-primary shrink-0" /> {text}
            </div>
          ))}
        </div>

        <p className="text-gray-400 leading-relaxed mb-8">{event.description}</p>
      </AnimateIn>

      {event.summary && (
        <AnimateIn delay={0.15}>
          <div className="bg-dark-3 border border-primary/20 rounded-2xl p-6 mb-8">
            <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-2">Event Summary</p>
            <p className="text-gray-400 text-sm leading-relaxed">{event.summary}</p>
          </div>
        </AnimateIn>
      )}

      <AnimateIn delay={0.2}>
        {event.type === "past" ? (
          event.recordingLink ? (
            <a
              href={event.recordingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 bg-primary text-dark font-semibold px-6 py-3 rounded-xl hover:bg-primary/80 transition-all shadow-lg shadow-primary/25"
            >
              <RiPlayCircleLine size={18} /> Watch Recording
            </a>
          ) : (
            <div className="inline-flex items-center gap-2 text-gray-600 text-sm border border-border px-4 py-2.5 rounded-xl">
              <RiTimeLine /> Recording coming soon...
            </div>
          )
        ) : (
          <Link
            href="/register"
            className="group inline-flex items-center gap-2 bg-primary text-dark font-semibold px-6 py-3 rounded-xl hover:bg-primary/80 transition-all shadow-lg shadow-primary/25"
          >
            Register for this Event
          </Link>
        )}
      </AnimateIn>
    </div>
  );
}

export const dynamic = "force-dynamic";
import { getEventBySlug } from "@/services/eventService";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AnimateIn from "@/components/ui/AnimateIn";
import EventDetailMeta from "@/components/events/EventDetailMeta";
import EventDetailActions from "@/components/events/EventDetailActions";
import { RiArrowLeftLine } from "react-icons/ri";

export default async function EventDetailPage({ params }: { params: { slug: string } }) {
  const event = await getEventBySlug(params.slug);
  if (!event) notFound();

  const isPast = new Date(event.date) < new Date();

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <AnimateIn>
        <Link href={isPast ? "/events/past" : "/events/upcoming"}
          className="inline-flex items-center gap-1.5 text-gray-500 hover:text-primary text-sm mb-8 transition-colors">
          <RiArrowLeftLine /> Back to {isPast ? "Past" : "Upcoming"} Events
        </Link>
      </AnimateIn>

      <AnimateIn delay={0.05}>
        <div className="relative h-72 w-full rounded-2xl overflow-hidden mb-8 border border-border">
          <Image src={event.thumbnail} alt={event.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent" />
        </div>
      </AnimateIn>

      <AnimateIn delay={0.1}>
        <div className="flex items-center gap-2 mb-4">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${isPast ? "bg-white/5 text-gray-400 border-border" : "bg-primary/10 text-primary border-primary/30"}`}>
            {isPast ? "Past Event" : "Upcoming Event"}
          </span>
          <span className="text-xs font-semibold px-3 py-1 rounded-full border bg-white/5 text-gray-400 border-border">
            {event.type}
          </span>
          {event.price > 0 && (
            <span className="text-xs font-semibold px-3 py-1 rounded-full border bg-primary/10 text-primary border-primary/30">
              ₹{event.price}
            </span>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4 leading-tight">{event.title}</h1>

        <EventDetailMeta event={event} />

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
        <EventDetailActions event={event} />
      </AnimateIn>
    </div>
  );
}

export const dynamic = "force-dynamic";
import { getEventBySlug } from "@/services/eventService";
import { notFound } from "next/navigation";
import EnrollForm from "./EnrollForm";
import AnimateIn from "@/components/ui/AnimateIn";
import Image from "next/image";
import Link from "next/link";
import { RiArrowLeftLine, RiCalendarLine, RiMapPinLine, RiMicLine } from "react-icons/ri";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return {};
  return { title: `Enroll — ${event.title}` };
}

export default async function EnrollPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const isPast = new Date(event.date) < new Date();
  if (isPast) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <AnimateIn>
        <Link
          href={`/events/${event.slug}`}
          className="inline-flex items-center gap-1.5 text-gray-500 hover:text-primary text-sm mb-8 transition-colors"
        >
          <RiArrowLeftLine /> Back to Event
        </Link>
      </AnimateIn>

      {/* Event summary card */}
      <AnimateIn delay={0.05}>
        <div className="bg-dark-3 border border-border rounded-2xl overflow-hidden mb-8">
          <div className="relative h-40 w-full">
            <Image src={event.thumbnail} alt={event.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-3/90 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4">
              <div className="flex gap-2 mb-1">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                  {event.type}
                </span>
                {event.price > 0 && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                    ₹{event.price}
                  </span>
                )}
              </div>
              <h2 className="text-white font-bold text-lg leading-tight line-clamp-2">{event.title}</h2>
            </div>
          </div>
          <div className="px-4 py-3 flex flex-wrap gap-4 border-t border-border">
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <RiCalendarLine className="text-primary/70" />
              {new Date(event.date).toDateString()}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <RiMapPinLine className="text-primary/70" />
              {event.venue}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <RiMicLine className="text-primary/70" />
              {event.speaker}
            </span>
          </div>
        </div>
      </AnimateIn>

      {/* Enrollment form */}
      <AnimateIn delay={0.1}>
        <EnrollForm event={event} />
      </AnimateIn>
    </div>
  );
}

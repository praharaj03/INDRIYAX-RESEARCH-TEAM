export const dynamic = "force-dynamic";
import { getEvents } from "@/services/eventService";
import { getNews } from "@/services/newsService";
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import EventsPreviewSection from "@/components/home/EventsPreviewSection";
import NewsPreviewSection from "@/components/home/NewsPreviewSection";
import CTASection from "@/components/home/CTASection";

export default async function HomePage() {
  const [events, news] = await Promise.all([getEvents(), getNews()]).catch(() => [[], []]) as [Awaited<ReturnType<typeof getEvents>>, Awaited<ReturnType<typeof getNews>>];

  const upcomingEvents = events.filter((e) => new Date(e.date) >= new Date()).slice(0, 3);
  const pastEvents = events.filter((e) => new Date(e.date) < new Date()).slice(0, 3);
  const latestNews = news.slice(0, 3);

  return (
    <div className="overflow-hidden">
      <HeroSection />
      <StatsSection />

      <EventsPreviewSection
        title="Upcoming Events"
        subtitle="Don't miss out"
        events={upcomingEvents}
        viewAllHref="/events/upcoming"
        accentColor="primary"
      />

      <div className="max-w-6xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <EventsPreviewSection
        title="Past Events"
        subtitle="Archive"
        events={pastEvents}
        viewAllHref="/events/past"
        accentColor="muted"
      />

      <div className="max-w-6xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <NewsPreviewSection items={latestNews} />
      <CTASection />
    </div>
  );
}

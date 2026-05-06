import { events, news } from "@/lib/data/index";
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import EventsPreviewSection from "@/components/home/EventsPreviewSection";
import NewsPreviewSection from "@/components/home/NewsPreviewSection";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  const upcomingEvents = events.filter((e) => e.type === "upcoming").slice(0, 3);
  const pastEvents = events.filter((e) => e.type === "past").slice(0, 3);
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

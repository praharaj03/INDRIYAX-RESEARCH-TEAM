import Link from "next/link";
import { events, news } from "@/lib/data/index";
import EventCard from "@/components/cards/EventCard";
import NewsCard from "@/components/cards/NewsCard";
import AnimateIn from "@/components/ui/AnimateIn";
import { RiCalendarEventLine, RiNewspaperLine, RiArrowRightLine, RiShieldCrossLine, RiGroupLine, RiMapPin2Line } from "react-icons/ri";

const stats = [
  { icon: RiCalendarEventLine, value: `${events.filter(e=>e.type==="upcoming").length}`, label: "Upcoming Events" },
  { icon: RiGroupLine, value: "1,000+", label: "Practitioners Trained" },
  { icon: RiMapPin2Line, value: "10+", label: "Cities Reached" },
  { icon: RiShieldCrossLine, value: `${events.filter(e=>e.type==="past").length}`, label: "Past Events" },
];

export default function HomePage() {
  const upcomingEvents = events.filter((e) => e.type === "upcoming").slice(0, 3);
  const pastEvents = events.filter((e) => e.type === "past").slice(0, 3);
  const latestNews = news.slice(0, 3);

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-24">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <AnimateIn delay={0}>
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-4 py-2 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              Optometry Education Platform
            </div>
          </AnimateIn>

          <AnimateIn delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.05] tracking-tight mb-6">
              Empowering{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary glow-text">
                Eye Care
              </span>{" "}
              Professionals
            </h1>
          </AnimateIn>

          <AnimateIn delay={0.2}>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Join seminars, workshops, and events led by India's leading optometrists. Stay ahead with curated medical news and research.
            </p>
          </AnimateIn>

          <AnimateIn delay={0.3}>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/events"
                className="group flex items-center gap-2 bg-primary text-dark font-semibold px-7 py-3.5 rounded-xl hover:bg-primary/80 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40"
              >
                <RiCalendarEventLine />
                View Events
                <RiArrowRightLine className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-2 border border-border text-gray-300 font-semibold px-7 py-3.5 rounded-xl hover:border-primary/40 hover:text-white hover:bg-white/5 transition-all"
              >
                Register Now
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <AnimateIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="bg-dark-3 border border-border rounded-2xl p-6 text-center hover:border-primary/30 transition-colors">
                <Icon className="text-primary text-2xl mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </AnimateIn>
      </section>

      {/* Upcoming Events */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <AnimateIn>
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-1">Don't miss out</p>
              <h2 className="text-3xl font-bold text-white">Upcoming Events</h2>
            </div>
            <Link href="/events/upcoming" className="group flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition-colors">
              View all <RiArrowRightLine className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </AnimateIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((e, i) => (
            <AnimateIn key={e.id} delay={i * 0.1}>
              <EventCard event={e} />
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Past Events */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <AnimateIn>
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-1">Archive</p>
              <h2 className="text-3xl font-bold text-white">Past Events</h2>
            </div>
            <Link href="/events/past" className="group flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition-colors">
              View all <RiArrowRightLine className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </AnimateIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastEvents.map((e, i) => (
            <AnimateIn key={e.id} delay={i * 0.1}>
              <EventCard event={e} />
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Medical News */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <AnimateIn>
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-1">Stay informed</p>
              <h2 className="text-3xl font-bold text-white">Medical News</h2>
            </div>
            <Link href="/news" className="group flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition-colors">
              View all <RiArrowRightLine className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </AnimateIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestNews.map((n, i) => (
            <AnimateIn key={n.id} delay={i * 0.1}>
              <NewsCard item={n} />
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 py-8 pb-24">
        <AnimateIn>
          <div className="relative rounded-3xl overflow-hidden border border-primary/20 bg-dark-3 p-12 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <RiNewspaperLine className="text-primary text-4xl mx-auto mb-4 animate-float" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Ready to Level Up?</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">Register for our upcoming events and grow your optometry practice with India's best educators.</p>
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 bg-primary text-dark font-semibold px-8 py-3.5 rounded-xl hover:bg-primary/80 transition-all shadow-lg shadow-primary/25"
            >
              Register Now
              <RiArrowRightLine className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </AnimateIn>
      </section>
    </div>
  );
}

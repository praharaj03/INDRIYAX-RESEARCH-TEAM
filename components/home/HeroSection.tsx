import Link from "next/link";
import AnimateIn from "@/components/ui/AnimateIn";
import { RiCalendarEventLine, RiArrowRightLine } from "react-icons/ri";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-24">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
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
            Join seminars, workshops, and events led by India's leading
            optometrists. Stay ahead with curated medical news and research.
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
  );
}

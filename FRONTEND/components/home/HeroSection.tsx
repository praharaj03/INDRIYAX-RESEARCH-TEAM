import Link from "next/link";
import AnimateIn from "@/components/ui/AnimateIn";
import { RiCalendarEventLine, RiArrowRightLine, RiPlayCircleLine, RiShieldCrossLine, RiGroupLine } from "react-icons/ri";

export default function HeroSection() {
  return (
    <section className="relative min-h-[88vh] flex items-center justify-center px-4 py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] md:bg-[size:60px_60px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-primary/[0.06] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-dark to-transparent pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-dark to-transparent pointer-events-none" />

      <div className="relative w-full max-w-4xl mx-auto text-center">
        <AnimateIn delay={0}>
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-3 py-1.5 md:px-4 md:py-2 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            India's Premier Optometry Education Platform
          </div>
        </AnimateIn>

        <AnimateIn delay={0.1}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-extrabold text-white leading-[1.06] tracking-tight mb-5">
            Empowering{" "}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-300 to-secondary glow-text">
                Eye Care
              </span>
              <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
            </span>
            <br className="hidden sm:block" />{" "}Professionals
          </h1>
        </AnimateIn>

        <AnimateIn delay={0.2}>
          <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed px-2">
            Join seminars, workshops, and events led by India's leading optometrists. Stay ahead with curated medical news and research.
          </p>
        </AnimateIn>

        <AnimateIn delay={0.3}>
          <div className="flex gap-3 justify-center flex-wrap mb-10 md:mb-14">
            <Link
              href="/events/upcoming"
              className="group flex items-center gap-2 bg-primary text-dark font-bold px-5 py-3 md:px-7 md:py-3.5 rounded-xl hover:bg-primary/85 transition-all shadow-lg shadow-primary/30 text-sm md:text-base"
            >
              <RiCalendarEventLine size={16} />
              Explore Events
              <RiArrowRightLine size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/events"
              className="group flex items-center gap-2 border border-border text-gray-300 font-semibold px-5 py-3 md:px-7 md:py-3.5 rounded-xl hover:border-primary/40 hover:text-white hover:bg-white/[0.04] transition-all text-sm md:text-base"
            >
              <RiPlayCircleLine size={16} className="text-primary" />
              Browse Events
            </Link>
          </div>
        </AnimateIn>

        <AnimateIn delay={0.45}>
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            {[
              { icon: RiGroupLine,        text: "1,000+ Trained" },
              { icon: RiCalendarEventLine, text: "20+ Events" },
              { icon: RiShieldCrossLine,  text: "10+ Cities" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 bg-dark-3 border border-border px-3 py-1.5 rounded-full text-xs text-gray-400">
                <Icon size={12} className="text-primary" />
                {text}
              </div>
            ))}
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}

import AnimateIn from "@/components/ui/AnimateIn";
import { aboutConfig } from "./about.config";
import {
  RiEyeLine, RiFocusLine, RiBarChartLine, RiShakeHandsLine,
  RiMapPinLine, RiMicroscopeLine, RiGraduationCapLine, RiMapPin2Line,
  RiGroupLine, RiCalendarEventLine, RiHistoryLine,
} from "react-icons/ri";

const credentialIcons = [
  RiGraduationCapLine,
  RiMicroscopeLine,
  RiMapPinLine,
  RiMapPin2Line,
];

const statIcons = [
  RiCalendarEventLine,
  RiGroupLine,
  RiMapPin2Line,
  RiHistoryLine,
];

const cardIcons = [
  RiFocusLine,
  RiEyeLine,
  RiBarChartLine,
  RiShakeHandsLine,
];

const { founder, stats, cards } = aboutConfig;

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">

      <AnimateIn>
        <div className="mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <RiEyeLine size={12} /> About Us
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">About IndriyaX</h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">The team and mission behind India's premier optometry platform</p>
        </div>
      </AnimateIn>

      {/* Founder card */}
      <AnimateIn delay={0.1}>
        <div className="relative bg-dark-3 rounded-2xl border border-border overflow-hidden mb-6 md:mb-8 hover:border-primary/30 transition-colors">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          <div className="p-5 sm:p-6 md:p-8 flex flex-col sm:flex-row gap-6 md:gap-8">
            {/* Avatar */}
            <div className="flex sm:flex-col items-center gap-4 sm:gap-3 shrink-0">
              <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl border-2 border-primary/30 shadow-lg shadow-primary/10 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
                <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary tracking-tight">{founder.initials}</span>
              </div>
              <div className="sm:hidden">
                <h2 className="text-xl font-bold text-white tracking-tight">{founder.name}</h2>
                <p className="text-primary text-sm font-semibold mt-0.5">{founder.role}</p>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="hidden sm:flex items-start justify-between gap-4 flex-wrap mb-1">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">{founder.name}</h2>
                  <p className="text-primary text-sm font-semibold mt-0.5">{founder.role}</p>
                </div>
                <span className="text-xs bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full font-medium shrink-0">
                  {founder.badge}
                </span>
              </div>

              <div className="flex flex-col gap-1.5 mt-3 sm:mt-4 mb-4 sm:mb-5">
                {founder.credentials.map((text, i) => {
                  const Icon = credentialIcons[i] ?? RiMapPinLine;
                  return (
                    <div key={text} className="flex items-start gap-2 text-xs text-gray-500">
                      <Icon size={12} className="text-primary/70 shrink-0 mt-0.5" />
                      {text}
                    </div>
                  );
                })}
              </div>

              {founder.bio.map((para, i) => (
                <p key={i} className={`text-gray-400 text-sm leading-relaxed ${i > 0 ? "mt-3" : ""}`}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      </AnimateIn>

      {/* Stats */}
      <AnimateIn delay={0.18}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 md:mb-8">
          {stats.map(({ value, label }, i) => {
            const Icon = statIcons[i] ?? RiCalendarEventLine;
            return (
              <div key={label} className="bg-dark-3 border border-border rounded-xl p-3 md:p-4 text-center hover:border-primary/30 transition-colors">
                <Icon size={15} className="text-primary mx-auto mb-1.5" />
                <p className="text-lg md:text-xl font-extrabold text-white">{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            );
          })}
        </div>
      </AnimateIn>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        {cards.map(({ title, body }, i) => {
          const Icon = cardIcons[i] ?? RiFocusLine;
          return (
            <AnimateIn key={title} delay={0.22 + i * 0.07}>
              <div className="bg-dark-3 rounded-2xl border border-border p-5 md:p-6 hover:border-primary/30 card-glow transition-all h-full">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon size={14} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-white text-sm">{title}</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{body}</p>
              </div>
            </AnimateIn>
          );
        })}
      </div>
    </div>
  );
}

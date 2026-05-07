import AnimateIn from "@/components/ui/AnimateIn";
import {
  RiEyeLine, RiFocusLine, RiBarChartLine, RiShakeHandsLine,
  RiMapPinLine, RiMicroscopeLine, RiGraduationCapLine,
  RiGroupLine, RiCalendarEventLine, RiMapPin2Line, RiHistoryLine,
} from "react-icons/ri";

const credentials = [
  { icon: RiGraduationCapLine, text: "Vidyasagar College of Optometry & Vision Science" },
  { icon: RiMicroscopeLine,    text: "Research Scholar — Vision Instruments & Software" },
  { icon: RiMapPinLine,        text: "Debapriya Mukhopadhyay Vision Research Institute & Foundation" },
  { icon: RiMapPin2Line,       text: "Greater Kolkata Area" },
];

const stats = [
  { icon: RiCalendarEventLine, value: "20+",    label: "Events Conducted" },
  { icon: RiGroupLine,         value: "1,000+", label: "Practitioners Trained" },
  { icon: RiMapPin2Line,       value: "10+",    label: "Cities Reached" },
  { icon: RiHistoryLine,       value: "664+",   label: "LinkedIn Followers" },
];

const cards = [
  { icon: RiFocusLine,      title: "Our Mission",    body: "To make quality optometry education accessible to every eye care professional in India through events, workshops, and curated medical content." },
  { icon: RiEyeLine,        title: "Our Vision",     body: "A future where every Indian has access to world-class eye care, powered by well-trained, continuously learning optometrists." },
  { icon: RiBarChartLine,   title: "By the Numbers", body: "20+ events conducted · 1,000+ practitioners trained · 10+ cities reached across India." },
  { icon: RiShakeHandsLine, title: "Partnerships",   body: "We collaborate with optometry colleges, hospitals, and industry leaders to deliver the highest quality educational experiences." },
];

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
                <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary tracking-tight">AD</span>
              </div>
              <div className="sm:hidden">
                <h2 className="text-xl font-bold text-white tracking-tight">Anik Dingal</h2>
                <p className="text-primary text-sm font-semibold mt-0.5">Founder, IndriyaX</p>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="hidden sm:flex items-start justify-between gap-4 flex-wrap mb-1">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Anik Dingal</h2>
                  <p className="text-primary text-sm font-semibold mt-0.5">Founder, IndriyaX</p>
                </div>
                <span className="text-xs bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full font-medium shrink-0">
                  Professional Optometrist
                </span>
              </div>

              <div className="flex flex-col gap-1.5 mt-3 sm:mt-4 mb-4 sm:mb-5">
                {credentials.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-2 text-xs text-gray-500">
                    <Icon size={12} className="text-primary/70 shrink-0 mt-0.5" />
                    {text}
                  </div>
                ))}
              </div>

              <p className="text-gray-400 text-sm leading-relaxed">
                Anik Dingal is a dedicated optometrist with a passion for improving vision and eye health. He specialises in comprehensive eye exams, diagnosing and treating a wide range of vision conditions, and fitting contact lenses and glasses tailored to individual needs. His commitment to patient care extends beyond the clinic — he actively engages in community outreach programs to promote eye health education.
              </p>
              <p className="text-gray-400 text-sm leading-relaxed mt-3">
                Graduating with honours from Vidyasagar College of Optometry and Vision Science, Anik continues to stay updated with the latest advancements in optometry. As an Innovation Lead at the Debapriya Mukhopadhyay Vision Research Institute & Foundation, he drives research in vision instruments and software — and founded IndriyaX to bridge the gap between optometry education and practice across India.
              </p>
            </div>
          </div>
        </div>
      </AnimateIn>

      {/* Stats */}
      <AnimateIn delay={0.18}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 md:mb-8">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="bg-dark-3 border border-border rounded-xl p-3 md:p-4 text-center hover:border-primary/30 transition-colors">
              <Icon size={15} className="text-primary mx-auto mb-1.5" />
              <p className="text-lg md:text-xl font-extrabold text-white">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </AnimateIn>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        {cards.map(({ icon: Icon, title, body }, i) => (
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
        ))}
      </div>
    </div>
  );
}

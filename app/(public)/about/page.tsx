import AnimateIn from "@/components/ui/AnimateIn";
import {
  RiEyeLine,
  RiFocusLine,
  RiBarChartLine,
  RiShakeHandsLine,
} from "react-icons/ri";

const cards = [
  {
    icon: RiFocusLine,
    title: "Our Mission",
    body: "To make quality optometry education accessible to every eye care professional in India through events, workshops, and curated medical content.",
  },
  {
    icon: RiEyeLine,
    title: "Our Vision",
    body: "A future where every Indian has access to world-class eye care, powered by well-trained, continuously learning optometrists.",
  },
  {
    icon: RiBarChartLine,
    title: "By the Numbers",
    body: "20+ events conducted · 1,000+ practitioners trained · 10+ cities reached across India.",
  },
  {
    icon: RiShakeHandsLine,
    title: "Partnerships",
    body: "We collaborate with optometry colleges, hospitals, and industry leaders to deliver the highest quality educational experiences.",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <AnimateIn>
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <RiEyeLine /> About Us
          </div>
          <h1 className="text-4xl font-bold text-white">About IndriyaX</h1>
          <p className="text-gray-500 mt-2">
            Our mission and the team behind it
          </p>
        </div>
      </AnimateIn>

      {/* Doctor card */}
      <AnimateIn delay={0.1}>
        <div className="bg-dark-3 rounded-2xl border border-border p-8 mb-8 flex flex-col md:flex-row gap-8 items-center hover:border-primary/30 transition-colors">
          <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20 flex items-center justify-center text-primary text-4xl font-bold shrink-0 animate-glow">
            Dr
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-1">
              Dr. [Founder Name]
            </h2>
            <p className="text-primary text-sm font-medium mb-3">
              Founder & Lead Optometrist
            </p>
            <p className="text-gray-500 text-sm leading-relaxed">
              With over 15 years of clinical experience, Dr. [Name] founded
              IndriyaX to bridge the gap between optometry education and
              practice. A passionate advocate for preventive eye care, they have
              trained hundreds of practitioners across India.
            </p>
          </div>
        </div>
      </AnimateIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {cards.map(({ icon: Icon, title, body }, i) => (
          <AnimateIn key={title} delay={0.1 + i * 0.08}>
            <div className="bg-dark-3 rounded-2xl border border-border p-6 hover:border-primary/30 card-glow transition-all">
              <div className="flex items-center gap-2 mb-3">
                <Icon className="text-primary text-lg" />
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

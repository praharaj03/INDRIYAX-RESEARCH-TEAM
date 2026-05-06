import Link from "next/link";
import AnimateIn from "@/components/ui/AnimateIn";
import { RiNewspaperLine, RiArrowRightLine } from "react-icons/ri";

export default function CTASection() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-8 pb-24">
      <AnimateIn>
        <div className="relative rounded-3xl overflow-hidden border border-primary/20 bg-dark-3 p-12 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <RiNewspaperLine className="text-primary text-4xl mx-auto mb-4 animate-float" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Ready to Level Up?</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Register for our upcoming events and grow your optometry practice with India's best educators.
          </p>
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
  );
}

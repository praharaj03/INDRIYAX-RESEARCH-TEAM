import Link from "next/link";
import AnimateIn from "@/components/ui/AnimateIn";
import {
  RiCheckLine, RiCloseLine, RiShieldLine,
  RiFlashlightLine, RiVipCrownLine, RiArrowRightLine,
} from "react-icons/ri";

async function getPricing(): Promise<{ pro_monthly: number; elite_annual: number }> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/admin/payments/pricing`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error();
    return res.json();
  } catch {
    return { pro_monthly: 199, elite_annual: 1499 };
  }
}

export default async function SubscribePage() {
  const pricing = await getPricing();

  const plans = [
    {
      id: "free",
      icon: RiShieldLine,
      name: "Free",
      price: null,
      period: null,
      savings: null,
      tagline: "Get started with IndriyaX",
      color: "border-border",
      badge: null,
      cta: "Get Started",
      ctaHref: "/signup",
      ctaStyle: "border border-border text-gray-300 hover:border-white/30 hover:text-white",
      features: [
        { text: "Browse all upcoming events", included: true },
        { text: "View event details & speakers", included: true },
        { text: "Access medical news feed", included: true },
        { text: "Register for free events", included: true },
        { text: "Access past event recordings", included: false },
        { text: "Restricted event full details", included: false },
        { text: "Downloadable resources", included: false },
        { text: "Priority registration", included: false },
        { text: "Certificate of participation", included: false },
      ],
    },
    {
      id: "pro",
      icon: RiFlashlightLine,
      name: "Pro",
      price: `₹${pricing.pro_monthly.toLocaleString("en-IN")}`,
      period: "/ month",
      savings: null,
      tagline: "For active optometry professionals",
      color: "border-primary/40",
      badge: "Most Popular",
      cta: "Start Pro",
      ctaHref: "/signup?plan=pro",
      ctaStyle: "bg-primary text-dark font-bold hover:bg-primary/90 shadow-lg shadow-primary/25",
      features: [
        { text: "Everything in Free", included: true },
        { text: "Access past event recordings", included: true },
        { text: "Restricted event full details", included: true },
        { text: "Downloadable resources", included: true },
        { text: "Priority registration", included: true },
        { text: "Certificate of participation", included: true },
        { text: "Exclusive webinars", included: false },
        { text: "1-on-1 mentorship sessions", included: false },
        { text: "Annual conference VIP access", included: false },
      ],
    },
    {
      id: "elite",
      icon: RiVipCrownLine,
      name: "Elite",
      price: `₹${pricing.elite_annual.toLocaleString("en-IN")}`,
      period: "/ year",
      savings: `Save ₹${((pricing.pro_monthly * 12) - pricing.elite_annual).toLocaleString("en-IN")} vs monthly`,
      tagline: "Full access, best value",
      color: "border-amber-500/30",
      badge: "Best Value",
      cta: "Go Elite",
      ctaHref: "/signup?plan=elite",
      ctaStyle: "bg-amber-500 text-dark font-bold hover:bg-amber-400 shadow-lg shadow-amber-500/20",
      features: [
        { text: "Everything in Pro", included: true },
        { text: "Exclusive webinars", included: true },
        { text: "1-on-1 mentorship sessions", included: true },
        { text: "Annual conference VIP access", included: true },
        { text: "Early access to new events", included: true },
        { text: "IndriyaX branded kit", included: true },
        { text: "Direct speaker Q&A access", included: true },
        { text: "Lifetime event archive access", included: true },
        { text: "Dedicated support", included: true },
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Header */}
      <AnimateIn>
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-4 py-2 rounded-full mb-4 md:mb-5">
            <RiVipCrownLine size={13} /> Subscription Plans
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3 md:mb-4">
            Invest in your practice
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto">
            Choose the plan that fits your learning goals. Upgrade or cancel anytime.
          </p>
        </div>
      </AnimateIn>

      {/* Plans grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-12 md:mb-16">
        {plans.map((plan, i) => {
          const Icon = plan.icon;
          return (
            <AnimateIn key={plan.id} delay={i * 0.08}>
              <div className={`relative bg-dark-3 border ${plan.color} rounded-2xl p-6 flex flex-col h-full ${plan.id === "pro" ? "ring-1 ring-primary/20" : ""}`}>
                {plan.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] font-bold px-3 py-1 rounded-full ${
                    plan.id === "pro" ? "bg-primary text-dark" : "bg-amber-500 text-dark"
                  }`}>
                    {plan.badge}
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    plan.id === "free" ? "bg-white/5" :
                    plan.id === "pro" ? "bg-primary/15" : "bg-amber-500/15"
                  }`}>
                    <Icon size={17} className={
                      plan.id === "free" ? "text-gray-400" :
                      plan.id === "pro" ? "text-primary" : "text-amber-400"
                    } />
                  </div>
                  <div>
                    <p className="text-white font-bold text-base">{plan.name}</p>
                    <p className="text-gray-500 text-xs">{plan.tagline}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-extrabold text-white">{plan.price ?? "Free"}</span>
                    <span className="text-gray-500 text-sm mb-1">{plan.period ?? "forever"}</span>
                  </div>
                  {plan.savings && (
                    <p className="text-emerald-400 text-xs mt-1 font-medium">{plan.savings}</p>
                  )}
                </div>

                <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f.text} className="flex items-start gap-2.5">
                      {f.included ? (
                        <RiCheckLine size={15} className={`shrink-0 mt-0.5 ${
                          plan.id === "pro" ? "text-primary" : plan.id === "elite" ? "text-amber-400" : "text-emerald-400"
                        }`} />
                      ) : (
                        <RiCloseLine size={15} className="text-gray-700 shrink-0 mt-0.5" />
                      )}
                      <span className={`text-sm ${f.included ? "text-gray-300" : "text-gray-600"}`}>
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.ctaHref}
                  className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm transition-all ${plan.ctaStyle}`}
                >
                  {plan.cta} <RiArrowRightLine size={14} />
                </Link>
              </div>
            </AnimateIn>
          );
        })}
      </div>

      {/* FAQ */}
      <AnimateIn>
        <div className="bg-dark-3 border border-border rounded-2xl p-5 md:p-8">
          <h2 className="text-white font-bold text-base md:text-lg mb-5 md:mb-6 text-center">Common Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {[
              { q: "Can I cancel anytime?", a: "Yes. Cancel your subscription at any time. You'll retain access until the end of your billing period." },
              { q: "What payment methods are accepted?", a: "We accept UPI, credit/debit cards, and net banking via Razorpay. All transactions are secure." },
              { q: "What are restricted events?", a: "Some advanced workshops and masterclasses are marked as restricted — only Pro and Elite subscribers can view full details and recordings." },
              { q: "Is there a student discount?", a: "Yes! Optometry students with a valid college ID get 50% off the Pro plan. Contact us at contact@indriyax.com." },
            ].map(({ q, a }) => (
              <div key={q}>
                <p className="text-white text-sm font-semibold mb-1">{q}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimateIn>
    </div>
  );
}

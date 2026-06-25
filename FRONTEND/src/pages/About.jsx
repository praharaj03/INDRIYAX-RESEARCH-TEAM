import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight, GraduationCap, Microscope, MapPin, MapPinned, CalendarDays, Users, Globe, ExternalLink, Star, BookOpen, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

/* ─── Slit-lamp layer divider ─── */
function SlitLine({ label, index }) {
  return (
    <div className="flex items-center gap-5 py-6">
      <span
        className="text-[9px] font-black tracking-[0.18em] uppercase flex-shrink-0"
        style={{ color: 'rgba(12,110,114,0.5)' }}
      >
        Layer {String(index).padStart(2, '0')}
      </span>
      <div className="flex-1 h-[1px] bg-indriya-border dark:bg-indriya-darkBorder" />
      <span className="text-[9px] font-black tracking-[0.18em] uppercase text-indriya-muted dark:text-indriya-darkMuted flex-shrink-0">
        {label}
      </span>
    </div>
  );
}

/* ─── Corneal cross-section: vertical slice illustration ─── */
function CorneaCrossSection({ className = '' }) {
  return (
    <svg
      viewBox="0 0 200 400"
      className={`opacity-[0.07] dark:opacity-[0.06] pointer-events-none ${className}`}
      fill="none"
    >
      {/* Corneal layers — horizontal bands */}
      {[40, 80, 120, 160, 200, 240, 280, 320, 360].map((y, i) => (
        <ellipse
          key={y}
          cx="100"
          cy={y}
          rx={30 + i * 8}
          ry="6"
          stroke="#0C6E72"
          strokeWidth="1.2"
        />
      ))}
      {/* Center axis */}
      <line x1="100" y1="0" x2="100" y2="400" stroke="#0C6E72" strokeWidth="0.8" strokeDasharray="4 4" />
      {/* Measurement ticks */}
      {[80, 160, 240, 320].map(y => (
        <g key={y}>
          <line x1="88" y1={y} x2="112" y2={y} stroke="#0C6E72" strokeWidth="0.8" />
          <circle cx="100" cy={y} r="2" fill="#0C6E72" />
        </g>
      ))}
    </svg>
  );
}

/* ─── Timeline event ─── */
function TimelineEvent({ year, title, desc, last }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="flex gap-6 relative"
    >
      {/* Line + dot */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className="w-3 h-3 rounded-full border-2 flex-shrink-0 mt-1"
          style={{ borderColor: '#0C6E72', backgroundColor: 'rgba(12,110,114,0.15)' }}
        />
        {!last && (
          <div
            className="w-[1px] flex-1 mt-1"
            style={{ backgroundColor: 'rgba(12,110,114,0.18)' }}
          />
        )}
      </div>
      <div className="pb-10">
        <span
          className="inline-block text-[10px] font-black tracking-[0.12em] mb-2"
          style={{ color: '#0C6E72' }}
        >
          {year}
        </span>
        <h4
          className="text-[15px] font-bold text-indriya-text dark:text-indriya-darkText mb-1 leading-snug"
        >
          {title}
        </h4>
        <p className="text-[13px] text-indriya-muted dark:text-indriya-darkMuted leading-[1.7]">
          {desc}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Stat cell ─── */
function StatCell({ icon: Icon, value, label, sub }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group p-7 lg:p-9 bg-indriya-card dark:bg-indriya-darkCard hover:bg-[rgba(12,110,114,0.03)] dark:hover:bg-[rgba(12,110,114,0.06)] transition-colors duration-300 flex flex-col gap-3"
    >
      <div
        className="w-10 h-10 rounded-[12px] flex items-center justify-center"
        style={{ backgroundColor: 'rgba(12,110,114,0.08)' }}
      >
        <Icon size={18} style={{ color: '#0C6E72' }} />
      </div>
      <div>
        <p
          className="text-indriya-text dark:text-indriya-darkText tracking-tight leading-none mb-1"
          style={{
            fontFamily: "'DM Serif Display', 'Georgia', serif",
            fontSize: 'clamp(28px, 3vw, 40px)',
            fontWeight: 400,
          }}
        >
          {value}
        </p>
        <p className="text-[13px] font-bold text-indriya-text dark:text-indriya-darkText mb-0.5">{label}</p>
        <p className="text-[11px] text-indriya-muted dark:text-indriya-darkMuted">{sub}</p>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   ABOUT PAGE
══════════════════════════════════════════ */
export default function About() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const timeline = [
    {
      year: '2020',
      title: 'Graduated with Honours',
      desc: 'Completed B.Optom from Vidyasagar College of Optometry & Vision Science with a focus on clinical practice and instrumentation.',
    },
    {
      year: '2021',
      title: 'Research Scholar — Vision Instruments',
      desc: 'Joined Debapriya Mukhopadhyay Vision Research Institute as Innovation Lead, driving research in vision instruments and diagnostic software.',
    },
    {
      year: '2022',
      title: 'First Community Events',
      desc: 'Hosted the first IndriyaX learning events in Kolkata — 3 workshops, 200+ attendees, and the beginning of something larger.',
    },
    {
      year: '2023',
      title: 'IndriyaX Platform Launched',
      desc: 'Launched the IndriyaX digital platform to bring evidence-based optometry education to practitioners across India.',
    },
    {
      year: '2025',
      title: 'India\'s Premier Optometry Community',
      desc: '10K+ members, 20+ events in 10+ cities, 500+ research articles — and still growing every month.',
    },
  ];

  const principles = [
    {
      icon: BookOpen,
      title: 'Evidence First',
      body: 'Every article, discussion, and recommendation on IndriyaX is grounded in peer-reviewed clinical evidence — never opinion dressed as fact.',
    },
    {
      icon: Users,
      title: 'Community Driven',
      body: 'Built by practitioners, for practitioners. Our content is shaped by the real questions optometrists face in Indian clinics every day.',
    },
    {
      icon: Globe,
      title: 'Accessible to All',
      body: 'From tier-1 cities to remote towns — quality optometry education should not be a privilege. IndriyaX is free to join.',
    },
    {
      icon: Zap,
      title: 'Always Current',
      body: 'Vision science moves fast. We publish continuously and cover advancements within days of major journal releases and conference announcements.',
    },
  ];

  return (
    <div
      className="w-full bg-indriya-bg dark:bg-indriya-darkBg transition-colors duration-300 overflow-x-hidden"
      style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
    >

      {/* ════════════════════════════════════
          HERO — slit-lamp metaphor
          Left: big editorial statement
          Right: corneal cross-section SVG + founder card
      ════════════════════════════════════ */}
      <section ref={heroRef} className="relative w-full min-h-[90vh] flex items-center overflow-hidden">

        {/* Cross-section decoration — far right */}
        <CorneaCrossSection className="absolute right-8 top-0 bottom-0 h-full w-[200px]" />

        {/* Topography half-ring — top left */}
        <svg
          viewBox="0 0 600 400"
          className="absolute -left-40 -top-20 w-[600px] opacity-[0.05] dark:opacity-[0.04] pointer-events-none"
          fill="none"
        >
          {[50, 90, 130, 170, 210, 250].map((r, i) => (
            <circle key={r} cx="100" cy="200" r={r} stroke="#0C6E72" strokeWidth="1.5" />
          ))}
        </svg>

        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 lg:px-16 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1px_420px] gap-0 items-start">

            {/* LEFT */}
            <motion.div
              style={{ y: heroY, opacity: heroOpacity }}
              className="pr-0 lg:pr-16 pt-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <span
                  className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.16em] uppercase px-4 py-2 rounded-full border mb-8 block w-fit"
                  style={{
                    color: '#0C6E72',
                    backgroundColor: 'rgba(12,110,114,0.07)',
                    borderColor: 'rgba(12,110,114,0.2)',
                  }}
                >
                  About IndriyaX
                </span>

                <h1
                  className="text-indriya-text dark:text-indriya-darkText leading-[0.98] tracking-[-0.04em] mb-8"
                  style={{
                    fontFamily: "'DM Serif Display', 'Georgia', serif",
                    fontSize: 'clamp(48px, 7vw, 100px)',
                    fontWeight: 400,
                  }}
                >
                  The team<br />
                  <span className="italic" style={{ color: '#0C6E72' }}>& mission</span><br />
                  behind India's<br />
                  eye care platform.
                </h1>

                <p className="text-[17px] leading-[1.85] text-indriya-muted dark:text-indriya-darkMuted max-w-[480px] mb-10">
                  IndriyaX bridges the gap between optometry education and clinical practice —
                  built by a practitioner who lived that gap firsthand.
                </p>

                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: '#0C6E72' }}
                  >
                    AD
                  </div>
                  <span className="text-[13px] text-indriya-muted dark:text-indriya-darkMuted">
                    Founded by <span className="font-semibold text-indriya-text dark:text-indriya-darkText">Anik Dingal</span> · Kolkata, India
                  </span>
                </div>
              </motion.div>
            </motion.div>

            {/* DIVIDER */}
            <div className="hidden lg:block w-[1px] bg-indriya-border dark:bg-indriya-darkBorder self-stretch my-4" />

            {/* RIGHT — founder card */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="pl-0 lg:pl-12 pt-8"
            >
              {/* Photo card */}
              <div
                className="relative rounded-[24px] overflow-hidden mb-5 border border-indriya-border dark:border-indriya-darkBorder"
                style={{ aspectRatio: '4/3' }}
              >
                <img
                  src="/anikDingal.jpeg"
                  alt="Anik Dingal"
                  className="w-full h-full object-cover object-top"
                  onError={e => {
                    e.target.style.display = 'none';
                    e.target.parentElement.style.background = 'linear-gradient(135deg, rgba(12,110,114,0.12), rgba(12,110,114,0.04))';
                  }}
                />
                {/* Overlay gradient */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(to top, rgba(5,12,14,0.6) 0%, transparent 50%)' }}
                />
                {/* OCT ring overlay — decorative */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {[60, 95, 130].map(r => (
                    <div
                      key={r}
                      className="absolute rounded-full border border-white/8"
                      style={{ width: r * 2, height: r * 2 }}
                    />
                  ))}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3
                    className="text-white text-[20px] font-bold tracking-tight mb-0.5"
                    style={{ fontFamily: "'DM Serif Display', serif" }}
                  >
                    Anik Dingal
                  </h3>
                  <p className="text-white/70 text-[12px]">Founder, IndriyaX · Professional Optometrist</p>
                </div>
              </div>

              {/* Credential pills */}
              <div className="flex flex-col gap-2">
                {[
                  { icon: GraduationCap, text: 'Vidyasagar College of Optometry & Vision Science' },
                  { icon: Microscope, text: 'Research Scholar — Vision Instruments & Software' },
                  { icon: MapPin, text: 'Debapriya Mukhopadhyay Vision Research Institute' },
                  { icon: MapPinned, text: 'Greater Kolkata Area, West Bengal' },
                ].map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="flex items-start gap-3 px-4 py-3 rounded-[12px] bg-indriya-card dark:bg-indriya-darkCard border border-indriya-border dark:border-indriya-darkBorder"
                  >
                    <Icon size={13} className="flex-shrink-0 mt-[2px]" style={{ color: '#0C6E72' }} />
                    <span className="text-[12px] text-indriya-muted dark:text-indriya-darkMuted leading-snug">{text}</span>
                  </div>
                ))}
              </div>

              {/* LinkedIn CTA */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex items-center gap-2 text-[12px] font-bold hover:text-[#0C6E72] text-indriya-muted dark:text-indriya-darkMuted transition-colors group"
              >
                <ExternalLink size={14} />
                View LinkedIn Profile
                <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          STATS — bordered cell grid
      ════════════════════════════════════ */}
      <section className="w-full border-y border-indriya-border dark:border-indriya-darkBorder">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-indriya-border dark:divide-indriya-darkBorder border-l border-indriya-border dark:border-indriya-darkBorder overflow-hidden">
            <StatCell icon={CalendarDays} value="20+" label="Events Conducted" sub="Across India" />
            <StatCell icon={Users} value="1K+" label="Practitioners Trained" sub="Live & online" />
            <StatCell icon={MapPinned} value="10+" label="Cities Reached" sub="Tier 1 to tier 3" />
            <StatCell icon={Star} value="664+" label="LinkedIn Followers" sub="And growing daily" />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          FOUNDER BIO — long form, editorial
      ════════════════════════════════════ */}
      <section className="w-full border-b border-indriya-border dark:border-indriya-darkBorder">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <SlitLine label="The Founder" index={1} />

          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-0 pb-16">
            {/* Left — sticky label */}
            <div className="lg:sticky lg:top-24 self-start pr-0 lg:pr-12 pb-10 lg:pb-0">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <p
                  className="text-indriya-text dark:text-indriya-darkText leading-[1.1] tracking-[-0.025em] mb-4"
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: 'clamp(24px, 3vw, 36px)',
                    fontWeight: 400,
                  }}
                >
                  "I built IndriyaX to solve a problem I lived through."
                </p>
                <p className="text-[13px] text-indriya-muted dark:text-indriya-darkMuted">— Anik Dingal, Founder</p>
              </motion.div>
            </div>

            {/* Right — bio text */}
            <div className="border-l-0 lg:border-l border-indriya-border dark:border-indriya-darkBorder pl-0 lg:pl-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-5 text-[15px] text-indriya-muted dark:text-indriya-darkMuted leading-[1.85] max-w-[620px]"
              >
                <p>
                  Anik Dingal is a dedicated optometrist with a deep passion for improving vision and eye health across India.
                  He specialises in comprehensive eye examinations, diagnosing and treating a wide range of vision conditions,
                  and fitting contact lenses tailored to individual needs.
                </p>
                <p>
                  His commitment to patient care extends beyond the clinic — he actively engages in community outreach
                  programs to promote eye health education in underserved regions, where access to quality optometry has
                  historically been limited.
                </p>
                <p>
                  Graduating with honours from Vidyasagar College of Optometry and Vision Science, Anik continues to stay
                  current with the latest advancements in the field. As Innovation Lead at the Debapriya Mukhopadhyay Vision
                  Research Institute & Foundation, he drives research in vision instruments and diagnostic software.
                </p>
                <p>
                  He founded IndriyaX to bridge the gap between optometry education and clinical practice across India —
                  to give every practitioner, regardless of location, access to the same quality of knowledge that
                  was once available only in metro teaching hospitals.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          TIMELINE — journey of IndriyaX
      ════════════════════════════════════ */}
      <section className="w-full border-b border-indriya-border dark:border-indriya-darkBorder">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <SlitLine label="The Journey" index={2} />

          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-0 pb-16">
            <div className="lg:sticky lg:top-24 self-start pr-0 lg:pr-12 pb-10 lg:pb-0">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <p
                  className="text-indriya-text dark:text-indriya-darkText leading-[1.1] tracking-[-0.025em]"
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: 'clamp(22px, 2.5vw, 32px)',
                    fontWeight: 400,
                  }}
                >
                  From a single<br />workshop to India's<br />
                  <span className="italic" style={{ color: '#0C6E72' }}>premier platform.</span>
                </p>
              </motion.div>
            </div>

            <div className="border-l-0 lg:border-l border-indriya-border dark:border-indriya-darkBorder pl-0 lg:pl-12">
              {timeline.map((item, i) => (
                <TimelineEvent key={item.year} {...item} last={i === timeline.length - 1} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          PRINCIPLES — what IndriyaX stands for
      ════════════════════════════════════ */}
      <section className="w-full border-b border-indriya-border dark:border-indriya-darkBorder">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <SlitLine label="Our Principles" index={3} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-16">
            {principles.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  className="group rounded-[20px] p-7 border border-indriya-border dark:border-indriya-darkBorder bg-indriya-card dark:bg-indriya-darkCard hover:border-[rgba(12,110,114,0.3)] transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className="w-10 h-10 rounded-[12px] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: 'rgba(12,110,114,0.08)' }}
                  >
                    <Icon size={18} style={{ color: '#0C6E72' }} />
                  </div>
                  <h3 className="text-[15px] font-bold text-indriya-text dark:text-indriya-darkText mb-2 group-hover:text-[#0C6E72] transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-[13px] text-indriya-muted dark:text-indriya-darkMuted leading-[1.75]">
                    {p.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          CTA — join the network
      ════════════════════════════════════ */}
      <section className="w-full relative overflow-hidden" style={{ backgroundColor: '#050D0E' }}>
        {/* Topography rings watermark */}
        <div className="absolute inset-0 flex items-center justify-end pointer-events-none pr-24">
          <svg viewBox="0 0 500 500" className="w-[500px] h-[500px] opacity-[0.07]" fill="none">
            {[40, 80, 120, 160, 200, 240, 280].map(r => (
              <circle key={r} cx="250" cy="250" r={r} stroke="#0C6E72" strokeWidth="1.5" />
            ))}
            <line x1="250" y1="50" x2="250" y2="450" stroke="#0C6E72" strokeWidth="0.8" strokeDasharray="4 4" />
            <line x1="50" y1="250" x2="450" y2="250" stroke="#0C6E72" strokeWidth="0.8" strokeDasharray="4 4" />
            <circle cx="250" cy="250" r="4" fill="#0C6E72" />
          </svg>
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-16 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1px_360px] gap-0 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="pr-0 lg:pr-16 py-8"
            >
              <p className="text-[10px] font-black tracking-[0.18em] uppercase mb-5" style={{ color: 'rgba(12,110,114,0.8)' }}>
                Join the network
              </p>
              <h2
                className="text-white leading-[1.05] tracking-[-0.03em] mb-5"
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 'clamp(32px, 5vw, 64px)',
                  fontWeight: 400,
                }}
              >
                Are you an expert<br />
                in <span className="italic" style={{ color: '#0C6E72' }}>vision science?</span>
              </h2>
              <p className="text-white/50 text-[15px] leading-[1.8] max-w-[460px]">
                We are always looking for clinicians, researchers, and educators to contribute
                articles, lead webinars, and shape the future of optometry education in India.
              </p>
            </motion.div>

            <div className="hidden lg:block w-[1px] self-stretch bg-white/10 my-8" />

            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="pl-0 lg:pl-16 py-8 flex flex-col gap-4"
            >
              <Link
                to="/contact"
                className="inline-flex items-center gap-2.5 text-white text-[14px] font-bold px-8 py-4 rounded-full transition-opacity hover:opacity-90 w-fit"
                style={{
                  backgroundColor: '#0C6E72',
                  boxShadow: '0 0 0 1px rgba(12,110,114,0.4), 0 8px 32px rgba(12,110,114,0.3)',
                }}
              >
                Get in Touch
                <ArrowRight size={15} strokeWidth={2.5} />
              </Link>
              <Link
                to="/articles"
                className="inline-flex items-center gap-2 text-[13px] font-semibold text-white/50 hover:text-white/80 transition-colors group"
              >
                Or read our articles
                <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
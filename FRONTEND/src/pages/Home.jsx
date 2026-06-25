import React, { useEffect, useRef, useState } from 'react';
import {
  motion, useScroll, useTransform, useInView, useSpring,
  AnimatePresence, useReducedMotion, useMotionValue,
} from 'framer-motion';
import {
  ArrowRight, ArrowUpRight, BookOpen, Microscope, TrendingUp, Users, Play,
  ChevronRight, Eye, Quote, Plus, Minus, Star,
  ScanLine, Crosshair, Award, GraduationCap, Stethoscope, FlaskConical,
  Brain, Layers, Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ACCENT = '#0C6E72';
const ACCENT_LIGHT = '#3fb3b8';

/* Keratometry diagnostic color scale — the real spectrum of corneal topography.
   Cool (flat) → warm (steep). This is the page's core visual DNA. */
const KERATO = [
  '#1b3a8f', '#1e5fbf', '#2a8fd4', '#2ec6c2', '#34c759',
  '#9ad32f', '#f1c40f', '#f39c12', '#e67e22', '#e74c3c', '#c0392b',
];

/* Sample the kerato scale at t∈[0,1] */
function keratoAt(t) {
  const x = Math.max(0, Math.min(1, t)) * (KERATO.length - 1);
  return KERATO[Math.round(x)];
}

/* ════════════════════════════════════════════════════════════
   SIGNATURE — LIVE CORNEAL TOPOGRAPHY (canvas)
   A real keratometry map that deforms toward the cursor, like
   palpating a cornea under a placido disc. This is the wow.
════════════════════════════════════════════════════════════ */
function LiveTopography({ intensity = 1 }) {
  const canvasRef = useRef(null);
  const reduce = useReducedMotion();
  const mouse = useRef({ x: 0.5, y: 0.5, active: false });
  const raf = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, dpr;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = (e.clientX - rect.left) / rect.width;
      mouse.current.y = (e.clientY - rect.top) / rect.height;
      mouse.current.active = true;
    };
    const onLeave = () => { mouse.current.active = false; };
    window.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);

    let t = 0;
    // smoothed cursor influence
    let infl = { x: 0.5, y: 0.5, amt: 0 };

    const RINGS = 26;
    const POINTS = 120;

    const draw = () => {
      t += 0.005 * intensity;
      // ease the influence toward the live mouse
      const targetAmt = mouse.current.active ? 1 : 0;
      infl.amt += (targetAmt - infl.amt) * 0.06;
      infl.x += (mouse.current.x - infl.x) * 0.08;
      infl.y += (mouse.current.y - infl.y) * 0.08;

      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;
      const maxR = Math.min(w, h) * 0.46;

      // cursor position in canvas space
      const mx = infl.x * w, my = infl.y * h;

      for (let r = 1; r <= RINGS; r++) {
        const baseR = (r / RINGS) * maxR;
        const colorT = r / RINGS;
        ctx.beginPath();
        for (let p = 0; p <= POINTS; p++) {
          const ang = (p / POINTS) * Math.PI * 2;
          // ambient breathing wave
          const wave = Math.sin(ang * 3 + t * 2 + r * 0.3) * 2.2
                     + Math.sin(ang * 5 - t * 1.5) * 1.4;
          // cursor "steepening" — pulls rings toward the pointer, mimicking
          // a localized corneal elevation (like keratoconus apex)
          let px = cx + Math.cos(ang) * baseR;
          let py = cy + Math.sin(ang) * baseR * 0.92;
          const dx = px - mx, dy = py - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const pull = Math.exp(-(dist * dist) / (2 * (maxR * 0.4) ** 2)) * infl.amt * 26 * intensity;
          px += (dx / (dist || 1)) * -pull;
          py += (dy / (dist || 1)) * -pull;
          px += Math.cos(ang) * wave;
          py += Math.sin(ang) * wave;
          if (p === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
        const col = keratoAt(colorT);
        ctx.strokeStyle = col;
        ctx.globalAlpha = 0.16 + colorT * 0.12;
        ctx.lineWidth = r < 5 ? 1.6 : 1.1;
        ctx.stroke();
      }

      // crosshair
      ctx.globalAlpha = 0.25;
      ctx.strokeStyle = ACCENT;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(cx, cy - maxR); ctx.lineTo(cx, cy + maxR);
      ctx.moveTo(cx - maxR, cy); ctx.lineTo(cx + maxR, cy);
      ctx.stroke();

      // apex dot follows cursor
      ctx.globalAlpha = 0.5 * infl.amt + 0.2;
      ctx.fillStyle = ACCENT_LIGHT;
      ctx.beginPath();
      ctx.arc(mx, my, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = 1;
      raf.current = requestAnimationFrame(draw);
    };

    if (reduce) {
      // static single frame
      infl.amt = 0; draw(); cancelAnimationFrame(raf.current);
    } else {
      draw();
    }

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, [intensity, reduce]);

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />;
}

/* ════════════════════════════════════════════════════════════
   SPECTRUM RULE — keratometry color band divider
════════════════════════════════════════════════════════════ */
function SpectrumRule({ className = '', animate = true }) {
  const reduce = useReducedMotion();
  return (
    <div className={`relative h-[2px] w-full overflow-hidden rounded-full ${className}`}>
      <motion.div
        className="absolute inset-0 flex"
        initial={animate && !reduce ? { scaleX: 0, transformOrigin: 'left' } : false}
        whileInView={animate && !reduce ? { scaleX: 1 } : undefined}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      >
        {KERATO.map((c, i) => (
          <span key={i} className="flex-1 h-full" style={{ backgroundColor: c, opacity: 0.6 }} />
        ))}
      </motion.div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   OCT CROSS-SECTION — scroll-driven retinal layer reveal.
   As the user scrolls, each retinal layer draws in + labels,
   like a live optical coherence tomography scan.
════════════════════════════════════════════════════════════ */
const RETINAL_LAYERS = [
  { id: 'ILM', name: 'Nerve Fiber Layer', depth: 0.08, color: '#e74c3c' },
  { id: 'GCL', name: 'Ganglion Cell Layer', depth: 0.20, color: '#e67e22' },
  { id: 'IPL', name: 'Inner Plexiform', depth: 0.32, color: '#f1c40f' },
  { id: 'INL', name: 'Inner Nuclear', depth: 0.44, color: '#9ad32f' },
  { id: 'OPL', name: 'Outer Plexiform', depth: 0.56, color: '#2ec6c2' },
  { id: 'ONL', name: 'Outer Nuclear', depth: 0.68, color: '#2a8fd4' },
  { id: 'RPE', name: 'Pigment Epithelium', depth: 0.84, color: '#1e5fbf' },
];

function OCTScan() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.4'] });
  const sweep = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div ref={ref} className="relative w-full">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-12 items-center">
        {/* The scan */}
        <div className="relative rounded-[24px] overflow-hidden border border-indriya-border dark:border-indriya-darkBorder bg-[#04181a]" style={{ aspectRatio: '16/10' }}>
          <svg viewBox="0 0 800 500" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="octGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0C6E72" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#04181a" stopOpacity="0" />
              </linearGradient>
            </defs>
            <rect width="800" height="500" fill="url(#octGlow)" />
            {/* Layer bands */}
            {RETINAL_LAYERS.map((layer, i) => {
              const y = 60 + layer.depth * 360;
              return (
                <motion.g key={layer.id}>
                  <motion.path
                    d={`M0 ${y} Q200 ${y - 18} 400 ${y} T800 ${y}`}
                    fill="none"
                    stroke={layer.color}
                    strokeWidth={i === 6 ? 4 : 2.5}
                    initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                    whileInView={reduce ? false : { pathLength: 1, opacity: 0.85 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 1.1, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  />
                  {/* Subtle texture speckle band */}
                  <motion.path
                    d={`M0 ${y} Q200 ${y - 18} 400 ${y} T800 ${y}`}
                    fill="none"
                    stroke={layer.color}
                    strokeWidth={10}
                    strokeOpacity={0.08}
                    initial={reduce ? false : { opacity: 0 }}
                    whileInView={reduce ? false : { opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, delay: i * 0.12 }}
                  />
                </motion.g>
              );
            })}
            {/* Foveal pit */}
            <motion.path
              d="M340 200 Q400 280 460 200"
              fill="none" stroke={ACCENT_LIGHT} strokeWidth="2" strokeDasharray="3 3"
              initial={reduce ? false : { pathLength: 0 }}
              whileInView={reduce ? false : { pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 1 }}
            />
          </svg>
          {/* Live sweep line tied to scroll */}
          {!reduce && (
            <motion.div
              className="absolute top-0 bottom-0 w-[2px] pointer-events-none"
              style={{ left: sweep, background: `linear-gradient(to bottom, transparent, ${ACCENT_LIGHT}, transparent)`, boxShadow: `0 0 12px ${ACCENT_LIGHT}` }}
            />
          )}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <ScanLine size={14} className="text-white/70" />
            <span className="text-[10px] font-black tracking-[0.14em] uppercase text-white/70">OCT B-Scan · Macula</span>
          </div>
        </div>

        {/* Layer legend */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-black tracking-[0.16em] uppercase text-indriya-muted dark:text-indriya-darkMuted mb-4">
            Seven retinal layers
          </p>
          {RETINAL_LAYERS.map((layer, i) => (
            <motion.div
              key={layer.id}
              initial={reduce ? false : { opacity: 0, x: 12 }}
              whileInView={reduce ? false : { opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex items-center gap-3 py-1.5"
            >
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: layer.color }} />
              <span className="text-[11px] font-mono font-bold text-indriya-muted dark:text-indriya-darkMuted w-9 flex-shrink-0">{layer.id}</span>
              <span className="text-[13px] font-semibold text-indriya-text dark:text-indriya-darkText">{layer.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MAGNETIC BUTTON
════════════════════════════════════════════════════════════ */
function MagneticBtn({ children, className = '', style = {}, to, onClick }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const handleMove = (e) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({ x: (e.clientX - (rect.left + rect.width / 2)) * 0.3, y: (e.clientY - (rect.top + rect.height / 2)) * 0.3 });
  };
  const Tag = to ? Link : 'button';
  return (
    <motion.div
      ref={ref}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onMouseMove={handleMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      className="inline-block"
    >
      <Tag to={to} onClick={onClick} className={className} style={style}>{children}</Tag>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════
   COUNT-UP
════════════════════════════════════════════════════════════ */
function CountUp({ value, suffix = '', duration = 1.8 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : 0);
  useEffect(() => {
    if (!inView || reduce) { setDisplay(value); return; }
    let r; const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / (duration * 1000));
      setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) r = requestAnimationFrame(tick);
    };
    r = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(r);
  }, [inView, value, duration, reduce]);
  return <span ref={ref}>{display.toLocaleString('en-IN')}{suffix}</span>;
}

/* ════════════════════════════════════════════════════════════
   TILT CARD — 3D pointer tilt
════════════════════════════════════════════════════════════ */
function TiltCard({ children, className = '', style = {} }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const rx = useMotionValue(0), ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 18 });
  const sry = useSpring(ry, { stiffness: 200, damping: 18 });
  const onMove = (e) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * 10); rx.set(-py * 10);
  };
  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => { rx.set(0); ry.set(0); }}
      style={{ rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d', transformPerspective: 1000, ...style }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════
   SPLIT TEXT — word-by-word reveal
════════════════════════════════════════════════════════════ */
function SplitWords({ text, className = '', style = {}, delay = 0 }) {
  const reduce = useReducedMotion();
  const words = text.split(' ');
  return (
    <span className={className} style={style}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={reduce ? false : { y: '110%' }}
            whileInView={reduce ? false : { y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: delay + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ════════════════════════════════════════════════════════════
   MARQUEE
════════════════════════════════════════════════════════════ */
function Marquee({ items, reverse = false }) {
  const reduce = useReducedMotion();
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div
        animate={reduce ? undefined : { x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration: 34, ease: 'linear', repeat: Infinity }}
        className="inline-flex gap-0"
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className="inline-flex items-center gap-3 px-8 text-[12px] font-bold tracking-[0.12em] uppercase text-indriya-muted dark:text-indriya-darkMuted">
            <span className="w-1 h-1 rounded-full inline-block" style={{ backgroundColor: ACCENT }} />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   LIVE READING TICKER
════════════════════════════════════════════════════════════ */
const tickerArticles = [
  'Corneal Topography in Keratoconus Management',
  'Scleral Lens Fitting for Irregular Corneas',
  'Myopia Epidemic: Indian School Children Study 2025',
  'OCT-Angiography: The New Standard',
  'Diabetic Retinopathy AI Screening — Phase 2 Results',
];
function ReadingTicker() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % tickerArticles.length), 3200);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex items-center gap-3 overflow-hidden">
      <span className="text-[9px] font-black tracking-[0.15em] uppercase text-white/60 flex-shrink-0 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{ backgroundColor: ACCENT }} />
        Reading now
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
          className="text-[12px] font-medium text-white/80 truncate"
        >
          {tickerArticles[idx]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   DATA
════════════════════════════════════════════════════════════ */
const features = [
  { tag: 'Clinical', title: 'Evidence-Based Clinical Discussions', desc: 'Peer-reviewed insights translated into practical guidance — annotated, verified, ready to apply tomorrow.', num: '01', icon: Stethoscope },
  { tag: 'Research', title: 'Research Guidance & Paper Reviews', desc: 'Complex studies broken down with expert annotations, methodology critiques, and critical appraisals.', num: '02', icon: FlaskConical },
  { tag: 'Innovation', title: 'Latest Advancements in Vision Science', desc: 'Real-time coverage of breakthroughs in optometry, retinal research, and surgical techniques.', num: '03', icon: Sparkles },
  { tag: 'Events', title: 'Webinars & Expert Talks', desc: 'Live and on-demand sessions led by top clinicians and researchers across India and globally.', num: '04', icon: Play },
  { tag: 'Cases', title: 'Case Discussions & Practical Insights', desc: 'Real clinical cases dissected — diagnoses, differentials, and decision-making made fully transparent.', num: '05', icon: Brain },
  { tag: 'Career', title: 'Career Guidance & Skill Development', desc: 'Structured pathways for every stage — from optometry boards to subspecialty practice-building.', num: '06', icon: GraduationCap },
];

const featuredArticles = [
  { img: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=900', tag: 'Ophthalmology', title: 'The Future of Retinal Gene Therapy', time: '9 min read', author: 'Anik Dingal' },
  { img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600', tag: 'Technology', title: 'AI Diagnostics in Glaucoma Screening', time: '6 min read', author: 'IndriyaX Editorial' },
  { img: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=600', tag: 'Clinical Trials', title: 'Phase 3 Results: Next-Gen Cataract Lenses', time: '8 min read', author: 'IndriyaX Editorial' },
];

const trustItems = [
  'Evidence-Based', 'Peer-Reviewed', 'AIOC Member Platform', 'Clinically Verified',
  'Research-Backed', 'Community-Driven', "India's Premier Optometry Platform", 'VCOVS Affiliated',
];

const journey = [
  { step: '01', title: 'Create your profile', desc: 'Join free in under a minute. Tell us your stage — student, practitioner, or researcher.', icon: Users },
  { step: '02', title: 'Follow your disciplines', desc: 'Curate a feed across clinical, research, and innovation tracks that match your practice.', icon: Crosshair },
  { step: '03', title: 'Learn from the best', desc: 'Read peer-reviewed breakdowns, join live webinars, and discuss real cases with experts.', icon: Eye },
  { step: '04', title: 'Grow your practice', desc: 'Earn knowledge that compounds — and a network that moves your career forward.', icon: TrendingUp },
];

const testimonials = [
  { quote: 'IndriyaX is the first place I check before a complex fitting. The case breakdowns are genuinely clinical, not fluff.', name: 'Dr. Priya Nair', role: 'Contact Lens Specialist · Chennai', initials: 'PN' },
  { quote: 'The research reviews saved me hours. Methodology critiques I would have missed are laid out plainly.', name: 'Dr. Arjun Mehta', role: 'Glaucoma Fellow · AIIMS', initials: 'AM' },
  { quote: 'As a final-year student, the career pathways gave me a map I did not know I needed. Invaluable.', name: 'Sneha Kulkarni', role: 'Optometry Student · Mumbai', initials: 'SK' },
];

const faqs = [
  { q: 'Who can join IndriyaX?', a: 'Optometrists, optometry students, vision researchers, and allied eye-care professionals. Membership is free to start.' },
  { q: 'Is the clinical content peer-reviewed?', a: 'Yes. Every clinical discussion is sourced from peer-reviewed literature and annotated by practicing clinicians before publication.' },
  { q: 'Do you offer live webinars?', a: 'We host live and on-demand sessions with leading clinicians across India and globally, with recordings available to members.' },
  { q: 'How do premium articles work?', a: 'Most content is open. Select premium deep-dives require a free account to read in full — a quick sign-in unlocks them.' },
];

/* ════════════════════════════════════════════════════════════
   HOME
════════════════════════════════════════════════════════════ */
export default function Home() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const heroTextY = useTransform(scrollY, [0, 600], [0, -90]);
  const heroOpacity = useTransform(scrollY, [0, 480], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 600], [1, 1.08]);

  const [openFaq, setOpenFaq] = useState(0);
  const [activeQuote, setActiveQuote] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActiveQuote((i) => (i + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, []);

  const heroStagger = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.2 } } };
  const heroItem = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } } };

  return (
    <div
      className="w-full bg-indriya-bg dark:bg-indriya-darkBg transition-colors duration-300 overflow-x-hidden"
      style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
    >
      {/* ════════════════════ HERO ════════════════════ */}
      <section className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden">

        {/* Live canvas topography — the signature, full-bleed behind content */}
        <motion.div
          className="absolute inset-0 pointer-events-auto"
          style={{ scale: reduce ? 1 : heroScale }}
        >
          <div className="absolute inset-0 lg:left-[-10%] lg:right-[40%] opacity-90">
            <LiveTopography intensity={1} />
          </div>
        </motion.div>

        {/* Vignette to keep text legible over canvas */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 70% 50%, transparent 0%, var(--tw-bg, rgba(255,255,255,0)) 0%)' }} />

        {/* Scan line */}
        <div className="absolute left-0 right-0 h-[1px] pointer-events-none" style={{ top: '50%', background: `linear-gradient(90deg, transparent 0%, rgba(12,110,114,0.15) 30%, rgba(12,110,114,0.08) 70%, transparent 100%)` }} />

        {/* Live reading bar */}
        <div className="absolute top-0 left-0 right-0 z-20 border-b border-white/10" style={{ backgroundColor: 'rgba(5,12,14,0.88)', backdropFilter: 'blur(12px)' }}>
          <div className="max-w-[1440px] mx-auto px-5 sm:px-6 lg:px-16 py-3">
            <ReadingTicker />
          </div>
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-6 lg:px-16 pt-28 pb-16 w-full pointer-events-none">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1px_1fr] gap-0 min-h-[70vh] items-center">

            {/* LEFT */}
            <motion.div
              variants={heroStagger} initial="hidden" animate="show"
              style={{ y: reduce ? 0 : heroTextY, opacity: reduce ? 1 : heroOpacity }}
              className="flex flex-col justify-center pr-0 lg:pr-16 py-8 lg:py-12 pointer-events-auto"
            >
              <motion.div variants={heroItem} className="flex items-center gap-3 mb-8 lg:mb-10">
                <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.16em] uppercase px-4 py-2 rounded-full border backdrop-blur-sm"
                  style={{ color: ACCENT, backgroundColor: 'rgba(12,110,114,0.1)', borderColor: 'rgba(12,110,114,0.25)' }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: ACCENT }} />
                  Now Open to Optometrists
                </div>
              </motion.div>

              <h1 className="text-indriya-text dark:text-indriya-darkText leading-[0.94] tracking-[-0.04em] mb-8"
                style={{ fontFamily: "'DM Serif Display', 'Georgia', serif", fontSize: 'clamp(52px, 7.5vw, 110px)', fontWeight: 400 }}>
                {['See', 'Further.', 'Lead.'].map((word, i) => (
                  <span key={word} className="block overflow-hidden">
                    <motion.span
                      className="inline-block relative"
                      initial={reduce ? false : { y: '110%' }} animate={reduce ? false : { y: 0 }}
                      transition={{ duration: 0.95, delay: 0.35 + i * 0.13, ease: [0.16, 1, 0.3, 1] }}
                      style={i === 2 ? { color: ACCENT, fontStyle: 'italic' } : {}}
                    >
                      {word === 'Further.' ? (
                        <span className="relative inline-block">
                          Further
                          <motion.span className="absolute bottom-1 left-0 h-[3px] rounded-full" style={{ backgroundColor: ACCENT }}
                            initial={reduce ? false : { width: 0 }} animate={reduce ? false : { width: '100%' }}
                            transition={{ duration: 0.7, delay: 1.2, ease: [0.16, 1, 0.3, 1] }} />
                          <span aria-hidden>.</span>
                        </span>
                      ) : word}
                    </motion.span>
                  </span>
                ))}
              </h1>

              <motion.p variants={heroItem} className="text-[16px] leading-[1.85] text-indriya-muted dark:text-indriya-darkMuted max-w-[420px] mb-10">
                India's dedicated research and learning home for optometrists and students who refuse to stop growing.
              </motion.p>

              <motion.div variants={heroItem} className="flex items-center gap-5 flex-wrap">
                <MagneticBtn to="/posts"
                  className="inline-flex items-center gap-2.5 text-white text-[13px] font-bold tracking-[0.04em] px-7 py-3.5 rounded-full transition-opacity hover:opacity-90"
                  style={{ backgroundColor: ACCENT, boxShadow: '0 0 0 1px rgba(12,110,114,0.3), 0 8px 32px rgba(12,110,114,0.28)' }}>
                  Join the Platform <ArrowRight size={14} strokeWidth={2.5} />
                </MagneticBtn>
                <Link to="/about" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-indriya-muted dark:text-indriya-darkMuted hover:text-[#0C6E72] transition-colors group">
                  Our story <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </motion.div>

              {/* Hint that the bg is interactive */}
              <motion.p variants={heroItem} className="mt-8 text-[11px] text-indriya-muted/70 dark:text-indriya-darkMuted/70 flex items-center gap-2">
                <Crosshair size={12} style={{ color: ACCENT }} />
                Move your cursor — the corneal map responds, like a live placido disc.
              </motion.p>
            </motion.div>

            <div className="hidden lg:block w-[1px] bg-indriya-border dark:bg-indriya-darkBorder self-stretch my-8" />

            {/* RIGHT */}
            <motion.div
              initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-6 pl-0 lg:pl-16 py-8 lg:py-12 pointer-events-auto"
            >
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {[
                  { n: 10, suffix: 'K+', l: 'Members', sub: 'Active this month' },
                  { n: 500, suffix: '+', l: 'Articles', sub: 'Expert authored' },
                  { n: 120, suffix: '+', l: 'Webinars', sub: 'On demand' },
                ].map(({ n, suffix, l, sub }) => (
                  <div key={l} className="rounded-[16px] p-4 border border-indriya-border dark:border-indriya-darkBorder bg-indriya-card/90 dark:bg-indriya-darkCard/90 backdrop-blur-sm">
                    <p className="text-indriya-text dark:text-indriya-darkText leading-none mb-1 tracking-tight"
                      style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: 400 }}>
                      <CountUp value={n} suffix={suffix} />
                    </p>
                    <p className="text-[11px] font-bold text-indriya-text dark:text-indriya-darkText mb-0.5">{l}</p>
                    <p className="text-[10px] text-indriya-muted dark:text-indriya-darkMuted">{sub}</p>
                  </div>
                ))}
              </div>

              <TiltCard className="group relative rounded-[20px] overflow-hidden block" style={{ aspectRatio: '16/9' }}>
                <Link to="/posts" className="block w-full h-full">
                  <img src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80" alt="Eye research"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" style={{ objectPosition: 'center 30%' }} />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(4,10,12,0.85) 0%, rgba(4,10,12,0.2) 50%, transparent 100%)' }} />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {[60, 90, 120].map((r) => (<div key={r} className="absolute rounded-full border border-white/10" style={{ width: r * 2, height: r * 2 }} />))}
                    <div className="absolute w-2 h-2 rounded-full bg-white/40" />
                    <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="oct-sweep absolute left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)' }} />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <span className="inline-block text-[9px] font-black tracking-[0.14em] uppercase px-2.5 py-1 rounded-full text-white mb-2" style={{ backgroundColor: ACCENT }}>Featured</span>
                    <h3 className="text-white text-[17px] font-bold leading-snug" style={{ fontFamily: "'DM Serif Display', serif" }}>The Future of Retinal Gene Therapy</h3>
                  </div>
                  <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight size={14} className="text-white" />
                  </div>
                </Link>
              </TiltCard>

              <div className="flex items-center gap-4 rounded-[14px] px-4 py-3 border border-indriya-border dark:border-indriya-darkBorder bg-indriya-card/90 dark:bg-indriya-darkCard/90 backdrop-blur-sm">
                <div className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(12,110,114,0.1)' }}>
                  <Play size={14} style={{ color: ACCENT }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black tracking-[0.12em] uppercase text-emerald-500">Live Now</span>
                  </div>
                  <p className="text-[12px] font-semibold text-indriya-text dark:text-indriya-darkText truncate">AI-Assisted Glaucoma Diagnosis — Dr. Mehta</p>
                </div>
                <span className="text-[11px] text-indriya-muted dark:text-indriya-darkMuted flex-shrink-0 hidden sm:block">342 watching</span>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 pointer-events-none"
          initial={{ opacity: 0 }} animate={{ opacity: reduce ? 1 : [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }}>
          <span className="text-[9px] font-black tracking-[0.16em] uppercase text-indriya-muted dark:text-indriya-darkMuted">Scroll</span>
          <div className="w-[1px] h-8" style={{ background: `linear-gradient(to bottom, ${ACCENT}, transparent)` }} />
        </motion.div>
      </section>

      {/* ════════════════════ TRUST MARQUEE ════════════════════ */}
      <div className="w-full border-y border-indriya-border dark:border-indriya-darkBorder py-4" style={{ backgroundColor: 'rgba(12,110,114,0.025)' }}>
        <Marquee items={trustItems} />
      </div>

      {/* ════════════════════ OCT SCAN — scroll-driven signature ════════════════════ */}
      <section className="w-full border-b border-indriya-border dark:border-indriya-darkBorder">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 lg:px-16 py-16 lg:py-24">
          <div className="flex items-center gap-6 mb-12">
            <p className="text-[10px] font-black tracking-[0.18em] uppercase text-indriya-muted dark:text-indriya-darkMuted flex-shrink-0">See deeper</p>
            <div className="flex-1"><SpectrumRule /></div>
            <span className="text-[10px] font-black tracking-[0.1em] uppercase text-indriya-muted dark:text-indriya-darkMuted flex-shrink-0 flex items-center gap-1.5">
              <Layers size={12} /> Cross-section
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1px_1fr] gap-0 mb-12">
            <div className="lg:pr-12 pb-8 lg:pb-0">
              <h2 className="text-indriya-text dark:text-indriya-darkText leading-[1.08] tracking-[-0.03em] mb-5"
                style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(30px, 4vw, 52px)', fontWeight: 400 }}>
                <SplitWords text="Knowledge, layer by layer." />
              </h2>
              <p className="text-[15px] text-indriya-muted dark:text-indriya-darkMuted leading-[1.8] max-w-[420px]">
                Like an OCT scan resolves the retina into seven distinct layers, IndriyaX resolves the
                profession into the depth you actually practice in — clinical, research, and innovation, in focus.
              </p>
            </div>
            <div className="hidden lg:block w-[1px] bg-indriya-border dark:bg-indriya-darkBorder self-stretch" />
            <div className="lg:pl-12 flex items-center">
              <p className="text-[13px] text-indriya-muted dark:text-indriya-darkMuted leading-[1.8] italic"
                style={{ fontFamily: "'DM Serif Display', serif" }}>
                "The eye is the only place in the body where you can see a nerve, an artery, and a vein
                without cutting. We built a platform with the same clarity."
              </p>
            </div>
          </div>
          <OCTScan />
        </div>
      </section>

      {/* ════════════════════ WHAT YOU'LL GAIN ════════════════════ */}
      <section className="w-full border-b border-indriya-border dark:border-indriya-darkBorder">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 lg:px-16">
          <div className="flex items-center gap-6 py-8 border-b border-indriya-border dark:border-indriya-darkBorder">
            <p className="text-[10px] font-black tracking-[0.18em] uppercase text-indriya-muted dark:text-indriya-darkMuted flex-shrink-0">What you'll gain</p>
            <div className="flex-1"><SpectrumRule /></div>
            <span className="text-[10px] font-black tracking-[0.1em] uppercase text-indriya-muted dark:text-indriya-darkMuted flex-shrink-0">6 Disciplines</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-0">
            <div className="lg:sticky lg:top-24 self-start py-12 lg:py-16 pr-0 lg:pr-12 border-b lg:border-b-0 lg:border-r border-indriya-border dark:border-indriya-darkBorder mb-8 lg:mb-0">
              <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
                <div className="w-10 h-10 rounded-[12px] flex items-center justify-center mb-8" style={{ backgroundColor: 'rgba(12,110,114,0.1)' }}>
                  <Eye size={18} style={{ color: ACCENT }} />
                </div>
                <blockquote className="text-indriya-text dark:text-indriya-darkText leading-[1.2] mb-6 tracking-[-0.025em]"
                  style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 400 }}>
                  "Everything you need to excel in eye care — in one place."
                </blockquote>
                <p className="text-[14px] text-indriya-muted dark:text-indriya-darkMuted leading-[1.75] mb-8">
                  Curated for clinical excellence, research depth, and real-world application at every stage of your career.
                </p>
                <Link to="/posts" className="inline-flex items-center gap-2 text-[13px] font-bold group" style={{ color: ACCENT }}>
                  Explore the platform <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </motion.div>
            </div>

            <div className="pl-0 lg:pl-12 py-8 lg:py-16">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div key={f.num}
                    initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    className="group flex gap-5 sm:gap-6 py-7 border-b border-indriya-border dark:border-indriya-darkBorder last:border-b-0 cursor-default hover:bg-[rgba(12,110,114,0.02)] dark:hover:bg-[rgba(12,110,114,0.04)] transition-colors duration-200 -mx-4 px-4 rounded-[12px]">
                    <div className="flex-shrink-0 pt-0.5 flex flex-col items-center gap-3">
                      <span className="text-[11px] font-black tracking-[0.08em]" style={{ color: 'rgba(12,110,114,0.5)' }}>{f.num}</span>
                      <div className="w-9 h-9 rounded-[10px] flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: 'rgba(12,110,114,0.07)' }}>
                        <Icon size={15} style={{ color: ACCENT }} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-[15px] font-bold text-indriya-text dark:text-indriya-darkText leading-snug group-hover:text-[#0C6E72] transition-colors duration-200">{f.title}</h3>
                        <span className="flex-shrink-0 text-[9px] font-black tracking-[0.12em] uppercase px-2.5 py-1 rounded-full mt-0.5" style={{ color: ACCENT, backgroundColor: 'rgba(12,110,114,0.08)' }}>{f.tag}</span>
                      </div>
                      <p className="text-[13px] text-indriya-muted dark:text-indriya-darkMuted leading-[1.7]">{f.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════ WHO JOINS ════════════════════ */}
      <section className="w-full border-b border-indriya-border dark:border-indriya-darkBorder">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 lg:px-16 py-16 lg:py-20">
          <div className="flex items-center gap-6 mb-12 lg:mb-14">
            <p className="text-[10px] font-black tracking-[0.18em] uppercase text-indriya-muted dark:text-indriya-darkMuted flex-shrink-0">Who joins</p>
            <div className="flex-1"><SpectrumRule /></div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-indriya-border dark:divide-indriya-darkBorder border border-indriya-border dark:border-indriya-darkBorder rounded-[24px] overflow-hidden">
            {[
              { label: 'Optometry\nStudents', sub: 'Build clinical confidence from day one', n: 6, suffix: 'K+', icon: BookOpen },
              { label: 'Practicing\nOptometrists', sub: 'Stay updated, stay ahead of the curve', n: 3, suffix: 'K+', icon: Microscope },
              { label: 'Researchers &\nAcademicians', sub: 'Collaborate and contribute to the field', n: 800, suffix: '+', icon: TrendingUp },
              { label: 'Healthcare\nProfessionals', sub: 'Multidisciplinary vision care community', n: 400, suffix: '+', icon: Users },
            ].map((a, i) => {
              const Icon = a.icon;
              return (
                <motion.div key={a.label}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="group p-6 sm:p-7 lg:p-9 bg-indriya-card dark:bg-indriya-darkCard hover:bg-[rgba(12,110,114,0.03)] dark:hover:bg-[rgba(12,110,114,0.06)] transition-colors duration-300 cursor-default flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-[12px] flex items-center justify-center group-hover:scale-105 transition-transform duration-300" style={{ backgroundColor: 'rgba(12,110,114,0.08)' }}>
                      <Icon size={18} style={{ color: ACCENT }} />
                    </div>
                    <span className="text-[13px] font-black tracking-tight" style={{ color: 'rgba(12,110,114,0.5)', fontFamily: "'DM Serif Display', serif" }}><CountUp value={a.n} suffix={a.suffix} /></span>
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-indriya-text dark:text-indriya-darkText leading-snug mb-1.5 whitespace-pre-line">{a.label}</h3>
                    <p className="text-[12px] text-indriya-muted dark:text-indriya-darkMuted leading-[1.6]">{a.sub}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════ MEMBERSHIP JOURNEY ════════════════════ */}
      <section className="w-full border-b border-indriya-border dark:border-indriya-darkBorder overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 lg:px-16 py-16 lg:py-24">
          <div className="flex items-center gap-6 mb-14">
            <p className="text-[10px] font-black tracking-[0.18em] uppercase text-indriya-muted dark:text-indriya-darkMuted flex-shrink-0">How it works</p>
            <div className="flex-1"><SpectrumRule /></div>
            <span className="text-[10px] font-black tracking-[0.1em] uppercase text-indriya-muted dark:text-indriya-darkMuted flex-shrink-0">4 Steps</span>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0">
            {/* connecting line */}
            <div className="hidden lg:block absolute top-[44px] left-[12.5%] right-[12.5%] h-[2px]" style={{ background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_LIGHT}, ${ACCENT})`, opacity: 0.3 }} />
            {journey.map((j, i) => {
              const Icon = j.icon;
              return (
                <motion.div key={j.step}
                  initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="relative lg:px-6 first:lg:pl-0 last:lg:pr-0">
                  <div className="relative z-10 w-[88px] h-[88px] rounded-[22px] flex items-center justify-center mb-6 bg-indriya-card dark:bg-indriya-darkCard border border-indriya-border dark:border-indriya-darkBorder"
                    style={{ boxShadow: '0 8px 28px rgba(12,110,114,0.10)' }}>
                    <Icon size={26} style={{ color: ACCENT }} />
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black text-white" style={{ backgroundColor: ACCENT }}>{j.step}</span>
                  </div>
                  <h3 className="text-[16px] font-bold text-indriya-text dark:text-indriya-darkText mb-2 leading-snug">{j.title}</h3>
                  <p className="text-[13px] text-indriya-muted dark:text-indriya-darkMuted leading-[1.7] max-w-[260px]">{j.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════ TESTIMONIALS ════════════════════ */}
      <section className="w-full border-b border-indriya-border dark:border-indriya-darkBorder relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 lg:px-16 py-16 lg:py-24">
          <div className="flex items-center gap-6 mb-14">
            <p className="text-[10px] font-black tracking-[0.18em] uppercase text-indriya-muted dark:text-indriya-darkMuted flex-shrink-0">From the community</p>
            <div className="flex-1"><SpectrumRule /></div>
            <span className="text-[10px] font-black tracking-[0.1em] uppercase text-indriya-muted dark:text-indriya-darkMuted flex-shrink-0 flex items-center gap-1.5"><Award size={12} /> Trusted</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 lg:gap-16 items-center">
            {/* Rotating quote */}
            <div className="relative min-h-[220px] flex items-center">
              <Quote size={48} className="absolute -top-2 -left-1 opacity-10" style={{ color: ACCENT }} />
              <AnimatePresence mode="wait">
                <motion.div key={activeQuote}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                  <blockquote className="text-indriya-text dark:text-indriya-darkText leading-[1.4] tracking-[-0.02em] mb-6"
                    style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(22px, 2.6vw, 32px)', fontWeight: 400 }}>
                    "{testimonials[activeQuote].quote}"
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-[13px] font-bold text-white" style={{ backgroundColor: ACCENT }}>
                      {testimonials[activeQuote].initials}
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-indriya-text dark:text-indriya-darkText">{testimonials[activeQuote].name}</p>
                      <p className="text-[12px] text-indriya-muted dark:text-indriya-darkMuted">{testimonials[activeQuote].role}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Selector + rating */}
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (<Star key={i} size={18} className="fill-current" style={{ color: '#f1c40f' }} />))}
                <span className="ml-2 text-[13px] font-bold text-indriya-text dark:text-indriya-darkText">4.9/5</span>
                <span className="text-[12px] text-indriya-muted dark:text-indriya-darkMuted">· 1,200+ reviews</span>
              </div>
              <div className="flex flex-col gap-2">
                {testimonials.map((tt, i) => (
                  <button key={i} onClick={() => setActiveQuote(i)}
                    className={`text-left p-3 rounded-[12px] border transition-all ${i === activeQuote ? 'border-transparent' : 'border-indriya-border dark:border-indriya-darkBorder'}`}
                    style={i === activeQuote ? { backgroundColor: 'rgba(12,110,114,0.08)' } : {}}>
                    <p className="text-[12px] font-bold text-indriya-text dark:text-indriya-darkText">{tt.name}</p>
                    <p className="text-[11px] text-indriya-muted dark:text-indriya-darkMuted truncate">{tt.role}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════ FEATURED ARTICLES ════════════════════ */}
      <section className="w-full border-b border-indriya-border dark:border-indriya-darkBorder">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 lg:px-16 py-16 lg:py-20">
          <div className="flex items-center justify-between gap-6 mb-12 lg:mb-14 flex-wrap">
            <div className="flex items-center gap-6 flex-1 min-w-[200px]">
              <p className="text-[10px] font-black tracking-[0.18em] uppercase text-indriya-muted dark:text-indriya-darkMuted flex-shrink-0">Featured stories</p>
              <div className="flex-1"><SpectrumRule /></div>
            </div>
            <Link to="/posts" className="inline-flex items-center gap-1.5 text-[12px] font-bold text-indriya-muted dark:text-indriya-darkMuted hover:text-[#0C6E72] transition-colors group flex-shrink-0">
              All posts <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {featuredArticles.map((a, i) => (
              <motion.div key={a.title}
                initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.75, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}>
                <Link to="/posts" className="block group">
                  <div className="relative overflow-hidden rounded-[20px] mb-4" style={{ aspectRatio: '16/10' }}>
                    <img src={a.img} alt={a.title} className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]" />
                    <div className="absolute inset-0 transition-opacity duration-300" style={{ background: 'linear-gradient(to top, rgba(5,10,12,0.55) 0%, transparent 60%)' }} />
                    <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="oct-sweep absolute left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)` }} />
                    </div>
                    <span className="absolute top-4 left-4 text-[9px] font-black tracking-[0.14em] uppercase px-3 py-1.5 rounded-full text-white" style={{ backgroundColor: ACCENT }}>{a.tag}</span>
                  </div>
                  <h3 className="text-indriya-text dark:text-indriya-darkText font-bold text-[16px] leading-snug mb-2 group-hover:text-[#0C6E72] dark:group-hover:text-[#3fb3b8] transition-colors" style={{ fontFamily: "'DM Serif Display', 'Georgia', serif" }}>{a.title}</h3>
                  <div className="flex items-center gap-2 text-[12px] text-indriya-muted dark:text-indriya-darkMuted">
                    <span>{a.author}</span><span>·</span><span>{a.time}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ FAQ ════════════════════ */}
      <section className="w-full border-b border-indriya-border dark:border-indriya-darkBorder">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 lg:px-16 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-10 lg:gap-16">
            <div>
              <p className="text-[10px] font-black tracking-[0.18em] uppercase text-indriya-muted dark:text-indriya-darkMuted mb-5">Questions</p>
              <h2 className="text-indriya-text dark:text-indriya-darkText leading-[1.1] tracking-[-0.03em] mb-4"
                style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 400 }}>
                Everything you<br />want to know.
              </h2>
              <p className="text-[14px] text-indriya-muted dark:text-indriya-darkMuted leading-[1.75]">
                Still curious? <Link to="/contact" className="font-bold hover:underline" style={{ color: ACCENT }}>Reach our team</Link> — we usually reply within a day.
              </p>
            </div>
            <div className="flex flex-col">
              {faqs.map((f, i) => {
                const open = openFaq === i;
                return (
                  <div key={i} className="border-b border-indriya-border dark:border-indriya-darkBorder first:border-t">
                    <button onClick={() => setOpenFaq(open ? -1 : i)} className="w-full flex items-center justify-between gap-4 py-5 text-left group">
                      <span className="text-[16px] font-bold text-indriya-text dark:text-indriya-darkText group-hover:text-[#0C6E72] transition-colors">{f.q}</span>
                      <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: open ? ACCENT : 'rgba(12,110,114,0.08)' }}>
                        {open ? <Minus size={14} className="text-white" /> : <Plus size={14} style={{ color: ACCENT }} />}
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
                          <p className="text-[14px] text-indriya-muted dark:text-indriya-darkMuted leading-[1.8] pb-5 pr-10">{f.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════ CTA ════════════════════ */}
      <section className="w-full relative overflow-hidden" style={{ backgroundColor: '#050D0E' }}>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg viewBox="0 0 900 600" className="w-full h-full opacity-[0.10]" preserveAspectRatio="xMidYMid slice">
            {Array.from({ length: 16 }).map((_, i) => {
              const r = 28 + i * 30;
              return <ellipse key={i} cx="450" cy="300" rx={r} ry={r * 0.88} fill="none" stroke={keratoAt(i / 16)} strokeWidth="1.2" />;
            })}
          </svg>
        </div>
        <div className="absolute left-0 right-0 h-[1px] top-1/2 pointer-events-none" style={{ backgroundColor: 'rgba(12,110,114,0.2)' }} />
        <div className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-6 lg:px-16 py-20 lg:py-28 text-center">
          <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
            <p className="text-[10px] font-black tracking-[0.18em] uppercase mb-6" style={{ color: ACCENT_LIGHT }}>Join the community</p>
            <h2 className="text-white leading-[1.05] tracking-[-0.035em] mb-6 mx-auto"
              style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(38px, 6vw, 84px)', fontWeight: 400, maxWidth: '820px' }}>
              Ready to grow with<br />every blink?
            </h2>
            <p className="text-white/50 text-[16px] leading-[1.75] mb-12 mx-auto max-w-[480px]">
              Connect, learn, and elevate your practice alongside thousands of eye care professionals across India.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <MagneticBtn to="/posts"
                className="inline-flex items-center gap-2.5 text-white text-[14px] font-bold px-8 py-4 rounded-full transition-all hover:opacity-90"
                style={{ backgroundColor: ACCENT, boxShadow: '0 0 0 1px rgba(12,110,114,0.4), 0 12px 40px rgba(12,110,114,0.35)' }}>
                Get Started Free <ArrowRight size={15} strokeWidth={2.5} />
              </MagneticBtn>
              <Link to="/about" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-white/60 hover:text-white/90 transition-colors group">
                Learn more about us <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Global keyframes */}
      <style>{`
        @keyframes octSweep { 0% { top: -5%; } 100% { top: 105%; } }
        .oct-sweep { animation: octSweep 2.2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .oct-sweep { animation: none; display: none; }
        }
      `}</style>
    </div>
  );
}
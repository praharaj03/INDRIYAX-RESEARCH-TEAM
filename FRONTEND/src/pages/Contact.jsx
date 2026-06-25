import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Mail, MapPin, CheckCircle, AlertCircle, Loader, ArrowUpRight, MessageSquare, Handshake, FileText } from 'lucide-react';

/* ══════════════════════════════════════════
   OPHTHALMOSCOPE APERTURE — the signature element.
   Contact = focusing on a person. The aperture
   iris opens as you scroll into the section.
══════════════════════════════════════════ */
function OphthalmoscopeAperture({ className = '' }) {
  const blades = 8;
  return (
    <svg
      viewBox="0 0 320 320"
      className={`pointer-events-none ${className}`}
      fill="none"
    >
      <defs>
        <radialGradient id="apGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0C6E72" stopOpacity="0.15" />
          <stop offset="60%" stopColor="#0C6E72" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#0C6E72" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Glow fill */}
      <circle cx="160" cy="160" r="150" fill="url(#apGlow)" />

      {/* Outer measurement ring */}
      <circle cx="160" cy="160" r="148" stroke="#0C6E72" strokeWidth="0.8" strokeDasharray="3 5" opacity="0.3" />
      <circle cx="160" cy="160" r="130" stroke="#0C6E72" strokeWidth="0.6" opacity="0.2" />

      {/* Iris blades */}
      {Array.from({ length: blades }).map((_, i) => {
        const angle = (i / blades) * Math.PI * 2;
        const nextAngle = ((i + 1) / blades) * Math.PI * 2;
        const midAngle = angle + Math.PI / blades;
        const r1 = 55, r2 = 125;
        const x1 = 160 + Math.cos(angle) * r1;
        const y1 = 160 + Math.sin(angle) * r1;
        const x2 = 160 + Math.cos(midAngle) * r2;
        const y2 = 160 + Math.sin(midAngle) * r2;
        const x3 = 160 + Math.cos(nextAngle) * r1;
        const y3 = 160 + Math.sin(nextAngle) * r1;
        return (
          <path
            key={i}
            d={`M ${x1} ${y1} Q ${x2} ${y2} ${x3} ${y3} Z`}
            stroke="#0C6E72"
            strokeWidth="0.8"
            fill="rgba(12,110,114,0.04)"
            opacity="0.7"
          />
        );
      })}

      {/* Inner rings */}
      <circle cx="160" cy="160" r="50" stroke="#0C6E72" strokeWidth="1.2" opacity="0.35" />
      <circle cx="160" cy="160" r="32" stroke="#0C6E72" strokeWidth="0.8" opacity="0.25" />
      <circle cx="160" cy="160" r="14" stroke="#0C6E72" strokeWidth="1.5" opacity="0.45" />

      {/* Crosshairs */}
      <line x1="160" y1="10" x2="160" y2="310" stroke="#0C6E72" strokeWidth="0.6" strokeDasharray="2 6" opacity="0.2" />
      <line x1="10" y1="160" x2="310" y2="160" stroke="#0C6E72" strokeWidth="0.6" strokeDasharray="2 6" opacity="0.2" />

      {/* Center dot */}
      <circle cx="160" cy="160" r="4" fill="#0C6E72" opacity="0.6" />

      {/* Tick marks around outer ring */}
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2;
        const r = 148;
        const len = i % 6 === 0 ? 10 : 5;
        return (
          <line
            key={i}
            x1={160 + Math.cos(a) * (r - len)}
            y1={160 + Math.sin(a) * (r - len)}
            x2={160 + Math.cos(a) * r}
            y2={160 + Math.sin(a) * r}
            stroke="#0C6E72"
            strokeWidth={i % 6 === 0 ? 1.2 : 0.7}
            opacity="0.3"
          />
        );
      })}
    </svg>
  );
}

/* ─── Field component ─── */
function Field({ label, hint, children, error }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <label className="text-[12px] font-bold text-indriya-text dark:text-indriya-darkText tracking-[0.04em] uppercase">
          {label}
        </label>
        {hint && (
          <span className="text-[11px] text-indriya-muted dark:text-indriya-darkMuted">{hint}</span>
        )}
      </div>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-[11px] text-red-500 flex items-center gap-1.5"
          >
            <AlertCircle size={11} />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputBase =
  'w-full bg-indriya-card dark:bg-indriya-darkCard border border-indriya-border dark:border-indriya-darkBorder rounded-[14px] px-4 py-3.5 text-[14px] text-indriya-text dark:text-indriya-darkText placeholder-indriya-muted/50 dark:placeholder-indriya-darkMuted/50 transition-all duration-200 outline-none focus:border-[#0C6E72] focus:shadow-[0_0_0_3px_rgba(12,110,114,0.10)]';

const enquiryTypes = [
  { id: 'editorial', icon: FileText, label: 'Editorial', sub: 'Article pitch or correction' },
  { id: 'partnership', icon: Handshake, label: 'Partnership', sub: 'Institutional collaboration' },
  { id: 'general', icon: MessageSquare, label: 'General', sub: 'Anything else' },
];

/* ══════════════════════════════════════════
   CONTACT PAGE
══════════════════════════════════════════ */
export default function Contact() {
  const [enquiry, setEnquiry] = useState('general');
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.lastName.trim()) e.lastName = 'Last name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.message.trim()) e.message = 'Message is required';
    else if (form.message.trim().length < 20) e.message = 'Please provide a bit more detail (20+ chars)';
    return e;
  };

  const handleChange = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStatus('loading');
    await new Promise(r => setTimeout(r, 1800));
    setStatus('success');
  };

  return (
    <div
      className="w-full bg-indriya-bg dark:bg-indriya-darkBg transition-colors duration-300 overflow-x-hidden"
      style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
    >

      {/* ════════════════════════════════════
          HERO — aperture framing
      ════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden border-b border-indriya-border dark:border-indriya-darkBorder">

        {/* Aperture — right side decoration */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-[480px] h-[480px] pointer-events-none opacity-[0.55] dark:opacity-[0.4]">
          <OphthalmoscopeAperture className="w-full h-full" />
        </div>

        {/* Vertical scan line */}
        <div
          className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] pointer-events-none hidden lg:block"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(12,110,114,0.1) 30%, rgba(12,110,114,0.1) 70%, transparent)' }}
        />

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-16 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            >
              <span
                className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.16em] uppercase px-4 py-2 rounded-full border mb-8 block w-fit"
                style={{
                  color: '#0C6E72',
                  backgroundColor: 'rgba(12,110,114,0.07)',
                  borderColor: 'rgba(12,110,114,0.2)',
                }}
              >
                Contact Us
              </span>

              <h1
                className="text-indriya-text dark:text-indriya-darkText leading-[0.97] tracking-[-0.04em] mb-7"
                style={{
                  fontFamily: "'DM Serif Display', 'Georgia', serif",
                  fontSize: 'clamp(44px, 6.5vw, 88px)',
                  fontWeight: 400,
                }}
              >
                Let's<br />
                <span className="italic" style={{ color: '#0C6E72' }}>talk</span><br />
                vision.
              </h1>

              <p className="text-[16px] leading-[1.85] text-indriya-muted dark:text-indriya-darkMuted max-w-[400px] mb-10">
                For editorial enquiries, partnerships, or general questions —
                we aim to respond within 24 hours.
              </p>

              {/* Contact details */}
              <div className="flex flex-col gap-4">
                {[
                  {
                    icon: Mail,
                    label: 'Editorial',
                    value: 'editor@indriyax.com',
                    href: 'mailto:editor@indriyax.com',
                    sub: 'Articles, pitches, corrections',
                  },
                  {
                    icon: MapPin,
                    label: 'Headquarters',
                    value: 'Durgapur, West Bengal',
                    href: null,
                    sub: 'India — 713201',
                  },
                ].map(({ icon: Icon, label, value, href, sub }) => (
                  <div
                    key={label}
                    className="flex items-start gap-4 p-4 rounded-[16px] bg-indriya-card dark:bg-indriya-darkCard border border-indriya-border dark:border-indriya-darkBorder"
                  >
                    <div
                      className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: 'rgba(12,110,114,0.08)' }}
                    >
                      <Icon size={16} style={{ color: '#0C6E72' }} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black tracking-[0.12em] uppercase text-indriya-muted dark:text-indriya-darkMuted mb-0.5">
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          className="text-[14px] font-semibold text-indriya-text dark:text-indriya-darkText hover:text-[#0C6E72] transition-colors"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="text-[14px] font-semibold text-indriya-text dark:text-indriya-darkText">{value}</p>
                      )}
                      <p className="text-[11px] text-indriya-muted dark:text-indriya-darkMuted mt-0.5">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — response time expectation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:flex flex-col gap-4 justify-center"
            >
              {/* Response time card */}
              <div
                className="rounded-[20px] p-7 border border-indriya-border dark:border-indriya-darkBorder bg-indriya-card dark:bg-indriya-darkCard"
              >
                <p
                  className="text-indriya-text dark:text-indriya-darkText tracking-tight leading-none mb-2"
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: '48px',
                    fontWeight: 400,
                    color: '#0C6E72',
                  }}
                >
                  &lt; 24h
                </p>
                <p className="text-[13px] font-bold text-indriya-text dark:text-indriya-darkText mb-1">Average response time</p>
                <p className="text-[12px] text-indriya-muted dark:text-indriya-darkMuted">
                  Our team reviews every message personally — no bots, no auto-replies.
                </p>
              </div>

              {/* Enquiry types preview */}
              <div className="grid grid-cols-3 gap-3">
                {enquiryTypes.map(({ id, icon: Icon, label, sub }) => (
                  <div
                    key={id}
                    className="rounded-[16px] p-4 border border-indriya-border dark:border-indriya-darkBorder bg-indriya-card dark:bg-indriya-darkCard text-center"
                  >
                    <div
                      className="w-8 h-8 rounded-[10px] flex items-center justify-center mx-auto mb-2"
                      style={{ backgroundColor: 'rgba(12,110,114,0.08)' }}
                    >
                      <Icon size={14} style={{ color: '#0C6E72' }} />
                    </div>
                    <p className="text-[12px] font-bold text-indriya-text dark:text-indriya-darkText mb-0.5">{label}</p>
                    <p className="text-[10px] text-indriya-muted dark:text-indriya-darkMuted leading-snug">{sub}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          FORM SECTION
      ════════════════════════════════════ */}
      <section className="w-full">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">

          {/* Section rule */}
          <div className="flex items-center gap-5 py-6 border-b border-indriya-border dark:border-indriya-darkBorder mb-12">
            <span className="text-[9px] font-black tracking-[0.18em] uppercase flex-shrink-0" style={{ color: 'rgba(12,110,114,0.5)' }}>
              01
            </span>
            <div className="flex-1 h-[1px] bg-indriya-border dark:bg-indriya-darkBorder" />
            <span className="text-[9px] font-black tracking-[0.18em] uppercase text-indriya-muted dark:text-indriya-darkMuted flex-shrink-0">
              Send a Message
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 pb-24">

            {/* Left — enquiry type selector */}
            <div>
              <p className="text-[11px] font-black tracking-[0.12em] uppercase text-indriya-muted dark:text-indriya-darkMuted mb-4">
                Type of enquiry
              </p>
              <div className="flex flex-col gap-2">
                {enquiryTypes.map(({ id, icon: Icon, label, sub }) => {
                  const active = enquiry === id;
                  return (
                    <motion.button
                      key={id}
                      onClick={() => setEnquiry(id)}
                      whileHover={{ x: active ? 0 : 3 }}
                      className="flex items-center gap-3 p-4 rounded-[14px] border text-left transition-all duration-200 w-full"
                      style={{
                        borderColor: active ? '#0C6E72' : undefined,
                        backgroundColor: active ? 'rgba(12,110,114,0.06)' : undefined,
                      }}
                    >
                      <div
                        className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 transition-colors duration-200"
                        style={{
                          backgroundColor: active ? 'rgba(12,110,114,0.12)' : 'rgba(12,110,114,0.05)',
                        }}
                      >
                        <Icon
                          size={16}
                          style={{ color: active ? '#0C6E72' : undefined }}
                          className={active ? '' : 'text-indriya-muted dark:text-indriya-darkMuted'}
                        />
                      </div>
                      <div className="text-left">
                        <p
                          className={`text-[13px] font-bold transition-colors duration-200 ${active ? '' : 'text-indriya-text dark:text-indriya-darkText'}`}
                          style={active ? { color: '#0C6E72' } : {}}
                        >
                          {label}
                        </p>
                        <p className="text-[11px] text-indriya-muted dark:text-indriya-darkMuted">{sub}</p>
                      </div>
                      {active && (
                        <motion.div
                          layoutId="activeEnquiry"
                          className="ml-auto w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: '#0C6E72' }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Hint for current type */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={enquiry}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="mt-5 p-4 rounded-[14px] border border-indriya-border dark:border-indriya-darkBorder bg-indriya-card dark:bg-indriya-darkCard"
                >
                  <p className="text-[12px] text-indriya-muted dark:text-indriya-darkMuted leading-[1.65]">
                    {enquiry === 'editorial' && 'Include your article topic, a 2-sentence abstract, and any relevant credentials. We respond to all pitches within 72 hours.'}
                    {enquiry === 'partnership' && 'Tell us about your institution, the scope of collaboration you have in mind, and the best way to schedule a call with your team.'}
                    {enquiry === 'general' && "We're happy to hear from you. Tell us what's on your mind — questions, feedback, or ideas are all welcome."}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right — the form */}
            <div>
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full min-h-[400px] flex flex-col items-center justify-center text-center rounded-[24px] border border-indriya-border dark:border-indriya-darkBorder bg-indriya-card dark:bg-indriya-darkCard p-12"
                  >
                    {/* Aperture-inspired success icon */}
                    <div className="relative w-20 h-20 mb-8">
                      <OphthalmoscopeAperture className="absolute inset-0 w-full h-full opacity-30" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <CheckCircle size={28} style={{ color: '#0C6E72' }} />
                      </div>
                    </div>
                    <h3
                      className="text-indriya-text dark:text-indriya-darkText mb-3 tracking-[-0.02em]"
                      style={{
                        fontFamily: "'DM Serif Display', serif",
                        fontSize: '28px',
                        fontWeight: 400,
                      }}
                    >
                      Message received.
                    </h3>
                    <p className="text-[14px] text-indriya-muted dark:text-indriya-darkMuted max-w-[340px] leading-[1.75]">
                      We'll get back to you at <strong className="text-indriya-text dark:text-indriya-darkText">{form.email}</strong> within 24 hours.
                    </p>
                    <button
                      onClick={() => {
                        setStatus('idle');
                        setForm({ firstName: '', lastName: '', email: '', message: '' });
                      }}
                      className="mt-8 text-[13px] font-bold hover:text-[#0C6E72] text-indriya-muted dark:text-indriya-darkMuted transition-colors"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={handleSubmit}
                    noValidate
                    className="flex flex-col gap-6"
                  >
                    {/* Name row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Field label="First Name" error={errors.firstName}>
                        <input
                          className={inputBase}
                          placeholder="Anik"
                          value={form.firstName}
                          onChange={e => handleChange('firstName', e.target.value)}
                          style={errors.firstName ? { borderColor: '#ef4444' } : {}}
                        />
                      </Field>
                      <Field label="Last Name" error={errors.lastName}>
                        <input
                          className={inputBase}
                          placeholder="Dingal"
                          value={form.lastName}
                          onChange={e => handleChange('lastName', e.target.value)}
                          style={errors.lastName ? { borderColor: '#ef4444' } : {}}
                        />
                      </Field>
                    </div>

                    {/* Email */}
                    <Field label="Email Address" hint="We never share this" error={errors.email}>
                      <input
                        type="email"
                        className={inputBase}
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={e => handleChange('email', e.target.value)}
                        style={errors.email ? { borderColor: '#ef4444' } : {}}
                      />
                    </Field>

                    {/* Enquiry type hidden but shown in left panel */}
                    <input type="hidden" value={enquiry} name="enquiryType" />

                    {/* Message */}
                    <Field label="Message" hint={`${form.message.length} / 1000`} error={errors.message}>
                      <textarea
                        className={`${inputBase} resize-none`}
                        rows={6}
                        placeholder={
                          enquiry === 'editorial'
                            ? 'My article is about corneal topography in keratoconus. Here is a brief abstract...'
                            : enquiry === 'partnership'
                            ? 'Our institution is interested in co-hosting a webinar series on...'
                            : 'Hi IndriyaX team, I wanted to ask about...'
                        }
                        value={form.message}
                        maxLength={1000}
                        onChange={e => handleChange('message', e.target.value)}
                        style={errors.message ? { borderColor: '#ef4444' } : {}}
                      />
                    </Field>

                    {/* Submit */}
                    <div className="flex items-center gap-4">
                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="inline-flex items-center gap-2.5 text-white text-[14px] font-bold px-7 py-3.5 rounded-full transition-all duration-200 disabled:opacity-70"
                        style={{
                          backgroundColor: '#0C6E72',
                          boxShadow: '0 0 0 1px rgba(12,110,114,0.3), 0 8px 28px rgba(12,110,114,0.25)',
                        }}
                      >
                        {status === 'loading' ? (
                          <>
                            <Loader size={14} className="animate-spin" />
                            Sending…
                          </>
                        ) : (
                          <>
                            Send Message
                            <ArrowRight size={14} strokeWidth={2.5} />
                          </>
                        )}
                      </button>

                      <p className="text-[11px] text-indriya-muted dark:text-indriya-darkMuted">
                        No spam. No newsletters unless you ask.
                      </p>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
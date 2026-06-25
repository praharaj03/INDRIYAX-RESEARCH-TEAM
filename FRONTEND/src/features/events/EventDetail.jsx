import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Calendar, MapPin, User, IndianRupee, Info, Video, Lock,
  ArrowLeft, ShieldCheck, Clock, CheckCircle, AlertTriangle
} from 'lucide-react';
import { eventsService } from './eventsService';
import { paymentsService } from '../payments/paymentsService';
import { authService } from '../auth/authService';
import { useAuth } from '../auth/AuthContext';
import ImageUploader from '../uploads/ImageUploader';
import BrandLoader from '../../utils/BrandLoader';
import { getErrorMessage, getSuccessMessage } from '../../utils/apiMessage';

const ACCENT = '#0C6E72';
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&q=80&w=1200';

export default function EventDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [enrollment, setEnrollment] = useState(null); // this user's enrollment for THIS event (if any)
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [utr, setUtr] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');

  // Load event + (if logged in) the user's enrollment status for this event
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await eventsService.getEventBySlug(slug);
        if (cancelled) return;
        setEvent(data);

        if (user) {
          try {
            const enrollments = await authService.getMyEnrollments();
            if (cancelled) return;
            const mine = Array.isArray(enrollments)
              ? enrollments.find((en) => en.event?.id === data.id || en.eventId === data.id)
              : null;
            setEnrollment(mine || null);
          } catch {
            // Non-fatal: if we can't read enrollments, fall back to showing the form
            setEnrollment(null);
          }
        }
      } catch (error) {
        toast.error(getErrorMessage(error, 'Event not found.'));
        navigate('/events');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [slug, navigate, user]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');

    const cleanUtr = utr.trim().toUpperCase();
    // Mirror backend rule (12–22 alphanumeric) for instant, specific feedback
    if (!cleanUtr || !screenshotUrl) {
      return toast.error('Please provide both the UTR number and a payment screenshot.');
    }
    if (!/^[A-Z0-9]{12,22}$/.test(cleanUtr)) {
      return toast.error('UTR must be 12–22 letters or numbers. Please check and try again.');
    }

    setIsSubmitting(true);
    const t = toast.loading('Submitting verification request…');
    try {
      const res = await paymentsService.submitPayment({
        eventId: event.id,
        amount: Number(event.price),
        utr: cleanUtr,
        screenshotUrl,
      });
      toast.success(
        getSuccessMessage(res, 'Payment submitted! Your enrollment is pending verification.'),
        { id: t }
      );
      // Redirect to profile where the pending pass now appears
      navigate('/profile');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Payment submission failed.'), { id: t });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFreeEnrollment = async () => {
    if (!user) return navigate('/login');
    setIsSubmitting(true);
    const t = toast.loading('Securing your spot…');
    try {
      const res = await paymentsService.submitPayment({
        eventId: event.id,
        amount: 0,
        utr: 'FREE',
        screenshotUrl: 'FREE',
      });
      toast.success(getSuccessMessage(res, 'Successfully enrolled!'), { id: t });
      navigate('/profile');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Enrollment failed.'), { id: t });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <BrandLoader label="Loading event…" />;
  if (!event) return null;

  const status = enrollment?.status; // 'PENDING' | 'APPROVED' | 'REJECTED' | undefined

  return (
    <div
      className="w-full animate-in fade-in duration-500"
      style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
    >
      {/* ════════════════════════════════════
          HERO — full-bleed image w/ overlay
      ════════════════════════════════════ */}
      <div className="relative w-full h-[42vh] min-h-[320px] max-h-[480px] overflow-hidden">
        <img src={event.thumbnail || FALLBACK_IMG} alt={event.title} className="w-full h-full object-cover" />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(5,12,14,0.92) 0%, rgba(5,12,14,0.45) 45%, rgba(5,12,14,0.25) 100%)' }}
        />

        {/* Back button */}
        <div className="absolute top-5 left-0 right-0">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => navigate('/events')}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-white/80 hover:text-white transition-colors bg-black/20 backdrop-blur-sm px-3.5 py-2 rounded-full group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              All Events
            </button>
          </div>
        </div>

        {/* Title block */}
        <div className="absolute bottom-0 left-0 right-0 pb-8">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-4">
              <span
                className="text-[10px] font-black tracking-[0.12em] uppercase px-3 py-1.5 rounded-full text-white"
                style={{ backgroundColor: ACCENT }}
              >
                {event.type}
              </span>
              {event.isFree ? (
                <span
                  className="text-[10px] font-black tracking-[0.12em] uppercase px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: 'rgba(16,185,129,0.9)', color: '#fff' }}
                >
                  Free Event
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[12px] font-bold px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white">
                  <IndianRupee size={13} />{event.price}
                </span>
              )}
            </div>
            <h1
              className="text-white tracking-[-0.02em] leading-[1.08] max-w-[800px]"
              style={{ fontFamily: "'DM Serif Display', 'Georgia', serif", fontSize: 'clamp(28px, 4.5vw, 52px)', fontWeight: 400 }}
            >
              {event.title}
            </h1>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════
          BODY
      ════════════════════════════════════ */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

          {/* ── Left: details ── */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: Calendar, label: 'Date', value: new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' }) },
                { icon: Clock, label: 'Time', value: new Date(event.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) },
                { icon: event.type === 'ONLINE' ? Video : MapPin, label: event.type === 'ONLINE' ? 'Platform' : 'Venue', value: event.venue },
                { icon: User, label: 'Speaker', value: event.speaker },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-start gap-3 p-4 rounded-[16px] bg-indriya-card dark:bg-indriya-darkCard border border-indriya-border dark:border-indriya-darkBorder"
                >
                  <div className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(12,110,114,0.08)' }}>
                    <Icon size={16} style={{ color: ACCENT }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.1em] text-indriya-muted dark:text-indriya-darkMuted mb-0.5">{label}</p>
                    <p className="text-[14px] font-semibold text-indriya-text dark:text-indriya-darkText leading-snug">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h2
                className="text-indriya-text dark:text-indriya-darkText tracking-[-0.02em] mb-4"
                style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(22px, 2.5vw, 28px)', fontWeight: 400 }}
              >
                About this event
              </h2>
              <div className="text-[15px] text-indriya-muted dark:text-indriya-darkMuted leading-[1.85] whitespace-pre-wrap">
                {event.description}
              </div>
            </div>
          </div>

          {/* ── Right: enrollment panel ── */}
          <div className="lg:col-span-1">
            <div
              className="sticky top-28 bg-indriya-card dark:bg-indriya-darkCard border border-indriya-border dark:border-indriya-darkBorder rounded-[24px] overflow-hidden"
              style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}
            >
              {/* Panel header */}
              <div className="px-6 py-5 border-b border-indriya-border dark:border-indriya-darkBorder" style={{ backgroundColor: 'rgba(12,110,114,0.04)' }}>
                <div className="flex items-center justify-between">
                  <h3 className="text-[17px] font-bold text-indriya-text dark:text-indriya-darkText">
                    {status === 'APPROVED' ? 'Your enrollment'
                      : status === 'PENDING' ? 'Under review'
                      : event.isFree ? 'Reserve your spot' : 'Enroll now'}
                  </h3>
                  {event.isFree ? (
                    <span className="text-[13px] font-black" style={{ color: '#059669', fontFamily: "'DM Serif Display', serif" }}>FREE</span>
                  ) : (
                    <span className="inline-flex items-center gap-0.5 text-[20px]" style={{ color: ACCENT, fontFamily: "'DM Serif Display', serif" }}>
                      <IndianRupee size={17} />{event.price}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6">
                {/* ── 1. Not logged in ── */}
                {!user ? (
                  <div className="flex flex-col items-center text-center py-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(12,110,114,0.08)' }}>
                      <Lock size={20} style={{ color: ACCENT }} />
                    </div>
                    <p className="text-[14px] text-indriya-text dark:text-indriya-darkText font-medium mb-1">Login required</p>
                    <p className="text-[13px] text-indriya-muted dark:text-indriya-darkMuted mb-5 leading-relaxed">
                      Sign in to view payment details and secure your spot.
                    </p>
                    <button
                      onClick={() => navigate('/login')}
                      className="w-full py-3.5 text-white font-bold text-[14px] rounded-[14px] transition-all hover:scale-[0.98]"
                      style={{ backgroundColor: ACCENT, boxShadow: '0 4px 16px rgba(12,110,114,0.25)' }}
                    >
                      Log in to Enroll
                    </button>
                  </div>

                /* ── 2. APPROVED — already enrolled ── */
                ) : status === 'APPROVED' ? (
                  <div className="flex flex-col items-center text-center py-2">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(16,185,129,0.1)' }}>
                      <ShieldCheck size={22} style={{ color: '#059669' }} />
                    </div>
                    <p className="text-[15px] font-bold text-indriya-text dark:text-indriya-darkText mb-1">You're enrolled</p>
                    <p className="text-[13px] text-indriya-muted dark:text-indriya-darkMuted mb-5 leading-relaxed">
                      Your spot is confirmed. See you at the event!
                    </p>
                    {event.type === 'ONLINE' && enrollment?.event?.meetingLink ? (
                      <a
                        href={enrollment.event.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-3.5 text-white font-bold text-[14px] rounded-[14px] transition-all hover:scale-[0.98] inline-flex items-center justify-center gap-2"
                        style={{ backgroundColor: ACCENT, boxShadow: '0 4px 16px rgba(12,110,114,0.25)' }}
                      >
                        <Video size={15} /> Join Live Session
                      </a>
                    ) : event.type === 'ONLINE' ? (
                      <span className="inline-flex items-center gap-1.5 text-[12px] text-indriya-muted dark:text-indriya-darkMuted">
                        <Video size={13} /> Meeting link activates on event day
                      </span>
                    ) : null}
                    <button
                      onClick={() => navigate('/profile')}
                      className="mt-4 text-[13px] font-bold hover:underline" style={{ color: ACCENT }}
                    >
                      View my passes
                    </button>
                  </div>

                /* ── 3. PENDING — block re-payment, show under review ── */
                ) : status === 'PENDING' ? (
                  <div className="flex flex-col items-center text-center py-2">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(217,119,6,0.1)' }}>
                      <Clock size={22} style={{ color: '#d97706' }} />
                    </div>
                    <p className="text-[15px] font-bold text-indriya-text dark:text-indriya-darkText mb-1">Payment under review</p>
                    <p className="text-[13px] text-indriya-muted dark:text-indriya-darkMuted mb-5 leading-relaxed">
                      You've already submitted a payment for this event. Our team is verifying it — you'll be notified once it's approved.
                    </p>
                    <div
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-[14px] text-[13px] font-bold cursor-not-allowed"
                      style={{ backgroundColor: 'rgba(217,119,6,0.1)', color: '#d97706' }}
                    >
                      <Clock size={14} /> Awaiting Verification
                    </div>
                    <button
                      onClick={() => navigate('/profile')}
                      className="mt-4 text-[13px] font-bold hover:underline" style={{ color: ACCENT }}
                    >
                      Track in my passes
                    </button>
                  </div>

                /* ── 4. FREE event (no existing pending/approved) ── */
                ) : event.isFree ? (
                  <div>
                    {status === 'REJECTED' && (
                      <div className="flex items-start gap-3 p-4 rounded-[14px] mb-4 text-[13px]" style={{ backgroundColor: 'rgba(239,68,68,0.08)', color: '#dc2626' }}>
                        <AlertTriangle className="flex-shrink-0 mt-0.5" size={16} />
                        <p className="leading-relaxed">Your previous registration was declined. You can register again below.</p>
                      </div>
                    )}
                    <div className="flex items-start gap-3 p-4 rounded-[14px] mb-5 text-[13px]" style={{ backgroundColor: 'rgba(16,185,129,0.08)', color: '#047857' }}>
                      <CheckCircle className="flex-shrink-0 mt-0.5" size={16} />
                      <p className="leading-relaxed">This event is free. Reserve your spot now — seats are limited.</p>
                    </div>
                    <button
                      onClick={handleFreeEnrollment}
                      disabled={isSubmitting}
                      className="w-full py-4 text-white font-bold text-[15px] rounded-[14px] transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                      style={{ backgroundColor: '#059669', boxShadow: '0 8px 24px rgba(16,185,129,0.25)' }}
                    >
                      {isSubmitting ? 'Securing spot…' : 'Register for Free'}
                    </button>
                  </div>

                /* ── 5. PAID event — show payment form (incl. REJECTED retry) ── */
                ) : (
                  <div className="space-y-5">
                    {status === 'REJECTED' && (
                      <div className="flex items-start gap-3 p-4 rounded-[14px] text-[13px]" style={{ backgroundColor: 'rgba(239,68,68,0.08)', color: '#dc2626' }}>
                        <AlertTriangle className="flex-shrink-0 mt-0.5" size={16} />
                        <p className="leading-relaxed">
                          Your previous payment was declined. Please pay again and submit a <strong>new</strong> UTR below.
                        </p>
                      </div>
                    )}

                    <div className="flex items-start gap-3 p-4 rounded-[14px] text-[13px]" style={{ backgroundColor: 'rgba(12,110,114,0.06)', color: ACCENT }}>
                      <Info className="flex-shrink-0 mt-0.5" size={16} />
                      <p className="leading-relaxed">
                        Scan the QR to pay <strong>₹{event.price}</strong> via UPI, then submit your UTR below.
                      </p>
                    </div>

                    {/* QR code — kept on white for reliable scanning */}
                    <div className="rounded-[18px] p-5 flex flex-col items-center bg-white border border-indriya-border dark:border-indriya-darkBorder">
                      <img src={event.qrCodeUrl} alt="UPI QR Code" className="w-40 h-40 object-contain mb-3 rounded-lg" />
                      <p className="font-mono text-[13px] font-bold text-slate-800 bg-slate-100 px-4 py-1.5 rounded-md tracking-wider">
                        {event.upiId}
                      </p>
                    </div>

                    <form onSubmit={handlePaymentSubmit} className="space-y-4 pt-4 border-t border-indriya-border dark:border-indriya-darkBorder">
                      <div>
                        <label className="block text-[11px] font-black uppercase tracking-[0.1em] text-indriya-muted dark:text-indriya-darkMuted mb-2">
                          UTR / Transaction Reference
                        </label>
                        <input
                          required
                          type="text"
                          minLength={12}
                          maxLength={22}
                          value={utr}
                          onChange={(e) => setUtr(e.target.value)}
                          placeholder="e.g. 312345678901"
                          className="w-full px-4 py-3 bg-indriya-secondary dark:bg-indriya-darkSecondary border border-indriya-border dark:border-indriya-darkBorder rounded-[12px] text-[15px] font-mono text-indriya-text dark:text-white outline-none transition-colors"
                          onFocus={e => (e.target.style.borderColor = ACCENT)}
                          onBlur={e => (e.target.style.borderColor = '')}
                        />
                        <p className="text-[11px] text-indriya-muted dark:text-indriya-darkMuted mt-1.5">
                          12–22 letters or numbers, found in your UPI app.
                        </p>
                      </div>

                      <ImageUploader
                        label="Payment Screenshot"
                        folder="payments"
                        onUploadSuccess={(url) => setScreenshotUrl(url)}
                      />

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 text-white font-bold text-[15px] rounded-[14px] transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                        style={{ backgroundColor: ACCENT, boxShadow: '0 8px 24px rgba(12,110,114,0.25)' }}
                      >
                        {isSubmitting ? 'Submitting…' : 'Submit Payment Info'}
                      </button>
                    </form>
                  </div>
                )}

                {/* Trust footer */}
                <div className="flex items-center justify-center gap-1.5 mt-5 pt-5 border-t border-indriya-border dark:border-indriya-darkBorder">
                  <ShieldCheck size={13} className="text-indriya-muted dark:text-indriya-darkMuted" />
                  <p className="text-[11px] text-indriya-muted dark:text-indriya-darkMuted">
                    Secure enrollment · Verified by IndriyaX
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
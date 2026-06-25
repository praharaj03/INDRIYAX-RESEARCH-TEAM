import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Edit, Sparkles, Calendar, MapPin, Video, User,
  IndianRupee, ArrowLeft, Image as ImageIcon
} from 'lucide-react';
import { eventsService } from './eventsService';
import ImageUploader from '../uploads/ImageUploader';
import BrandLoader from '../../utils/BrandLoader';
import { getErrorMessage, getSuccessMessage } from '../../utils/apiMessage';

const ACCENT = '#d97706';        // amber — signals "editing"
const ACCENT_TINT = 'rgba(217,119,6,0.1)';
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&q=80&w=600';

/* ─── Section wrapper with step number ─── */
function Section({ num, title, subtitle, children }) {
  return (
    <div className="bg-indriya-card dark:bg-indriya-darkCard border border-indriya-border dark:border-indriya-darkBorder rounded-[24px] p-6 sm:p-7">
      <div className="flex items-start gap-4 mb-6">
        <div
          className="w-9 h-9 rounded-[12px] flex items-center justify-center flex-shrink-0 text-[13px] font-black"
          style={{ backgroundColor: ACCENT_TINT, color: ACCENT, fontFamily: "'DM Serif Display', serif" }}
        >
          {num}
        </div>
        <div>
          <h3 className="text-[15px] font-bold text-indriya-text dark:text-indriya-darkText leading-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[12px] text-indriya-muted dark:text-indriya-darkMuted mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

const inputClasses =
  "w-full px-4 py-3 bg-indriya-secondary dark:bg-indriya-darkSecondary border border-indriya-border dark:border-indriya-darkBorder rounded-[12px] text-[14px] text-indriya-text dark:text-white placeholder:text-indriya-muted/60 outline-none transition-colors";
const labelClasses =
  "text-[11px] font-black uppercase tracking-[0.08em] text-indriya-muted dark:text-indriya-darkMuted mb-2 block";

const focusProps = {
  onFocus: e => (e.target.style.borderColor = ACCENT),
  onBlur: e => (e.target.style.borderColor = ''),
};

export default function EditEvent() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actualEventId, setActualEventId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    speaker: '',
    venue: '',
    meetingLink: '',
    type: 'OFFLINE',
    date: '',
    isFree: true,
    price: '',
    upiId: '',
    upiNumber: '',
  });

  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await eventsService.getEventBySlug(slug);
        setActualEventId(data.id);
        const formattedDate = data.date ? new Date(data.date).toISOString().slice(0, 16) : '';
        setFormData({
          title: data.title || '',
          description: data.description || '',
          speaker: data.speaker || '',
          type: data.type || 'OFFLINE',
          venue: data.type === 'OFFLINE' ? data.venue : '',
          meetingLink: data.type === 'ONLINE' ? data.meetingLink || data.venue : '',
          date: formattedDate,
          isFree: data.isFree,
          price: data.price || '',
          upiId: data.upiId || '',
          upiNumber: data.upiNumber || '',
        });
        setThumbnailUrl(data.thumbnail || '');
        setQrCodeUrl(data.qrCodeUrl || '');
      } catch (err) {
        toast.error(getErrorMessage(err, 'Failed to load event data.'));
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvent();
  }, [slug, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!thumbnailUrl) return toast.error('Please upload an event thumbnail.');
    if (!formData.isFree && (!formData.price || !qrCodeUrl || !formData.upiId)) {
      return toast.error('Paid events require a Price, UPI ID, and a QR Code.');
    }

    setIsSubmitting(true);
    const t = toast.loading('Updating event…');
    try {
      const finalPayload = {
        ...formData,
        date: formData.date ? new Date(formData.date).toISOString() : undefined,
        price: formData.isFree ? 0 : Number(formData.price),
        thumbnail: thumbnailUrl,
        qrCodeUrl: formData.isFree ? undefined : qrCodeUrl,
        venue: formData.type === 'ONLINE' ? 'Online Event' : formData.venue,
        meetingLink: formData.type === 'ONLINE' ? formData.meetingLink : undefined,
      };
      const res = await eventsService.updateEvent(actualEventId, finalPayload);
      toast.success(getSuccessMessage(res, 'Event updated successfully!'), { id: t });
      navigate('/dashboard');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to update event.'), { id: t });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <BrandLoader label="Loading event…" />;

  return (
    <div
      className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 animate-in fade-in duration-300"
      style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
    >
      {/* ── Header ── */}
      <button
        onClick={() => navigate('/dashboard')}
        className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-indriya-muted dark:text-indriya-darkMuted hover:text-amber-600 transition-colors mb-5 group"
      >
        <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to Dashboard
      </button>

      <div className="flex items-center gap-3 mb-8">
        <div
          className="w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0"
          style={{ backgroundColor: ACCENT_TINT }}
        >
          <Edit size={22} style={{ color: ACCENT }} />
        </div>
        <div>
          <p className="text-[11px] font-black tracking-[0.14em] uppercase text-indriya-muted dark:text-indriya-darkMuted mb-0.5">
            Editing
          </p>
          <h1
            className="text-indriya-text dark:text-indriya-darkText tracking-[-0.02em] line-clamp-1"
            style={{ fontFamily: "'DM Serif Display', 'Georgia', serif", fontSize: 'clamp(26px, 3vw, 34px)', fontWeight: 400 }}
          >
            {formData.title || 'Edit Event'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 items-start">

        {/* ════ LEFT: form sections ════ */}
        <div className="space-y-5 order-2 lg:order-1">

          {/* 01 — Details */}
          <Section num="01" title="Event Details" subtitle="The core information attendees will see.">
            <div className="space-y-5">
              <div>
                <label className={labelClasses}>Event Title</label>
                <input required name="title" value={formData.title} onChange={handleChange} className={inputClasses} {...focusProps} />
              </div>
              <div>
                <label className={labelClasses}>Description</label>
                <textarea required name="description" value={formData.description} onChange={handleChange} className={`${inputClasses} resize-none min-h-[140px]`} {...focusProps} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClasses}>Speaker Name</label>
                  <input required name="speaker" value={formData.speaker} onChange={handleChange} className={inputClasses} {...focusProps} />
                </div>
                <div>
                  <label className={labelClasses}>Date &amp; Time</label>
                  <input required type="datetime-local" name="date" value={formData.date} onChange={handleChange} className={`${inputClasses} dark:[color-scheme:dark]`} {...focusProps} />
                </div>
              </div>
            </div>
          </Section>

          {/* 02 — Logistics */}
          <Section num="02" title="Logistics & Media" subtitle="Where it happens and how it looks.">
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClasses}>Event Type</label>
                  <select name="type" value={formData.type} onChange={handleChange} className={inputClasses} {...focusProps}>
                    <option value="OFFLINE">Offline (in-person)</option>
                    <option value="ONLINE">Online (virtual)</option>
                  </select>
                </div>
                <div>
                  {formData.type === 'OFFLINE' ? (
                    <>
                      <label className={labelClasses}>Venue Address</label>
                      <input required name="venue" value={formData.venue} onChange={handleChange} className={inputClasses} {...focusProps} />
                    </>
                  ) : (
                    <>
                      <label className={labelClasses}>Meeting Link</label>
                      <input required name="meetingLink" value={formData.meetingLink} onChange={handleChange} className={inputClasses} {...focusProps} />
                    </>
                  )}
                </div>
              </div>
              <div>
                <ImageUploader label="Event Thumbnail Cover" folder="events" onUploadSuccess={(url) => setThumbnailUrl(url)} existingImage={thumbnailUrl} />
              </div>
            </div>
          </Section>

          {/* 03 — Ticketing */}
          <Section num="03" title="Ticketing" subtitle="Set pricing and payment details.">
            <div>
              <label className="flex items-center justify-between p-4 rounded-[14px] bg-indriya-secondary dark:bg-indriya-darkSecondary border border-indriya-border dark:border-indriya-darkBorder cursor-pointer mb-4">
                <div>
                  <p className="text-[14px] font-bold text-indriya-text dark:text-indriya-darkText">Free Event</p>
                  <p className="text-[12px] text-indriya-muted dark:text-indriya-darkMuted">No payment required to register.</p>
                </div>
                <span className="relative inline-block w-11 h-6 flex-shrink-0">
                  <input type="checkbox" name="isFree" checked={formData.isFree} onChange={handleChange} className="peer sr-only" />
                  <span className="absolute inset-0 rounded-full bg-gray-300 dark:bg-[#333] transition-colors" style={{ backgroundColor: formData.isFree ? ACCENT : undefined }} />
                  <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform peer-checked:translate-x-5 shadow-sm" />
                </span>
              </label>

              {!formData.isFree && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-[18px] border border-indriya-border dark:border-indriya-darkBorder animate-in fade-in slide-in-from-top-2 duration-300" style={{ backgroundColor: 'rgba(217,119,6,0.04)' }}>
                  <div>
                    <label className={labelClasses}>Price (₹)</label>
                    <input type="number" min="1" name="price" value={formData.price} onChange={handleChange} className={inputClasses} {...focusProps} />
                  </div>
                  <div>
                    <label className={labelClasses}>UPI ID</label>
                    <input name="upiId" value={formData.upiId} onChange={handleChange} className={inputClasses} {...focusProps} />
                  </div>
                  <div className="sm:col-span-2">
                    <ImageUploader label="Upload Payment QR Code" folder="qrcodes" onUploadSuccess={(url) => setQrCodeUrl(url)} existingImage={qrCodeUrl} />
                  </div>
                </div>
              )}
            </div>
          </Section>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-8 py-4 text-white font-bold text-[15px] rounded-[16px] transition-all hover:-translate-y-0.5 disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ backgroundColor: ACCENT, boxShadow: '0 8px 28px rgba(217,119,6,0.30)' }}
          >
            {isSubmitting
              ? <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              : <><Sparkles size={16} /> Save Changes</>}
          </button>
        </div>

        {/* ════ RIGHT: live preview ════ */}
        <div className="order-1 lg:order-2 lg:sticky lg:top-28">
          <p className="text-[11px] font-black tracking-[0.12em] uppercase text-indriya-muted dark:text-indriya-darkMuted mb-3 flex items-center gap-1.5">
            <ImageIcon size={12} /> Live Preview
          </p>
          <div
            className="rounded-[20px] overflow-hidden border border-indriya-border dark:border-indriya-darkBorder bg-indriya-card dark:bg-indriya-darkCard"
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}
          >
            <div className="relative h-44 overflow-hidden bg-indriya-secondary dark:bg-indriya-darkSecondary">
              <img
                src={thumbnailUrl || FALLBACK_IMG}
                alt="preview"
                className="w-full h-full object-cover"
                style={{ opacity: thumbnailUrl ? 1 : 0.4 }}
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,12,14,0.4), transparent 60%)' }} />
              <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[12px] font-bold bg-white/95 dark:bg-indriya-darkCard/95 backdrop-blur-sm">
                {formData.isFree
                  ? <span style={{ color: '#059669' }}>Free</span>
                  : <span className="inline-flex items-center gap-0.5 text-indriya-text dark:text-indriya-darkText"><IndianRupee size={12} />{formData.price || '—'}</span>}
              </span>
              <span
                className="absolute top-3 left-3 inline-flex items-center gap-1 text-[9px] font-black tracking-[0.1em] uppercase px-2.5 py-1 rounded-full text-white"
                style={{ backgroundColor: 'rgba(217,119,6,0.9)' }}
              >
                {formData.type === 'ONLINE' ? <Video size={10} /> : <MapPin size={10} />}
                {formData.type}
              </span>
            </div>

            <div className="p-5">
              <h3
                className="text-[16px] font-bold text-indriya-text dark:text-indriya-darkText leading-snug mb-3 line-clamp-2"
                style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400 }}
              >
                {formData.title || 'Your event title appears here'}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[12px] text-indriya-muted dark:text-indriya-darkMuted">
                  <User size={12} style={{ color: ACCENT }} className="flex-shrink-0" />
                  <span>{formData.speaker || 'Speaker name'}</span>
                </div>
                <div className="flex items-center gap-2 text-[12px] text-indriya-muted dark:text-indriya-darkMuted">
                  <Calendar size={12} style={{ color: ACCENT }} className="flex-shrink-0" />
                  <span>
                    {formData.date
                      ? new Date(formData.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'long', day: 'numeric' })
                      : 'Date not set'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[12px] text-indriya-muted dark:text-indriya-darkMuted">
                  {formData.type === 'ONLINE'
                    ? <Video size={12} style={{ color: ACCENT }} className="flex-shrink-0" />
                    : <MapPin size={12} style={{ color: ACCENT }} className="flex-shrink-0" />}
                  <span className="line-clamp-1">
                    {formData.type === 'ONLINE'
                      ? (formData.meetingLink ? 'Online Event' : 'Online — link pending')
                      : (formData.venue || 'Venue address')}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-indriya-muted dark:text-indriya-darkMuted mt-3 text-center leading-relaxed">
            Changes reflect here before you save.
          </p>
        </div>
      </form>
    </div>
  );
}
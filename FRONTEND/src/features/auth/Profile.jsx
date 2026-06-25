import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Calendar, ShieldCheck, Video, ExternalLink, Clock, AlertTriangle,
  Mail, Ticket, BadgeCheck, Settings, Check, User
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { authService } from './authService';
import ImageUploader from '../uploads/ImageUploader';
import BrandLoader from '../../utils/BrandLoader';
import { getErrorMessage, getSuccessMessage } from '../../utils/apiMessage';

const ACCENT = '#0C6E72';
const FALLBACK_EVENT_IMG = 'https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&q=80&w=200';

/* ─── Avatar with initials fallback ─── */
function Avatar({ url, name, size = 96 }) {
  const [err, setErr] = useState(false);
  const initials = (name || 'U')
    .split(/\s+/).slice(0, 2).map(p => p[0]).join('').toUpperCase();
  const show = url && !err;
  return (
    <div
      className="rounded-[20px] overflow-hidden flex items-center justify-center flex-shrink-0"
      style={{
        width: size, height: size,
        backgroundColor: show ? 'transparent' : 'rgba(255,255,255,0.15)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
        border: '2px solid rgba(255,255,255,0.25)',
      }}
    >
      {show ? (
        <img src={url} alt={name} className="w-full h-full object-cover" onError={() => setErr(true)} />
      ) : (
        <span className="font-bold text-white" style={{ fontSize: size * 0.34 }}>{initials}</span>
      )}
    </div>
  );
}

/* ─── Status config ─── */
const STATUS = {
  PENDING: { label: 'Pending Review', icon: Clock, color: '#d97706', bg: 'rgba(217,119,6,0.1)' },
  REJECTED: { label: 'Not Approved', icon: AlertTriangle, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  APPROVED: { label: 'Verified Access', icon: ShieldCheck, color: '#059669', bg: 'rgba(16,185,129,0.1)' },
};

export default function Profile() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.imageUrl || '');
  // The photo the profile currently has on the server, to detect changes.
  const originalAvatar = user?.imageUrl || '';

  const fetchUserEnrollments = async () => {
    try {
      const data = await authService.getMyEnrollments();
      setEnrollments(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to load your event enrollments.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchUserEnrollments(); }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const trimmed = fullName.trim();
    // Mirror backend rules (2–100 chars) so the user gets instant, specific feedback
    if (!trimmed) return toast.error('Name cannot be empty.');
    if (trimmed.length < 2) return toast.error('Name must be at least 2 characters.');
    if (trimmed.length > 100) return toast.error('Name must be 100 characters or fewer.');

    setIsUpdating(true);
    const t = toast.loading('Updating your profile…');
    try {
      // PATCH /api/v1/auth/me — at least one field required; unknown fields rejected.
      // Decide the imageUrl intent by comparing against the original:
      //   - unchanged        -> omit imageUrl  (keep current photo)
      //   - now empty (was set) -> imageUrl: null  (remove photo + server deletes old file)
      //   - new non-empty url -> imageUrl: <url>   (set / replace)
      const payload = { fullName: trimmed };

      if (avatarUrl !== originalAvatar) {
        payload.imageUrl = avatarUrl ? avatarUrl : null; // '' -> null (remove)
      }

      const res = await authService.updateProfile(payload);
      toast.success(getSuccessMessage(res, 'Profile updated successfully.'), { id: t });

      // Reload so the global header context picks up the new name/avatar
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Profile update failed.'), { id: t });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <BrandLoader label="Loading your profile…" />;

  const name = user?.fullName || user?.name || 'Member';
  const role = user?.role || 'MEMBER';
  const roleLabel = { ADMIN: 'Administrator', AUTHOR: 'Author', USER: 'Member', MEMBER: 'Member' }[role] || role;

  const approvedCount = enrollments.filter(e => e.status === 'APPROVED').length;
  const pendingCount = enrollments.filter(e => e.status === 'PENDING').length;

  return (
    <div
      className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 animate-in fade-in duration-500"
      style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
    >

      {/* ════════════════════════════════════
          MEMBER PASSPORT BANNER
      ════════════════════════════════════ */}
      <div
        className="relative rounded-[28px] overflow-hidden mb-6"
        style={{
          background: 'linear-gradient(135deg, #0a4a4d 0%, #0C6E72 55%, #0f8a8e 100%)',
          boxShadow: '0 20px 60px rgba(12,110,114,0.30)',
        }}
      >
        {/* Topography watermark */}
        <div className="absolute inset-0 flex items-center justify-end pointer-events-none pr-8 opacity-[0.12]">
          <svg viewBox="0 0 400 400" className="w-[360px] h-[360px]" fill="none">
            {[40, 75, 110, 145, 180].map(r => (
              <circle key={r} cx="200" cy="200" r={r} stroke="#fff" strokeWidth="1.5" />
            ))}
            <line x1="200" y1="40" x2="200" y2="360" stroke="#fff" strokeWidth="0.8" strokeDasharray="4 4" />
            <line x1="40" y1="200" x2="360" y2="200" stroke="#fff" strokeWidth="0.8" strokeDasharray="4 4" />
          </svg>
        </div>

        <div className="relative z-10 p-6 sm:p-9">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-7">
            <Avatar url={avatarUrl} name={name} size={96} />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black tracking-[0.16em] uppercase text-white/60">
                  IndriyaX Member
                </span>
                <BadgeCheck size={14} className="text-white/70" />
              </div>
              <h1
                className="text-white tracking-[-0.02em] leading-tight mb-3 truncate"
                style={{ fontFamily: "'DM Serif Display', 'Georgia', serif", fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 400 }}
              >
                {name}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.06em] uppercase px-3 py-1.5 rounded-full bg-white/15 text-white backdrop-blur-sm">
                  {roleLabel}
                </span>
                {user?.email && (
                  <span className="inline-flex items-center gap-1.5 text-[12px] text-white/70 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm">
                    <Mail size={12} /> {user.email}
                  </span>
                )}
              </div>
            </div>

            {/* Settings toggle */}
            <button
              onClick={() => setShowSettings(s => !s)}
              className="self-start sm:self-center inline-flex items-center gap-2 text-[13px] font-bold px-5 py-3 rounded-full bg-white transition-all hover:scale-[0.97] flex-shrink-0"
              style={{ color: ACCENT }}
            >
              <Settings size={15} />
              {showSettings ? 'Close' : 'Edit Profile'}
            </button>
          </div>

          {/* Stat strip */}
          <div className="grid grid-cols-3 gap-3 mt-7 pt-6 border-t border-white/15">
            {[
              { label: 'Event Passes', value: enrollments.length, icon: Ticket },
              { label: 'Verified', value: approvedCount, icon: ShieldCheck },
              { label: 'Pending', value: pendingCount, icon: Clock },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[10px] bg-white/15 flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-bold leading-none" style={{ fontFamily: "'DM Serif Display', serif", fontSize: '22px' }}>
                    {value}
                  </p>
                  <p className="text-[11px] text-white/60 mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════
          SETTINGS PANEL (collapsible)
      ════════════════════════════════════ */}
      {showSettings && (
        <div className="mb-6 animate-in slide-in-from-top-2 fade-in duration-300">
          <div
            className="bg-indriya-card dark:bg-indriya-darkCard border border-indriya-border dark:border-indriya-darkBorder rounded-[24px] p-6 sm:p-8"
            style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: 'rgba(12,110,114,0.1)' }}>
                <Settings size={16} style={{ color: ACCENT }} />
              </div>
              <h3 className="text-[16px] font-bold text-indriya-text dark:text-indriya-darkText">
                Account Settings
              </h3>
            </div>

            <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
              {/* Avatar uploader */}
              <div>
                <ImageUploader
                  label="Profile Picture"
                  folder="avatars"
                  currentImageUrl={avatarUrl}
                  onUploadSuccess={(url) => setAvatarUrl(url)}
                />
              </div>

              {/* Fields */}
              <div className="space-y-5">
                <div>
                  <label className="block text-[12px] font-bold uppercase tracking-[0.06em] text-indriya-muted dark:text-indriya-darkMuted mb-2">
                    Full Name
                  </label>
                  <input
                    required
                    type="text"
                    value={fullName}
                    maxLength={100}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 bg-indriya-secondary dark:bg-indriya-darkSecondary border border-indriya-border dark:border-indriya-darkBorder rounded-[12px] text-[14px] text-indriya-text dark:text-indriya-darkText outline-none transition-colors"
                    onFocus={e => (e.target.style.borderColor = ACCENT)}
                    onBlur={e => (e.target.style.borderColor = '')}
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold uppercase tracking-[0.06em] text-indriya-muted dark:text-indriya-darkMuted mb-2">
                    Email Address
                  </label>
                  <input
                    type="text"
                    disabled
                    value={user?.email || ''}
                    className="w-full px-4 py-3 bg-indriya-secondary/60 dark:bg-indriya-darkSecondary/60 border border-indriya-border dark:border-indriya-darkBorder rounded-[12px] text-[14px] text-indriya-muted dark:text-indriya-darkMuted cursor-not-allowed"
                  />
                  <p className="text-[11px] text-indriya-muted dark:text-indriya-darkMuted mt-1.5 flex items-center gap-1">
                    <ShieldCheck size={11} /> Managed securely — cannot be changed here.
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="inline-flex items-center gap-2 text-white text-[14px] font-bold px-6 py-3 rounded-full transition-all hover:scale-[0.97] disabled:opacity-70"
                    style={{ backgroundColor: ACCENT, boxShadow: '0 4px 16px rgba(12,110,114,0.25)' }}
                  >
                    {isUpdating ? 'Saving…' : (<><Check size={15} /> Save Changes</>)}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSettings(false)}
                    className="text-[13px] font-semibold text-indriya-muted dark:text-indriya-darkMuted hover:text-indriya-text dark:hover:text-indriya-darkText transition-colors px-3 py-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════
          EVENT PASSES — boarding-pass tickets
      ════════════════════════════════════ */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: 'rgba(12,110,114,0.1)' }}>
          <Ticket size={16} style={{ color: ACCENT }} />
        </div>
        <h2 className="text-[18px] font-bold text-indriya-text dark:text-indriya-darkText">
          My Event Passes
        </h2>
        {enrollments.length > 0 && (
          <span
            className="text-[11px] font-black px-2 py-0.5 rounded-full"
            style={{ backgroundColor: 'rgba(12,110,114,0.1)', color: ACCENT }}
          >
            {enrollments.length}
          </span>
        )}
      </div>

      {enrollments.length === 0 ? (
        <div
          className="bg-indriya-card dark:bg-indriya-darkCard border border-indriya-border dark:border-indriya-darkBorder rounded-[24px] px-6 py-16 text-center"
          style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}
        >
          <div
            className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(12,110,114,0.08)' }}
          >
            <Ticket size={26} style={{ color: ACCENT }} />
          </div>
          <p className="text-[15px] font-bold text-indriya-text dark:text-indriya-darkText mb-1.5">
            No event passes yet
          </p>
          <p className="text-[13px] text-indriya-muted dark:text-indriya-darkMuted max-w-[360px] mx-auto leading-[1.7]">
            You haven't registered for any workshops or events. Browse upcoming sessions to reserve your spot.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {enrollments.map((ticket) => {
            const cfg = STATUS[ticket.status] || STATUS.PENDING;
            const StatusIcon = cfg.icon;
            return (
              <div
                key={ticket.id}
                className="group relative bg-indriya-card dark:bg-indriya-darkCard border border-indriya-border dark:border-indriya-darkBorder rounded-[20px] overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
                style={{ boxShadow: '0 2px 14px rgba(0,0,0,0.05)' }}
              >
                {/* Status accent bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: cfg.color }} />

                <div className="p-5 pl-6">
                  <div className="flex gap-4">
                    {/* Event thumbnail */}
                    <div className="relative w-20 h-20 rounded-[14px] overflow-hidden flex-shrink-0">
                      <img
                        src={ticket.event?.thumbnail || FALLBACK_EVENT_IMG}
                        alt={ticket.event?.title || 'Event'}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Event info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[15px] text-indriya-text dark:text-indriya-darkText leading-snug mb-1 truncate">
                        {ticket.event?.title}
                      </h4>
                      {ticket.event?.speaker && (
                        <p className="text-[12px] text-indriya-muted dark:text-indriya-darkMuted mb-2 truncate">
                          Speaker: {ticket.event.speaker}
                        </p>
                      )}
                      {ticket.event?.date && (
                        <div className="flex items-center gap-1.5 text-[12px] text-indriya-muted dark:text-indriya-darkMuted">
                          <Calendar size={12} style={{ color: ACCENT }} />
                          <span>
                            {new Date(ticket.event.date).toLocaleDateString('en-IN', {
                              month: 'short', day: 'numeric', year: 'numeric',
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Perforated divider */}
                  <div className="relative my-4">
                    <div className="border-t border-dashed border-indriya-border dark:border-indriya-darkBorder" />
                    <div className="absolute -left-7 -top-2 w-4 h-4 rounded-full bg-indriya-bg dark:bg-indriya-darkBg" />
                    <div className="absolute -right-7 -top-2 w-4 h-4 rounded-full bg-indriya-bg dark:bg-indriya-darkBg" />
                  </div>

                  {/* Status + action row */}
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.06em] px-3 py-1.5 rounded-full"
                      style={{ backgroundColor: cfg.bg, color: cfg.color }}
                    >
                      <StatusIcon size={13} /> {cfg.label}
                    </span>

                    {/* meetingLink is only present when APPROVED (per API contract) */}
                    {ticket.status === 'APPROVED' && ticket.event?.meetingLink ? (
                      <a
                        href={ticket.event.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-[13px] font-bold px-4 py-2 rounded-full text-white transition-all hover:scale-[0.97]"
                        style={{ backgroundColor: ACCENT }}
                      >
                        Join Live <ExternalLink size={13} />
                      </a>
                    ) : ticket.status === 'APPROVED' ? (
                      <span className="inline-flex items-center gap-1.5 text-[12px] text-indriya-muted dark:text-indriya-darkMuted">
                        <Video size={13} /> Link on event day
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
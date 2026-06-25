import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Video, IndianRupee, ArrowRight, ArrowUpRight, Users, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { eventsService } from './eventsService';
import BrandLoader from '../../utils/BrandLoader';
import { getErrorMessage } from '../../utils/apiMessage';

const ACCENT = '#0C6E72';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&q=80&w=900';

/* ─── Date helpers ─── */
const fmtDate = (d, opts) => new Date(d).toLocaleDateString('en-IN', opts);

function DateBlock({ date }) {
  const d = new Date(date);
  return (
    <div
      className="flex flex-col items-center justify-center rounded-[14px] w-14 h-14 flex-shrink-0"
      style={{ backgroundColor: 'rgba(12,110,114,0.08)' }}
    >
      <span className="text-[10px] font-black uppercase tracking-[0.08em]" style={{ color: ACCENT }}>
        {d.toLocaleDateString('en-IN', { month: 'short' })}
      </span>
      <span
        className="leading-none"
        style={{ fontFamily: "'DM Serif Display', serif", fontSize: '22px', color: ACCENT }}
      >
        {d.getDate()}
      </span>
    </div>
  );
}

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventsService.getAllEvents();
        setEvents(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error(getErrorMessage(error, 'Failed to load upcoming events.'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'ALL') return events;
    if (filter === 'FREE') return events.filter(e => e.isFree);
    if (filter === 'ONLINE') return events.filter(e => e.type === 'ONLINE');
    if (filter === 'OFFLINE') return events.filter(e => e.type !== 'ONLINE');
    return events;
  }, [events, filter]);

  const [featured, ...rest] = filtered;

  if (isLoading) return <BrandLoader label="Loading events…" />;

  return (
    <div
      className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-in fade-in duration-500"
      style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
    >
      {/* ── Header ── */}
      <div className="mb-8">
        <p className="text-[11px] font-black tracking-[0.16em] uppercase mb-3" style={{ color: ACCENT }}>
          Events & Workshops
        </p>
        <h1
          className="text-indriya-text dark:text-indriya-darkText tracking-[-0.03em] leading-[1.05] mb-3"
          style={{ fontFamily: "'DM Serif Display', 'Georgia', serif", fontSize: 'clamp(34px, 5vw, 56px)', fontWeight: 400 }}
        >
          Learn from the<br />
          <span className="italic" style={{ color: ACCENT }}>best in vision care.</span>
        </h1>
        <p className="text-[16px] text-indriya-muted dark:text-indriya-darkMuted leading-[1.7] max-w-[520px]">
          Expert-led workshops, live webinars, and hands-on seminars to advance your optometry career.
        </p>
      </div>

      {/* ── Filter strip ── */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1 -mx-1 px-1">
        {[
          { id: 'ALL', label: 'All Events' },
          { id: 'FREE', label: 'Free' },
          { id: 'ONLINE', label: 'Online' },
          { id: 'OFFLINE', label: 'In-Person' },
        ].map(({ id, label }) => {
          const active = filter === id;
          return (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-[13px] font-bold transition-all duration-200 border ${
                active
                  ? 'border-transparent'
                  : 'border-indriya-border dark:border-indriya-darkBorder text-indriya-muted dark:text-indriya-darkMuted hover:text-indriya-text dark:hover:text-indriya-darkText'
              }`}
              style={active ? { backgroundColor: ACCENT, color: '#fff' } : {}}
            >
              {label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div
          className="bg-indriya-card dark:bg-indriya-darkCard border border-indriya-border dark:border-indriya-darkBorder rounded-[24px] px-6 py-20 text-center"
        >
          <div
            className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(12,110,114,0.08)' }}
          >
            <Calendar size={26} style={{ color: ACCENT }} />
          </div>
          <p className="text-[15px] font-bold text-indriya-text dark:text-indriya-darkText mb-1.5">
            No events found
          </p>
          <p className="text-[13px] text-indriya-muted dark:text-indriya-darkMuted">
            {filter === 'ALL' ? 'Check back soon for upcoming sessions.' : 'Try a different filter.'}
          </p>
        </div>
      ) : (
        <>
          {/* ── FEATURED — large horizontal card ── */}
          {featured && (
            <Link
              to={`/events/${featured.slug}`}
              className="group block mb-6 rounded-[24px] overflow-hidden border border-indriya-border dark:border-indriya-darkBorder bg-indriya-card dark:bg-indriya-darkCard transition-all duration-500 hover:-translate-y-1"
              style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr]">
                {/* Image */}
                <div className="relative h-56 lg:h-auto min-h-[280px] overflow-hidden">
                  <img
                    src={featured.thumbnail || FALLBACK_IMG}
                    alt={featured.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 lg:hidden"
                    style={{ background: 'linear-gradient(to top, rgba(5,12,14,0.5), transparent 60%)' }}
                  />
                  {/* Featured badge */}
                  <span
                    className="absolute top-4 left-4 inline-flex items-center gap-1.5 text-[10px] font-black tracking-[0.12em] uppercase px-3 py-1.5 rounded-full text-white"
                    style={{ backgroundColor: ACCENT }}
                  >
                    Next Up
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className="text-[10px] font-black tracking-[0.12em] uppercase px-2.5 py-1 rounded-full"
                      style={{ color: ACCENT, backgroundColor: 'rgba(12,110,114,0.08)' }}
                    >
                      {featured.type}
                    </span>
                    {featured.isFree ? (
                      <span
                        className="text-[10px] font-black tracking-[0.12em] uppercase px-2.5 py-1 rounded-full"
                        style={{ color: '#059669', backgroundColor: 'rgba(16,185,129,0.1)' }}
                      >
                        Free
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 text-[12px] font-bold text-indriya-text dark:text-indriya-darkText">
                        <IndianRupee size={13} />{featured.price}
                      </span>
                    )}
                  </div>

                  <h2
                    className="text-indriya-text dark:text-indriya-darkText tracking-[-0.02em] leading-tight mb-4 group-hover:text-[#0C6E72] dark:group-hover:text-[#3fb3b8] transition-colors"
                    style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(22px, 2.8vw, 32px)', fontWeight: 400 }}
                  >
                    {featured.title}
                  </h2>

                  <div className="flex flex-col gap-2.5 mb-6">
                    <div className="flex items-center gap-2.5 text-[14px] text-indriya-muted dark:text-indriya-darkMuted">
                      <Calendar size={15} style={{ color: ACCENT }} className="flex-shrink-0" />
                      <span>
                        {fmtDate(featured.date, { weekday: 'long', month: 'long', day: 'numeric' })}
                        {' · '}
                        {new Date(featured.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 text-[14px] text-indriya-muted dark:text-indriya-darkMuted">
                      {featured.type === 'ONLINE'
                        ? <Video size={15} style={{ color: ACCENT }} className="flex-shrink-0" />
                        : <MapPin size={15} style={{ color: ACCENT }} className="flex-shrink-0" />}
                      <span className="line-clamp-1">{featured.venue}</span>
                    </div>
                  </div>

                  <span
                    className="inline-flex items-center gap-2 text-[14px] font-bold w-fit"
                    style={{ color: ACCENT }}
                  >
                    View details & enroll
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* ── REST — compact grid ── */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map((event) => (
                <Link
                  key={event.id}
                  to={`/events/${event.slug}`}
                  className="group flex flex-col rounded-[20px] overflow-hidden border border-indriya-border dark:border-indriya-darkBorder bg-indriya-card dark:bg-indriya-darkCard transition-all duration-300 hover:-translate-y-1"
                  style={{ boxShadow: '0 2px 14px rgba(0,0,0,0.05)' }}
                >
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={event.thumbnail || FALLBACK_IMG}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(to top, rgba(5,12,14,0.35), transparent 55%)' }}
                    />
                    {/* Price/free badge */}
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[12px] font-bold bg-white/95 dark:bg-indriya-darkCard/95 backdrop-blur-sm">
                      {event.isFree ? (
                        <span style={{ color: '#059669' }}>Free</span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 text-indriya-text dark:text-indriya-darkText">
                          <IndianRupee size={12} />{event.price}
                        </span>
                      )}
                    </span>
                    {/* Type chip */}
                    <span
                      className="absolute top-3 left-3 inline-flex items-center gap-1 text-[9px] font-black tracking-[0.1em] uppercase px-2.5 py-1 rounded-full text-white"
                      style={{ backgroundColor: 'rgba(12,110,114,0.9)' }}
                    >
                      {event.type === 'ONLINE' ? <Video size={10} /> : <MapPin size={10} />}
                      {event.type}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex gap-3 mb-4">
                      <DateBlock date={event.date} />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[15px] font-bold text-indriya-text dark:text-indriya-darkText leading-snug line-clamp-2 mb-1 group-hover:text-[#0C6E72] dark:group-hover:text-[#3fb3b8] transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-[12px] text-indriya-muted dark:text-indriya-darkMuted flex items-center gap-1">
                          <Clock size={11} />
                          {new Date(event.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[12px] text-indriya-muted dark:text-indriya-darkMuted mb-5">
                      {event.type === 'ONLINE'
                        ? <Video size={12} className="flex-shrink-0" style={{ color: ACCENT }} />
                        : <MapPin size={12} className="flex-shrink-0" style={{ color: ACCENT }} />}
                      <span className="line-clamp-1">{event.venue}</span>
                    </div>

                    <div className="mt-auto pt-4 border-t border-indriya-border dark:border-indriya-darkBorder">
                      <span
                        className="inline-flex items-center justify-between w-full text-[13px] font-bold group-hover:gap-1 transition-all"
                        style={{ color: ACCENT }}
                      >
                        View Details
                        <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
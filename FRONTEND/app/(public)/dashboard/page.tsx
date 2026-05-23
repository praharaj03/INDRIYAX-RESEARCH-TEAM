"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import AnimateIn from "@/components/ui/AnimateIn";
import {
  RiCalendarEventLine, RiUserLine, RiMailLine,
  RiCheckboxCircleLine, RiTimeLine, RiCloseCircleLine,
  RiMapPinLine, RiMicLine, RiArrowRightLine, RiShieldUserLine,
  RiVideoLine,
} from "react-icons/ri";
import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/services/authService";
import { apiFetch } from "@/lib/api";

interface UserProfile {
  fullName?: string;
  email: string;
  role: string;
}

interface Enrollment {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  event: {
    id: string;
    slug: string;
    title: string;
    thumbnail: string;
    date: string;
    venue: string;
    type: string;
    price: number;
    speaker: string;
    meetingLink?: string;
  };
}

const statusConfig = {
  PENDING:  { label: "Pending Verification", icon: RiTimeLine,            cls: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  APPROVED: { label: "Confirmed",            icon: RiCheckboxCircleLine,  cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  REJECTED: { label: "Rejected",             icon: RiCloseCircleLine,     cls: "bg-red-500/10 text-red-400 border-red-500/20" },
};

export default function DashboardPage() {
  const [user, setUser]               = useState<UserProfile | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const session = await getSession();
        if (!session) return;

        const [profileRes, enrollRes] = await Promise.all([
          apiFetch("/api/v1/auth/me", {}, session.access_token),
          apiFetch("/api/v1/auth/my-enrollments", {}, session.access_token),
        ]);

        setUser(profileRes.data);
        setEnrollments(enrollRes.data ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-600">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">Please sign in to view your dashboard.</p>
        <Link href="/login" className="text-primary hover:underline">Sign in →</Link>
      </div>
    );
  }

  const upcoming = enrollments.filter(e => new Date(e.event.date) >= new Date());
  const past     = enrollments.filter(e => new Date(e.event.date) <  new Date());

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">

      {/* Header */}
      <AnimateIn>
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <RiShieldUserLine size={12} /> My Dashboard
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-text)]">
            Welcome, {user.fullName ?? user.email} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">Your registrations and profile</p>
        </div>
      </AnimateIn>

      {/* Stats + Profile row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Profile card */}
        <AnimateIn delay={0.05}>
          <div className="bg-dark-3 border border-border rounded-2xl p-5 h-full">
            <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-4">Profile</p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <RiUserLine className="text-primary shrink-0" size={14} />
                <span className="truncate">{user.fullName ?? "—"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <RiMailLine className="text-primary shrink-0" size={14} />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <RiShieldUserLine className="text-primary shrink-0" size={14} />
                <span className="capitalize">{user.role.toLowerCase()}</span>
              </div>
            </div>
          </div>
        </AnimateIn>

        {/* Stat cards */}
        {[
          { label: "Total Enrolled",  value: enrollments.length,                                  color: "text-primary",      bg: "bg-primary/10" },
          { label: "Confirmed",       value: enrollments.filter(e => e.status === "APPROVED").length, color: "text-emerald-400", bg: "bg-emerald-500/10" },
        ].map(({ label, value, color, bg }, i) => (
          <AnimateIn key={label} delay={0.08 + i * 0.04}>
            <div className="bg-dark-3 border border-border rounded-2xl p-5 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                <RiCalendarEventLine size={18} className={color} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-gray-500 text-xs mt-0.5">{label}</p>
              </div>
            </div>
          </AnimateIn>
        ))}
      </div>

      {/* Upcoming enrollments */}
      <AnimateIn delay={0.15}>
        <div className="bg-dark-3 border border-border rounded-2xl overflow-hidden mb-6">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="text-[var(--color-text)] font-semibold text-sm">Upcoming Events</h3>
            <span className="text-xs text-gray-600">{upcoming.length} registered</span>
          </div>

          {upcoming.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-gray-600 text-sm mb-3">No upcoming registrations</p>
              <Link href="/events/upcoming"
                className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                Browse upcoming events <RiArrowRightLine size={13} />
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {upcoming.map((enr) => (
                <EnrollmentRow key={enr.id} enr={enr} />
              ))}
            </div>
          )}
        </div>
      </AnimateIn>

      {/* Past enrollments */}
      {past.length > 0 && (
        <AnimateIn delay={0.2}>
          <div className="bg-dark-3 border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="text-[var(--color-text)] font-semibold text-sm">Past Events</h3>
            </div>
            <div className="divide-y divide-border">
              {past.map((enr) => (
                <EnrollmentRow key={enr.id} enr={enr} isPast />
              ))}
            </div>
          </div>
        </AnimateIn>
      )}
    </div>
  );
}

function EnrollmentRow({ enr, isPast = false }: { enr: Enrollment; isPast?: boolean }) {
  const { label, icon: Icon, cls } = statusConfig[enr.status];
  const isUpcoming = new Date(enr.event.date) >= new Date();
  const showJoinButton =
    enr.status === "APPROVED" &&
    isUpcoming &&
    enr.event.meetingLink;

  return (
    <div className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors">
      {/* Thumbnail */}
      <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-border shrink-0">
        <Image src={enr.event.thumbnail} alt={enr.event.title} fill className="object-cover" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[var(--color-text)] text-sm font-medium truncate">{enr.event.title}</p>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <RiCalendarEventLine size={11} className="text-primary/60" />
            {new Date(enr.event.date).toDateString()}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <RiMapPinLine size={11} className="text-primary/60" />
            {enr.event.venue}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <RiMicLine size={11} className="text-primary/60" />
            {enr.event.speaker}
          </span>
        </div>
      </div>

      {/* Status + actions */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${cls}`}>
          <Icon size={11} /> {label}
        </span>
        {showJoinButton ? (
          <a
            href={enr.event.meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-lg hover:bg-emerald-500/20 transition-colors font-medium"
          >
            <RiVideoLine size={11} /> Join Meeting
          </a>
        ) : (
          <Link href={`/events/${enr.event.slug}`}
            className="text-xs text-gray-600 hover:text-primary transition-colors flex items-center gap-0.5">
            View <RiArrowRightLine size={11} />
          </Link>
        )}
      </div>
    </div>
  );
}

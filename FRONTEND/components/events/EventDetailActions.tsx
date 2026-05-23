"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  RiPlayCircleLine, RiTimeLine, RiMoneyDollarCircleLine,
  RiCalendarCheckLine, RiVideoLine, RiLoader4Line,
  RiCheckboxCircleLine, RiClockLine,
} from "react-icons/ri";
import type { Event } from "@/types/event";
import { getSession } from "@/services/authService";
import { apiFetch } from "@/lib/api";

interface Enrollment {
  status: "PENDING" | "APPROVED" | "REJECTED";
  event: { meetingLink?: string };
}

export default function EventDetailActions({ event }: { event: Event }) {
  const isPast = new Date(event.date) < new Date();

  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkEnrollment() {
      try {
        const session = await getSession();
        if (!session) return;
        const res = await apiFetch("/api/v1/auth/my-enrollments", {}, session.access_token);
        const enrollments: Enrollment[] = res.data ?? [];
        const match = enrollments.find(
          (e: any) => e.event?.id === event.id || e.event?.slug === event.slug
        );
        setEnrollment(match ?? null);
      } catch {
        // not logged in or error — treat as unenrolled
      } finally {
        setLoading(false);
      }
    }
    checkEnrollment();
  }, [event.id, event.slug]);

  // ── Past event ──────────────────────────────────────────────────────────
  if (isPast) {
    return event.recordingLink ? (
      <a
        href={event.recordingLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-primary text-dark font-semibold px-6 py-3 rounded-xl hover:bg-primary/80 transition-all shadow-lg shadow-primary/25"
      >
        <RiPlayCircleLine size={18} /> Watch Recording
      </a>
    ) : (
      <div className="inline-flex items-center gap-2 text-gray-600 text-sm border border-border px-4 py-2.5 rounded-xl">
        <RiTimeLine /> Recording coming soon...
      </div>
    );
  }

  // ── Loading enrollment status ────────────────────────────────────────────
  if (loading) {
    return (
      <div className="inline-flex items-center gap-2 text-gray-500 text-sm border border-border px-4 py-2.5 rounded-xl">
        <RiLoader4Line size={16} className="animate-spin" /> Checking enrollment...
      </div>
    );
  }

  // ── Already enrolled ─────────────────────────────────────────────────────
  if (enrollment) {
    if (enrollment.status === "APPROVED") {
      const meetingLink = enrollment.event?.meetingLink ?? (event as any).meetingLink;
      if (meetingLink) {
        return (
          <a
            href={meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/25"
          >
            <RiVideoLine size={18} /> Join Meeting
          </a>
        );
      }
      return (
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-medium px-4 py-2.5 rounded-xl">
          <RiCheckboxCircleLine size={16} /> Enrollment Confirmed
        </div>
      );
    }

    if (enrollment.status === "PENDING") {
      return (
        <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-sm font-medium px-4 py-2.5 rounded-xl">
          <RiClockLine size={16} /> Payment under review
        </div>
      );
    }

    // REJECTED — allow re-enrollment
    return (
      <Link
        href={`/events/${event.slug}/enroll`}
        className="inline-flex items-center gap-2 bg-primary text-dark font-semibold px-6 py-3 rounded-xl hover:bg-primary/80 transition-all shadow-lg shadow-primary/25"
      >
        {event.price > 0 ? (
          <><RiMoneyDollarCircleLine size={18} /> Re-enroll — ₹{event.price}</>
        ) : (
          <><RiCalendarCheckLine size={18} /> Register Again</>
        )}
      </Link>
    );
  }

  // ── Not enrolled ─────────────────────────────────────────────────────────
  if (event.price > 0) {
    return (
      <Link
        href={`/events/${event.slug}/enroll`}
        className="inline-flex items-center gap-2 bg-primary text-dark font-semibold px-6 py-3 rounded-xl hover:bg-primary/80 transition-all shadow-lg shadow-primary/25"
      >
        <RiMoneyDollarCircleLine size={18} /> Enroll — ₹{event.price}
      </Link>
    );
  }

  return (
    <Link
      href={`/events/${event.slug}/enroll`}
      className="inline-flex items-center gap-2 bg-primary text-dark font-semibold px-6 py-3 rounded-xl hover:bg-primary/80 transition-all shadow-lg shadow-primary/25"
    >
      <RiCalendarCheckLine size={18} /> Register for Free
    </Link>
  );
}

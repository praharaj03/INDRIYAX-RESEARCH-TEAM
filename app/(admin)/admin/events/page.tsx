"use client";
import { useState } from "react";
import { events as initialEvents } from "@/lib/data/index";
import type { Event } from "@/types/event";
import Link from "next/link";
import Image from "next/image";
import {
  RiAddCircleLine,
  RiExternalLinkLine,
  RiEditLine,
  RiDeleteBinLine,
  RiLockLine,
  RiLockUnlockLine,
  RiEyeOffLine,
  RiEyeLine,
} from "react-icons/ri";

type Filter = "All" | "Upcoming" | "Past";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>(
    initialEvents.map((e) => ({ ...e, restricted: false, isActive: true }))
  );
  const [filter, setFilter] = useState<Filter>("All");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = events.filter((e) => {
    if (filter === "Upcoming") return e.type === "upcoming";
    if (filter === "Past") return e.type === "past";
    return true;
  });

  function toggleRestrict(id: string) {
    // TODO (Backend Dev): PATCH /api/admin/events/:id  { restricted: !current }
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, restricted: !e.restricted } : e))
    );
  }

  function toggleActive(id: string) {
    // TODO (Backend Dev): PATCH /api/admin/events/:id  { isActive: !current }
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isActive: !e.isActive } : e))
    );
  }

  function confirmDelete(id: string) {
    setDeleteId(id);
  }

  function handleDelete() {
    if (!deleteId) return;
    // TODO (Backend Dev): DELETE /api/admin/events/:id
    setEvents((prev) => prev.filter((e) => e.id !== deleteId));
    setDeleteId(null);
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Events Manager</h2>
          <p className="text-gray-500 text-sm mt-0.5">{events.length} total events</p>
        </div>
        <Link
          href="/admin/events/add"
          className="flex items-center gap-2 bg-primary text-dark text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-primary/80 transition-all shadow-lg shadow-primary/20"
        >
          <RiAddCircleLine size={16} /> Add Event
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(["All", "Upcoming", "Past"] as Filter[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
              filter === tab
                ? "bg-primary/10 text-primary border-primary/20"
                : "bg-dark-3 text-gray-500 border-border hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((event) => (
          <div
            key={event.id}
            className={`bg-dark-3 border rounded-2xl overflow-hidden flex flex-col transition-opacity ${
              event.isActive ? "border-border" : "border-border opacity-50"
            }`}
          >
            {/* Thumbnail */}
            <div className="relative w-full h-36">
              <Image
                src={event.thumbnail}
                alt={event.title}
                fill
                className="object-cover"
              />
              {/* Badges */}
              <div className="absolute top-2 left-2 flex gap-1.5">
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    event.type === "upcoming"
                      ? "bg-primary/20 text-primary border-primary/30"
                      : "bg-white/10 text-gray-400 border-white/10"
                  }`}
                >
                  {event.type}
                </span>
                {event.restricted && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                    Subscribers only
                  </span>
                )}
                {!event.isActive && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                    Hidden
                  </span>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col gap-3 flex-1">
              <div>
                <p className="text-white text-sm font-semibold leading-snug line-clamp-2">
                  {event.title}
                </p>
                <p className="text-gray-600 text-xs mt-1">
                  {new Date(event.date).toDateString()} · {event.venue}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 mt-auto pt-2 border-t border-border">
                {/* Edit */}
                <Link
                  href={`/admin/events/${event.id}/edit`}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-primary transition-colors px-2 py-1.5 rounded-lg hover:bg-primary/10"
                  title="Edit"
                >
                  <RiEditLine size={13} /> Edit
                </Link>

                {/* Restrict toggle */}
                <button
                  onClick={() => toggleRestrict(event.id)}
                  className={`flex items-center gap-1 text-xs px-2 py-1.5 rounded-lg transition-colors ${
                    event.restricted
                      ? "text-yellow-400 hover:bg-yellow-500/10"
                      : "text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10"
                  }`}
                  title={event.restricted ? "Remove restriction" : "Restrict to subscribers"}
                >
                  {event.restricted ? <RiLockLine size={13} /> : <RiLockUnlockLine size={13} />}
                  {event.restricted ? "Restricted" : "Restrict"}
                </button>

                {/* Hide/Show toggle */}
                <button
                  onClick={() => toggleActive(event.id)}
                  className={`flex items-center gap-1 text-xs px-2 py-1.5 rounded-lg transition-colors ${
                    !event.isActive
                      ? "text-red-400 hover:bg-red-500/10"
                      : "text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                  }`}
                  title={event.isActive ? "Hide event" : "Show event"}
                >
                  {event.isActive ? <RiEyeLine size={13} /> : <RiEyeOffLine size={13} />}
                  {event.isActive ? "Hide" : "Show"}
                </button>

                {/* View on site */}
                <Link
                  href={`/events/${event.slug}`}
                  target="_blank"
                  className="ml-auto text-gray-600 hover:text-primary transition-colors"
                  title="View on site"
                >
                  <RiExternalLinkLine size={14} />
                </Link>

                {/* Delete */}
                <button
                  onClick={() => confirmDelete(event.id)}
                  className="text-gray-600 hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <RiDeleteBinLine size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-dark-3 border border-border rounded-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-white font-bold text-base mb-2">Delete Event?</h3>
            <p className="text-gray-500 text-sm mb-5">
              This action cannot be undone. The event will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500/10 text-red-400 border border-red-500/20 font-semibold text-sm py-2.5 rounded-xl hover:bg-red-500/20 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 bg-dark-4 text-gray-400 border border-border font-semibold text-sm py-2.5 rounded-xl hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

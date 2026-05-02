"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RiSaveLine, RiArrowLeftLine, RiCheckLine } from "react-icons/ri";

const inputClass = "w-full bg-dark-4 border border-border text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-gray-700";
const labelClass = "text-xs text-gray-500 font-medium mb-1.5 block";

export default function AddEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    title: "", type: "upcoming", date: "", venue: "",
    speaker: "", description: "", thumbnail: "",
    summary: "", recordingLink: "",
  });

  function set(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const slug = form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "") + "-" + form.date.slice(0, 4);
    const payload = { ...form, id: Date.now().toString(), slug };

    const res = await fetch("/api/admin/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);
    if (res.ok) {
      setSuccess(true);
      setTimeout(() => router.push("/admin/events"), 1500);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-gray-500 hover:text-white transition-colors">
          <RiArrowLeftLine size={18} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white">Add New Event</h2>
          <p className="text-gray-500 text-sm">Fill in the details below</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-dark-3 border border-border rounded-2xl p-6 flex flex-col gap-5">
        {/* Title */}
        <div>
          <label className={labelClass}>Event Title *</label>
          <input required className={inputClass} placeholder="e.g. Myopia Management Workshop" value={form.title} onChange={(e) => set("title", e.target.value)} />
        </div>

        {/* Type + Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Event Type *</label>
            <select required className={inputClass} value={form.type} onChange={(e) => set("type", e.target.value)}>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Date *</label>
            <input required type="date" className={inputClass} value={form.date} onChange={(e) => set("date", e.target.value)} />
          </div>
        </div>

        {/* Speaker + Venue */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Speaker *</label>
            <input required className={inputClass} placeholder="Dr. Name" value={form.speaker} onChange={(e) => set("speaker", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Venue *</label>
            <input required className={inputClass} placeholder="City, Venue Name" value={form.venue} onChange={(e) => set("venue", e.target.value)} />
          </div>
        </div>

        {/* Thumbnail */}
        <div>
          <label className={labelClass}>Thumbnail URL *</label>
          <input required type="url" className={inputClass} placeholder="https://..." value={form.thumbnail} onChange={(e) => set("thumbnail", e.target.value)} />
        </div>

        {/* Description */}
        <div>
          <label className={labelClass}>Description *</label>
          <textarea required rows={3} className={inputClass} placeholder="Brief description of the event..." value={form.description} onChange={(e) => set("description", e.target.value)} />
        </div>

        {/* Past-only fields */}
        {form.type === "past" && (
          <>
            <div>
              <label className={labelClass}>Event Summary</label>
              <textarea rows={3} className={inputClass} placeholder="What happened at the event..." value={form.summary} onChange={(e) => set("summary", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Recording Link</label>
              <input type="url" className={inputClass} placeholder="https://youtube.com/..." value={form.recordingLink} onChange={(e) => set("recordingLink", e.target.value)} />
            </div>
          </>
        )}

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading || success}
            className="flex items-center gap-2 bg-primary text-dark font-semibold px-6 py-3 rounded-xl hover:bg-primary/80 transition-all shadow-lg shadow-primary/20 disabled:opacity-60"
          >
            {success ? <><RiCheckLine size={16} /> Saved!</> : loading ? "Saving..." : <><RiSaveLine size={16} /> Save Event</>}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-xl border border-border text-gray-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-all">
            Cancel
          </button>
        </div>
      </form>

      <p className="text-gray-700 text-xs mt-4 text-center">
        Note: Connect a database in <code className="text-gray-600">/app/api/admin/events/route.ts</code> to persist events.
      </p>
    </div>
  );
}

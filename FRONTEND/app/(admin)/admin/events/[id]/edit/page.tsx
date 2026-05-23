"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import {
  RiSaveLine, RiArrowLeftLine, RiCheckLine, RiDeleteBinLine,
  RiLinkM, RiUploadCloud2Line, RiImageLine, RiCloseLine,
} from "react-icons/ri";
import { getEventBySlug, updateEvent, deleteEvent, uploadImage } from "@/services/eventService";
import { apiFetch, getToken } from "@/lib/api";

const inputClass = "w-full bg-dark-4 border border-border text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-gray-700";
const labelClass = "text-xs text-gray-500 font-medium mb-1.5 block";

export default function EditEventPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [thumbMode, setThumbMode] = useState<"url" | "upload">("url");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({
    title: "", type: "OFFLINE" as "OFFLINE" | "ONLINE",
    date: "", venue: "", speaker: "", description: "",
    thumbnail: "", summary: "", recordingLink: "", meetingLink: "",
    price: "0", restricted: false, isActive: true,
  });

  useEffect(() => {
    async function load() {
      try {
        const token = getToken();
        const data = await apiFetch(`/api/v1/events/${id}`, {}, token ?? undefined);
        const ev = data.data as Record<string, string | number | boolean | null>;
        setForm({
          title: String(ev.title ?? ""),
          type: (String(ev.type ?? "OFFLINE")) as "OFFLINE" | "ONLINE",
          date: ev.date ? String(ev.date).slice(0, 16) : "",
          venue: String(ev.venue ?? ""),
          speaker: String(ev.speaker ?? ""),
          description: String(ev.description ?? ""),
          thumbnail: String(ev.thumbnail ?? ""),
          summary: String(ev.summary ?? ""),
          recordingLink: String(ev.recordingLink ?? ""),
          meetingLink: String(ev.meetingLink ?? ""),
          price: String(ev.price ?? 0),
          restricted: Boolean(ev.restricted ?? false),
          isActive: Boolean(ev.isActive ?? true),
        });
      } catch (err) { console.error(err); }
    }
    load();
  }, [id]);

  function set(key: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");
    setLoading(true);
    try {
      await updateEvent(id, {
        title: form.title,
        description: form.description,
        speaker: form.speaker,
        thumbnail: form.thumbnail,
        venue: form.venue,
        type: form.type,
        price: Number(form.price),
        date: new Date(form.date).toISOString(),
        restricted: form.restricted,
        isActive: form.isActive,
        ...(form.summary ? { summary: form.summary } : {}),
        ...(form.recordingLink ? { recordingLink: form.recordingLink } : {}),
      });
      setSuccess(true);
      setTimeout(() => router.push("/admin/events"), 1500);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Failed to update event");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    try {
      await deleteEvent(id);
      router.push("/admin/events");
    } catch (err) { console.error(err); }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const url = await uploadImage(file, "events");
      set("thumbnail", url);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-gray-500 hover:text-white transition-colors">
          <RiArrowLeftLine size={18} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white">Edit Event</h2>
          <p className="text-gray-500 text-sm">ID: {id}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-dark-3 border border-border rounded-2xl p-6 flex flex-col gap-5">
        <div>
          <label className={labelClass}>Event Title *</label>
          <input required className={inputClass} value={form.title} onChange={(e) => set("title", e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Event Type *</label>
            <select required className={inputClass} value={form.type} onChange={(e) => set("type", e.target.value)}>
              <option value="OFFLINE">Offline</option>
              <option value="ONLINE">Online</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Date *</label>
            <input required type="datetime-local" className={inputClass} value={form.date} onChange={(e) => set("date", e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Speaker *</label>
            <input required className={inputClass} value={form.speaker} onChange={(e) => set("speaker", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Venue *</label>
            <input required className={inputClass} value={form.venue} onChange={(e) => set("venue", e.target.value)} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Ticket Price (₹) *</label>
          <input required type="number" min="0" className={inputClass} value={form.price} onChange={(e) => set("price", e.target.value)} />
        </div>

        {/* Thumbnail */}
        <div>
          <label className={labelClass}>Thumbnail *</label>
          <div className="flex gap-1 p-1 bg-dark-4 border border-border rounded-xl mb-3 w-fit">
            <button type="button" onClick={() => setThumbMode("url")}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${thumbMode === "url" ? "bg-dark-3 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"}`}>
              <RiLinkM size={13} /> URL
            </button>
            <button type="button" onClick={() => setThumbMode("upload")}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${thumbMode === "upload" ? "bg-dark-3 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"}`}>
              <RiUploadCloud2Line size={13} /> Upload
            </button>
          </div>

          {thumbMode === "url" ? (
            <input type="url" className={inputClass} value={form.thumbnail} onChange={(e) => set("thumbnail", e.target.value)} />
          ) : (
            <div>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleFileChange} />
              {!form.thumbnail && (
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                  className="w-full border-2 border-dashed border-border hover:border-primary/40 rounded-xl p-8 flex flex-col items-center gap-2 text-gray-500 hover:text-gray-300 transition-all disabled:opacity-60">
                  {uploading ? (
                    <><RiUploadCloud2Line size={24} className="animate-pulse text-primary" /><span className="text-sm">Uploading...</span></>
                  ) : (
                    <><RiImageLine size={24} /><span className="text-sm font-medium">Click to choose image</span><span className="text-xs text-gray-600">JPG, PNG, WebP — max 5MB</span></>
                  )}
                </button>
              )}
              {uploadError && <p className="text-red-400 text-xs mt-1.5">{uploadError}</p>}
            </div>
          )}

          {form.thumbnail && (
            <div className="mt-3 relative rounded-xl overflow-hidden border border-border">
              <div className="relative h-40 w-full">
                <Image src={form.thumbnail} alt="Thumbnail preview" fill className="object-cover" onError={() => set("thumbnail", "")} />
              </div>
              <button type="button" onClick={() => set("thumbnail", "")}
                className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-dark/80 border border-border text-gray-400 hover:text-white flex items-center justify-center transition-colors">
                <RiCloseLine size={14} />
              </button>
            </div>
          )}
        </div>

        <div>
          <label className={labelClass}>Description *</label>
          <textarea required rows={3} className={inputClass} value={form.description} onChange={(e) => set("description", e.target.value)} />
        </div>

        <div>
          <label className={labelClass}>Event Summary</label>
          <textarea rows={3} className={inputClass} value={form.summary} onChange={(e) => set("summary", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Recording Link</label>
          <input type="url" className={inputClass} value={form.recordingLink} onChange={(e) => set("recordingLink", e.target.value)} />
        </div>

        {/* Access control */}
        <div className="bg-dark-4 border border-border rounded-xl p-4 flex flex-col gap-3">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Access Control</p>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm text-white font-medium">Restrict to Subscribers</p>
              <p className="text-xs text-gray-600 mt-0.5">Only subscribed users can view full event details</p>
            </div>
            <div onClick={() => set("restricted", !form.restricted)}
              className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${form.restricted ? "bg-yellow-500" : "bg-dark-3 border border-border"}`}>
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${form.restricted ? "left-5" : "left-0.5"}`} />
            </div>
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm text-white font-medium">Visible to Public</p>
              <p className="text-xs text-gray-600 mt-0.5">When off, event is hidden from all public listings</p>
            </div>
            <div onClick={() => set("isActive", !form.isActive)}
              className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${form.isActive ? "bg-primary" : "bg-dark-3 border border-border"}`}>
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${form.isActive ? "left-5" : "left-0.5"}`} />
            </div>
          </label>
        </div>

        {submitError && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3 py-2.5 rounded-xl">{submitError}</div>
        )}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading || success}
            className="flex items-center gap-2 bg-primary text-dark font-semibold px-6 py-3 rounded-xl hover:bg-primary/80 transition-all shadow-lg shadow-primary/20 disabled:opacity-60">
            {success ? <><RiCheckLine size={16} /> Saved!</> : loading ? "Saving..." : <><RiSaveLine size={16} /> Save Changes</>}
          </button>
          <button type="button" onClick={() => router.back()}
            className="px-6 py-3 rounded-xl border border-border text-gray-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-all">
            Cancel
          </button>
          <button type="button" onClick={() => setDeleteConfirm(true)}
            className="ml-auto flex items-center gap-1.5 px-4 py-3 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 text-sm font-medium transition-all">
            <RiDeleteBinLine size={14} /> Delete
          </button>
        </div>
      </form>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-dark-3 border border-border rounded-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-white font-bold text-base mb-2">Delete Event?</h3>
            <p className="text-gray-500 text-sm mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={handleDelete} className="flex-1 bg-red-500/10 text-red-400 border border-red-500/20 font-semibold text-sm py-2.5 rounded-xl hover:bg-red-500/20 transition-colors">Delete</button>
              <button onClick={() => setDeleteConfirm(false)} className="flex-1 bg-dark-4 text-gray-400 border border-border font-semibold text-sm py-2.5 rounded-xl hover:text-white transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

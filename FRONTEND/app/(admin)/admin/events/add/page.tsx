"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  RiSaveLine, RiArrowLeftLine, RiCheckLine,
  RiLinkM, RiUploadCloud2Line, RiImageLine, RiCloseLine, RiQrCodeLine,
} from "react-icons/ri";
import { createEvent } from "@/services/eventService";

const inputClass = "w-full bg-dark-4 border border-border text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-gray-700";
const labelClass = "text-xs text-gray-500 font-medium mb-1.5 block";

export default function AddEventPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const qrRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [thumbMode, setThumbMode] = useState<"url" | "upload">("url");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [qrUploading, setQrUploading] = useState(false);
  const [qrError, setQrError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const [form, setForm] = useState({
    title: "", type: "OFFLINE" as "OFFLINE" | "ONLINE",
    date: "", venue: "", speaker: "", description: "",
    thumbnail: "", summary: "", recordingLink: "",
    price: "0", paymentQrUrl: "",
  });

  function set(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "events");
      
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Upload failed");
      }
      
      const data = await res.json();
      set("thumbnail", data.url);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleQrChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setQrUploading(true);
    setQrError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "payment-qr");
      
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "QR upload failed");
      }
      
      const data = await res.json();
      set("paymentQrUrl", data.url);
    } catch (err: unknown) {
      setQrError(err instanceof Error ? err.message : "QR upload failed");
    } finally {
      setQrUploading(false);
      if (qrRef.current) qrRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");
    setLoading(true);
    try {
      await createEvent({
        title: form.title,
        description: form.description,
        speaker: form.speaker,
        thumbnail: form.thumbnail,
        venue: form.venue,
        type: form.type,
        price: Number(form.price),
        date: new Date(form.date).toISOString(),
        ...(form.summary ? { summary: form.summary } : {}),
        ...(form.recordingLink ? { recordingLink: form.recordingLink } : {}),
      });
      setSuccess(true);
      setTimeout(() => router.push("/admin/events"), 1500);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Failed to create event");
    } finally {
      setLoading(false);
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
              <option value="OFFLINE">Offline</option>
              <option value="ONLINE">Online</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Date *</label>
            <input required type="datetime-local" className={inputClass} value={form.date} onChange={(e) => set("date", e.target.value)} />
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

        {/* Price */}
        <div>
          <label className={labelClass}>Ticket Price (₹) *</label>
          <input required type="number" min="0" className={inputClass} placeholder="0 for free events" value={form.price} onChange={(e) => set("price", e.target.value)} />
        </div>

        {/* Thumbnail */}
        <div>
          <label className={labelClass}>Thumbnail *</label>
          <div className="flex gap-1 p-1 bg-dark-4 border border-border rounded-xl mb-3 w-fit">
            <button type="button" onClick={() => { setThumbMode("url"); set("thumbnail", ""); }}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${thumbMode === "url" ? "bg-dark-3 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"}`}>
              <RiLinkM size={13} /> URL
            </button>
            <button type="button" onClick={() => { setThumbMode("upload"); set("thumbnail", ""); }}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${thumbMode === "upload" ? "bg-dark-3 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"}`}>
              <RiUploadCloud2Line size={13} /> Upload
            </button>
          </div>

          {thumbMode === "url" ? (
            <input type="url" className={inputClass} placeholder="https://..." value={form.thumbnail} onChange={(e) => set("thumbnail", e.target.value)} />
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
            <div className="mt-3 relative rounded-xl overflow-hidden border border-border group">
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

        {/* Payment QR Code */}
        {Number(form.price) > 0 && (
          <div>
            <label className={labelClass}>Payment QR Code</label>
            <p className="text-xs text-gray-600 mb-3">Upload your UPI QR code. Students will scan this to pay, then submit their UTR for verification.</p>
            <input ref={qrRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleQrChange} />
            {!form.paymentQrUrl ? (
              <button type="button" onClick={() => qrRef.current?.click()} disabled={qrUploading}
                className="w-full border-2 border-dashed border-amber-500/30 hover:border-amber-500/60 rounded-xl p-6 flex flex-col items-center gap-2 text-gray-500 hover:text-amber-400 transition-all disabled:opacity-60">
                {qrUploading ? (
                  <><RiQrCodeLine size={24} className="animate-pulse text-amber-400" /><span className="text-sm">Uploading QR...</span></>
                ) : (
                  <><RiQrCodeLine size={24} /><span className="text-sm font-medium">Upload UPI QR Code</span><span className="text-xs text-gray-600">PNG, JPG — max 5MB</span></>
                )}
              </button>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-amber-500/30 w-40">
                <div className="relative h-40 w-40">
                  <Image src={form.paymentQrUrl} alt="Payment QR" fill className="object-contain bg-white" />
                </div>
                <button type="button" onClick={() => set("paymentQrUrl", "")}
                  className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-dark/80 border border-border text-gray-400 hover:text-white flex items-center justify-center transition-colors">
                  <RiCloseLine size={14} />
                </button>
              </div>
            )}
            {qrError && <p className="text-red-400 text-xs mt-1.5">{qrError}</p>}
          </div>
        )}

        {/* Description */}
        <div>
          <label className={labelClass}>Description *</label>
          <textarea required rows={3} className={inputClass} placeholder="Brief description of the event..." value={form.description} onChange={(e) => set("description", e.target.value)} />
        </div>

        {/* Optional fields */}
        <div>
          <label className={labelClass}>Event Summary</label>
          <textarea rows={3} className={inputClass} placeholder="What happened at the event..." value={form.summary} onChange={(e) => set("summary", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Recording Link</label>
          <input type="url" className={inputClass} placeholder="https://youtube.com/..." value={form.recordingLink} onChange={(e) => set("recordingLink", e.target.value)} />
        </div>

        {submitError && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3 py-2.5 rounded-xl">{submitError}</div>
        )}

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading || success || !form.thumbnail}
            className="flex items-center gap-2 bg-primary text-dark font-semibold px-6 py-3 rounded-xl hover:bg-primary/80 transition-all shadow-lg shadow-primary/20 disabled:opacity-60">
            {success ? <><RiCheckLine size={16} /> Saved!</> : loading ? "Saving..." : <><RiSaveLine size={16} /> Save Event</>}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-xl border border-border text-gray-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-all">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

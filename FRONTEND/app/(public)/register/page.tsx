"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import AnimateIn from "@/components/ui/AnimateIn";
import { RiQrCodeLine, RiUploadCloud2Line, RiCheckLine, RiArrowRightLine } from "react-icons/ri";
import { getEventBySlug } from "@/services/eventService";
import { uploadImage } from "@/services/eventService";
import { submitPayment } from "@/services/paymentService";
import { getSession } from "@/services/authService";
import type { Event } from "@/types/event";

function RegisterForm() {
  const params = useSearchParams();
  const router = useRouter();
  const eventId = params.get("eventId");
  const screenshotRef = useRef<HTMLInputElement>(null);

  const [event, setEvent] = useState<Event | null>(null);
  const [utr, setUtr] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!eventId) return;
    // fetch event by id — backend returns by slug, so we use the events list
    import("@/services/eventService").then(({ getEvents }) =>
      getEvents().then((evs) => {
        const ev = evs.find((e) => e.id === eventId);
        if (ev) setEvent(ev);
      })
    );
  }, [eventId]);

  async function handleScreenshot(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, "payment-screenshots");
      setScreenshotUrl(url);
    } catch { setError("Screenshot upload failed"); }
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!event) return;
    setLoading(true);
    try {
      const session = await getSession();
      if (!session) { router.push("/login"); return; }
      await submitPayment({
        eventId: event.id,
        amount: event.price,
        utr: utr.trim(),
        screenshotUrl,
      });
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setLoading(false);
    }
  }

  if (!eventId) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 mb-4">No event selected.</p>
        <a href="/events/upcoming" className="text-primary hover:underline">Browse events →</a>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center py-10">
        <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
          <RiCheckLine size={24} className="text-emerald-400" />
        </div>
        <h2 className="text-white font-bold text-xl mb-2">Payment Submitted!</h2>
        <p className="text-gray-500 text-sm mb-1">Your enrollment is pending admin verification.</p>
        <p className="text-gray-600 text-xs">Estimated review time: 1–6 hours</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {event && (
        <div className="bg-dark-4 border border-border rounded-xl p-4">
          <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-1">Registering for</p>
          <p className="text-white font-semibold text-sm">{event.title}</p>
          <p className="text-primary text-sm font-bold mt-1">₹{event.price}</p>
        </div>
      )}

      {/* QR Code display */}
      <div className="bg-dark-4 border border-amber-500/20 rounded-xl p-5 flex flex-col items-center gap-3">
        <RiQrCodeLine size={20} className="text-amber-400" />
        <p className="text-white font-semibold text-sm">Scan & Pay via UPI</p>
        <p className="text-gray-500 text-xs text-center">
          Scan the QR code below or use UPI ID to pay ₹{event?.price ?? "—"}
        </p>
        {/* QR image will be served from event data once backend stores it */}
        <div className="w-40 h-40 bg-white rounded-xl flex items-center justify-center">
          <RiQrCodeLine size={80} className="text-gray-300" />
        </div>
        <p className="text-gray-600 text-xs">QR code provided by admin for this event</p>
      </div>

      {/* UTR input */}
      <div>
        <label className="text-xs text-gray-500 font-medium mb-1.5 block">UTR / Transaction ID *</label>
        <input
          required
          value={utr}
          onChange={(e) => setUtr(e.target.value)}
          placeholder="e.g. ABCD12345678"
          className="w-full bg-dark-4 border border-border text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-gray-700"
        />
        <p className="text-gray-600 text-xs mt-1">Find this in your UPI app under transaction history</p>
      </div>

      {/* Screenshot upload */}
      <div>
        <label className="text-xs text-gray-500 font-medium mb-1.5 block">Payment Screenshot (optional)</label>
        <input ref={screenshotRef} type="file" accept="image/*" className="hidden" onChange={handleScreenshot} />
        {!screenshotUrl ? (
          <button type="button" onClick={() => screenshotRef.current?.click()} disabled={uploading}
            className="w-full border-2 border-dashed border-border hover:border-primary/40 rounded-xl p-5 flex flex-col items-center gap-2 text-gray-500 hover:text-gray-300 transition-all disabled:opacity-60">
            {uploading ? (
              <><RiUploadCloud2Line size={20} className="animate-pulse text-primary" /><span className="text-xs">Uploading...</span></>
            ) : (
              <><RiUploadCloud2Line size={20} /><span className="text-xs">Upload screenshot</span></>
            )}
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-3 py-2.5 rounded-xl">
            <RiCheckLine size={14} /> Screenshot uploaded
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3 py-2.5 rounded-xl">{error}</div>
      )}

      <button type="submit" disabled={loading || !utr.trim()}
        className="flex items-center justify-center gap-2 w-full bg-primary text-dark font-semibold py-3 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-60">
        {loading ? "Submitting..." : <><span>Submit for Verification</span><RiArrowRightLine size={15} /></>}
      </button>
    </form>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <AnimateIn className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            Event Registration
          </div>
          <h1 className="text-3xl font-bold text-white">Register & Pay</h1>
          <p className="text-gray-500 text-sm mt-1">Pay via UPI and submit your transaction ID</p>
        </div>

        <div className="bg-dark-3 border border-border rounded-2xl p-6 shadow-2xl shadow-black/40">
          <Suspense fallback={<div className="py-10 text-center text-gray-600 text-sm">Loading...</div>}>
            <RegisterForm />
          </Suspense>
        </div>
      </AnimateIn>
    </div>
  );
}

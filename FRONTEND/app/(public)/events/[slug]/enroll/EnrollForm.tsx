"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import {
  RiQrCodeLine, RiUploadCloud2Line, RiCheckLine,
  RiInformationLine, RiCloseLine, RiArrowRightLine,
} from "react-icons/ri";
import type { Event } from "@/types/event";
import { getToken } from "@/lib/api";

interface Props {
  event: Event;
}

export default function EnrollForm({ event }: Props) {
  const isFree = event.price === 0;

  const [step, setStep] = useState<"info" | "payment" | "success">(isFree ? "payment" : "info");
  const [utr, setUtr] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const inputClass =
    "w-full bg-dark-4 border border-border text-[var(--color-text)] text-sm rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-gray-700";

  async function handleScreenshotUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "payment-screenshots");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }
      const data = await res.json();
      setScreenshotUrl(data.url);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!isFree && !utr.trim()) {
      setError("Please enter your UTR / Transaction ID.");
      return;
    }

    setSubmitting(true);
    try {
      const token = getToken();
      const payload: Record<string, unknown> = {
        eventId: event.id,
        amount: event.price,
        utr: isFree ? `FREE-${Date.now()}` : utr.trim(),
        ...(screenshotUrl ? { screenshotUrl } : {}),
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/v1/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Submission failed");
      }

      setStep("success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  /* ── Success state ── */
  if (step === "success") {
    return (
      <div className="bg-dark-3 border border-emerald-500/20 rounded-2xl p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
          <RiCheckLine size={28} className="text-emerald-400" />
        </div>
        <h3 className="text-white font-bold text-xl mb-2">
          {isFree ? "You're registered!" : "Payment submitted!"}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
          {isFree
            ? "Your registration is confirmed. We'll send details closer to the event."
            : "Your payment is under review. Once verified by our team, your enrollment will be confirmed."}
        </p>
      </div>
    );
  }

  /* ── Info step (paid events only) ── */
  if (step === "info") {
    return (
      <div className="bg-dark-3 border border-border rounded-2xl p-6">
        <h3 className="text-white font-bold text-lg mb-1">How enrollment works</h3>
        <p className="text-gray-500 text-sm mb-6">Follow these steps to secure your spot.</p>

        <div className="flex flex-col gap-4 mb-8">
          {[
            { n: "1", title: "Scan the QR code", desc: "Pay ₹" + event.price + " via UPI to the QR code shown on the next screen." },
            { n: "2", title: "Note your UTR", desc: "After payment, copy the 12-digit UTR / Transaction ID from your UPI app." },
            { n: "3", title: "Submit details", desc: "Enter your UTR and optionally upload a screenshot for faster verification." },
            { n: "4", title: "Admin approval", desc: "Our team verifies your payment and confirms your enrollment within 24 hours." },
          ].map(({ n, title, desc }) => (
            <div key={n} className="flex gap-4">
              <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {n}
              </div>
              <div>
                <p className="text-white text-sm font-medium">{title}</p>
                <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setStep("payment")}
          className="w-full flex items-center justify-center gap-2 bg-primary text-dark font-semibold py-3 rounded-xl hover:bg-primary/80 transition-all shadow-lg shadow-primary/20"
        >
          Continue to Payment <RiArrowRightLine size={16} />
        </button>
      </div>
    );
  }

  /* ── Payment step ── */
  return (
    <form onSubmit={handleSubmit} className="bg-dark-3 border border-border rounded-2xl p-6 flex flex-col gap-5">
      <div>
        <h3 className="text-white font-bold text-lg mb-1">
          {isFree ? "Confirm Registration" : "Complete Payment"}
        </h3>
        <p className="text-gray-500 text-sm">
          {isFree ? "Click below to register for this free event." : "Scan the QR code and enter your transaction details."}
        </p>
      </div>

      {/* QR code for paid events */}
      {!isFree && event.paymentQrUrl && (
        <div className="flex flex-col items-center gap-3 bg-dark-4 border border-border rounded-xl p-5">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Scan to Pay ₹{event.price}</p>
          <div className="relative w-44 h-44 rounded-xl overflow-hidden border border-border bg-white">
            <Image src={event.paymentQrUrl} alt="Payment QR" fill className="object-contain p-2" />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <RiInformationLine className="text-primary/70 shrink-0" />
            Pay via any UPI app — PhonePe, GPay, Paytm, etc.
          </div>
        </div>
      )}

      {/* No QR uploaded */}
      {!isFree && !event.paymentQrUrl && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-2">
          <RiInformationLine className="text-amber-400 shrink-0 mt-0.5" size={15} />
          <p className="text-amber-400 text-xs leading-relaxed">
            Payment QR not available yet. Please contact us directly to complete payment before submitting your UTR.
          </p>
        </div>
      )}

      {/* UTR input */}
      {!isFree && (
        <div>
          <label className="text-xs text-gray-500 font-medium mb-1.5 block">
            UTR / Transaction ID *
          </label>
          <input
            required
            className={inputClass}
            placeholder="e.g. 123456789012"
            value={utr}
            onChange={(e) => setUtr(e.target.value)}
            minLength={6}
            maxLength={22}
          />
          <p className="text-xs text-gray-600 mt-1.5">
            Find this in your UPI app under transaction history.
          </p>
        </div>
      )}

      {/* Screenshot upload */}
      {!isFree && (
        <div>
          <label className="text-xs text-gray-500 font-medium mb-1.5 block">
            Payment Screenshot <span className="text-gray-700">(optional but recommended)</span>
          </label>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleScreenshotUpload}
          />
          {!screenshotUrl ? (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="w-full border-2 border-dashed border-border hover:border-primary/40 rounded-xl p-5 flex flex-col items-center gap-2 text-gray-500 hover:text-gray-300 transition-all disabled:opacity-60"
            >
              {uploading ? (
                <>
                  <RiUploadCloud2Line size={22} className="animate-pulse text-primary" />
                  <span className="text-sm">Uploading...</span>
                </>
              ) : (
                <>
                  <RiUploadCloud2Line size={22} />
                  <span className="text-sm font-medium">Upload screenshot</span>
                  <span className="text-xs text-gray-600">JPG, PNG — max 5MB</span>
                </>
              )}
            </button>
          ) : (
            <div className="relative rounded-xl overflow-hidden border border-border">
              <div className="relative h-36 w-full">
                <Image src={screenshotUrl} alt="Payment screenshot" fill className="object-cover" />
              </div>
              <button
                type="button"
                onClick={() => setScreenshotUrl("")}
                className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-dark/80 border border-border text-gray-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <RiCloseLine size={14} />
              </button>
            </div>
          )}
          {uploadError && <p className="text-red-400 text-xs mt-1.5">{uploadError}</p>}
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3 py-2.5 rounded-xl">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || uploading}
        className="w-full flex items-center justify-center gap-2 bg-primary text-dark font-semibold py-3 rounded-xl hover:bg-primary/80 transition-all shadow-lg shadow-primary/20 disabled:opacity-60"
      >
        {submitting ? (
          "Submitting..."
        ) : isFree ? (
          <><RiCheckLine size={16} /> Confirm Registration</>
        ) : (
          <><RiCheckLine size={16} /> Submit Payment Details</>
        )}
      </button>

      {!isFree && (
        <p className="text-xs text-gray-600 text-center">
          Your enrollment will be confirmed after admin verification, usually within 24 hours.
        </p>
      )}
    </form>
  );
}

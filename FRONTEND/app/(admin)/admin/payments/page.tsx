"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { RiCheckLine, RiCloseLine, RiExternalLinkLine } from "react-icons/ri";
import { apiFetch, getToken } from "@/lib/api";
import { reviewPayment } from "@/services/paymentService";

interface Payment {
  id: string;
  status: "PENDING" | "SUCCESS" | "REJECTED";
  amount: number;
  utr: string;
  screenshotUrl?: string;
  createdAt: string;
  user?: { email: string; fullName?: string };
  event?: { title: string };
}

const statusStyle: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  SUCCESS: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    apiFetch("/api/v1/payments", {}, token ?? undefined)
      .then((d) => setPayments((d.data as Payment[]) ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function approve(id: string) {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/payments/${id}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "SUCCESS" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Approval failed");
      setPayments((prev) => prev.map((p) => p.id === id ? { ...p, status: "SUCCESS" } : p));
    } catch (err) { console.error(err); alert(err instanceof Error ? err.message : "Failed"); }
    setActionLoading(null);
  }

  async function reject() {
    if (!rejectId || !rejectReason.trim()) return;
    setActionLoading(rejectId);
    try {
      const res = await fetch(`/api/admin/payments/${rejectId}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "REJECTED", rejectionReason: rejectReason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Rejection failed");
      setPayments((prev) => prev.map((p) => p.id === rejectId ? { ...p, status: "REJECTED" } : p));
    } catch (err) { console.error(err); alert(err instanceof Error ? err.message : "Failed"); }
    setActionLoading(null);
    setRejectId(null);
    setRejectReason("");
  }

  const pending = payments.filter((p) => p.status === "PENDING");
  const reviewed = payments.filter((p) => p.status !== "PENDING");

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-white font-bold text-xl tracking-tight">Payment Verifications</h1>
        <p className="text-gray-500 text-sm mt-0.5">Review UPI payment submissions from students</p>
      </div>

      {/* Pending */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-white font-semibold text-sm">Pending Review</h2>
          {pending.length > 0 && (
            <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-semibold">{pending.length}</span>
          )}
        </div>

        {loading ? (
          <div className="text-gray-600 text-sm py-8 text-center">Loading...</div>
        ) : pending.length === 0 ? (
          <div className="bg-dark-3 border border-border rounded-xl py-10 text-center text-gray-600 text-sm">No pending payments</div>
        ) : (
          <div className="bg-dark-3 border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {["User", "Event", "Amount", "UTR", "Screenshot", "Submitted", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs text-gray-600 font-semibold uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pending.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-white text-xs font-medium">{p.user?.fullName ?? "—"}</p>
                        <p className="text-gray-600 text-[11px]">{p.user?.email ?? "—"}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{p.event?.title ?? "—"}</td>
                      <td className="px-4 py-3 text-white text-xs font-semibold">₹{p.amount}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs font-mono">{p.utr}</td>
                      <td className="px-4 py-3">
                        {p.screenshotUrl ? (
                          <a href={p.screenshotUrl} target="_blank" rel="noreferrer"
                            className="flex items-center gap-1 text-xs text-primary hover:underline">
                            View <RiExternalLinkLine size={11} />
                          </a>
                        ) : <span className="text-gray-600 text-xs">—</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => approve(p.id)} disabled={actionLoading === p.id}
                            className="flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1.5 rounded-lg hover:bg-emerald-500/20 transition-colors disabled:opacity-50">
                            <RiCheckLine size={12} /> Approve
                          </button>
                          <button onClick={() => setRejectId(p.id)} disabled={actionLoading === p.id}
                            className="flex items-center gap-1 text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1.5 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50">
                            <RiCloseLine size={12} /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Reviewed */}
      {reviewed.length > 0 && (
        <div>
          <h2 className="text-white font-semibold text-sm mb-3">Reviewed</h2>
          <div className="bg-dark-3 border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {["User", "Event", "Amount", "UTR", "Status", "Date"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs text-gray-600 font-semibold uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {reviewed.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-white text-xs font-medium">{p.user?.fullName ?? "—"}</p>
                        <p className="text-gray-600 text-[11px]">{p.user?.email ?? "—"}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{p.event?.title ?? "—"}</td>
                      <td className="px-4 py-3 text-white text-xs font-semibold">₹{p.amount}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs font-mono">{p.utr}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${statusStyle[p.status]}`}>{p.status}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Reject modal */}
      {rejectId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-dark-3 border border-border rounded-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-white font-bold text-base mb-2">Reject Payment</h3>
            <p className="text-gray-500 text-sm mb-4">Provide a reason for rejection (required).</p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. UTR not found in bank statement"
              className="w-full bg-dark-4 border border-border text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-red-500/50 transition-all placeholder:text-gray-700 mb-4"
            />
            <div className="flex gap-3">
              <button onClick={reject} disabled={!rejectReason.trim() || actionLoading === rejectId}
                className="flex-1 bg-red-500/10 text-red-400 border border-red-500/20 font-semibold text-sm py-2.5 rounded-xl hover:bg-red-500/20 transition-colors disabled:opacity-50">
                Confirm Reject
              </button>
              <button onClick={() => { setRejectId(null); setRejectReason(""); }}
                className="flex-1 bg-dark-4 text-gray-400 border border-border font-semibold text-sm py-2.5 rounded-xl hover:text-white transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

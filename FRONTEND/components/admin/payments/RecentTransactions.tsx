"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { RiArrowRightLine } from "react-icons/ri";
import { apiFetch, getToken } from "@/lib/api";

interface Payment {
  id: string;
  status: string;
  amount: number;
  utr: string;
  createdAt: string;
  user?: { email: string; fullName?: string };
  event?: { title: string };
}

const statusStyle: Record<string, string> = {
  SUCCESS: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
  PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export default function RecentTransactions() {
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const token = getToken();
    apiFetch("/api/v1/payments", {}, token ?? undefined)
      .then((d) => setPayments((d.data ?? []).slice(0, 8)))
      .catch(console.error);
  }, []);

  return (
    <div className="bg-dark-3 border border-border rounded-xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
        <p className="text-white font-semibold text-sm">Recent Transactions</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {["User", "Event", "Amount", "UTR", "Status", "Date"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs text-gray-600 font-semibold uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {payments.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-600 text-xs">No transactions yet</td></tr>
            ) : payments.map((p) => (
              <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-3.5">
                  <p className="text-white text-xs font-medium">{p.user?.fullName ?? "—"}</p>
                  <p className="text-gray-600 text-[11px]">{p.user?.email ?? "—"}</p>
                </td>
                <td className="px-5 py-3.5 text-gray-400 text-xs">{p.event?.title ?? "—"}</td>
                <td className="px-5 py-3.5 text-white text-xs font-semibold">₹{p.amount}</td>
                <td className="px-5 py-3.5 text-gray-500 text-xs font-mono">{p.utr}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${statusStyle[p.status] ?? ""}`}>{p.status}</span>
                </td>
                <td className="px-5 py-3.5 text-gray-600 text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3.5 border-t border-border bg-dark-4/40 flex items-center justify-end">
        <Link href="/admin/payments" className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary transition-colors">
          View all <RiArrowRightLine size={11} />
        </Link>
      </div>
    </div>
  );
}

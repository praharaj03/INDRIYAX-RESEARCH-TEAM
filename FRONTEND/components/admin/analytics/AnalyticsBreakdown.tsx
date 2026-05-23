"use client";
import { useEffect, useState } from "react";
import { apiFetch, getToken } from "@/lib/api";

export default function AnalyticsBreakdown() {
  const [data, setData] = useState({ total: 0, online: 0, offline: 0 });

  useEffect(() => {
    const token = getToken();
    apiFetch("/api/v1/dashboard/overall", {}, token ?? undefined)
      .then((d) => {
        const resp = d as Record<string, Record<string, Record<string, number>>>;
        const total = resp.data?.overview?.totalEventsConducted ?? 0;
        setData({ total, online: 0, offline: total });
      })
      .catch(console.error);
  }, []);

  const { total, online, offline } = data;
  const onlinePct = total ? Math.round((online / total) * 100) : 0;
  const offlinePct = 100 - onlinePct;
  const r = 54;
  const circ = 2 * Math.PI * r;
  const onlineDash = (onlinePct / 100) * circ;
  const offlineDash = (offlinePct / 100) * circ;

  return (
    <div className="lg:col-span-2 bg-dark-3 border border-border rounded-xl p-5">
      <p className="text-white font-semibold text-sm mb-5">Event Breakdown</p>

      <div className="flex items-center justify-center mb-5">
        <div className="relative">
          <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
            <circle cx="70" cy="70" r={r} fill="none" stroke="#1C2128" strokeWidth="14" />
            <circle cx="70" cy="70" r={r} fill="none" stroke="#a78bfa" strokeWidth="14"
              strokeDasharray={`${offlineDash} ${circ}`} strokeDashoffset={-onlineDash} strokeLinecap="round" />
            <circle cx="70" cy="70" r={r} fill="none" stroke="#00D4FF" strokeWidth="14"
              strokeDasharray={`${onlineDash} ${circ}`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-white font-bold text-2xl leading-none">{total}</p>
            <p className="text-gray-500 text-xs mt-1">events</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {[
          { label: "Online", count: online, pct: onlinePct, color: "bg-primary" },
          { label: "Offline", count: offline, pct: offlinePct, color: "bg-violet-400" },
        ].map(({ label, count, pct, color }) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${color} shrink-0`} />
              <span className="text-gray-400 text-sm">{label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold text-sm">{count}</span>
              <span className="text-xs text-gray-600 w-9 text-right">{pct}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 h-1.5 bg-dark-4 rounded-full overflow-hidden flex">
        <div className="h-full bg-primary rounded-l-full" style={{ width: `${onlinePct}%` }} />
        <div className="h-full bg-violet-400 rounded-r-full" style={{ width: `${offlinePct}%` }} />
      </div>
    </div>
  );
}

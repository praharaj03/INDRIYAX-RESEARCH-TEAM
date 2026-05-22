"use client";
import { useEffect, useState } from "react";
import { RiCalendarEventLine, RiGroupLine, RiMoneyDollarCircleLine, RiCheckboxCircleLine } from "react-icons/ri";
import { apiFetch, getToken } from "@/lib/api";

interface Overview {
  totalEarnings: number;
  totalEventsConducted: number;
  totalUsers: number;
  totalSuccessfulEnrollments: number;
}

export default function DashboardStats() {
  const [overview, setOverview] = useState<Overview | null>(null);

  useEffect(() => {
    const token = getToken();
    apiFetch("/api/v1/dashboard/overall", {}, token ?? undefined)
      .then((d) => setOverview(d.data?.overview ?? null))
      .catch(console.error);
  }, []);

  const stats = [
    { icon: RiCalendarEventLine, label: "Total Events", value: overview?.totalEventsConducted ?? "—", color: "text-primary", bg: "bg-primary/10" },
    { icon: RiGroupLine, label: "Total Users", value: overview?.totalUsers ?? "—", color: "text-violet-400", bg: "bg-violet-500/10" },
    { icon: RiCheckboxCircleLine, label: "Enrollments", value: overview?.totalSuccessfulEnrollments ?? "—", color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { icon: RiMoneyDollarCircleLine, label: "Total Revenue", value: overview ? `₹${overview.totalEarnings}` : "—", color: "text-amber-400", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map(({ icon: Icon, label, value, color, bg }) => (
        <div key={label} className="bg-dark-3 border border-border rounded-xl p-4 flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
            <Icon size={16} className={color} />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-none">{value}</p>
            <p className="text-gray-500 text-xs mt-0.5">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

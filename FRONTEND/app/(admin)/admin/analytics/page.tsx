"use client";
import { useEffect, useState } from "react";
import {
  RiCalendarEventLine, RiHistoryLine, RiNewspaperLine,
  RiGroupLine, RiMicLine,
} from "react-icons/ri";

interface Metrics {
  upcomingEvents: number;
  pastEvents: number;
  totalPosts: number;
  totalUsers: number;
  uniqueSpeakers: number;
}

interface EventEnrollment {
  event: {
    id: string;
    title: string;
    date: string;
    price: number;
  };
  approved: number;
  pending: number;
  rejected: number;
  total: number;
}

interface AnalyticsData {
  metrics: Metrics;
  eventEnrollments: EventEnrollment[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setData(result.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const metrics = [
    { icon: RiCalendarEventLine, label: "Upcoming", value: data?.metrics.upcomingEvents ?? "—", color: "text-primary", bg: "bg-primary/10" },
    { icon: RiHistoryLine, label: "Past Events", value: data?.metrics.pastEvents ?? "—", color: "text-violet-400", bg: "bg-violet-500/10" },
    { icon: RiNewspaperLine, label: "News", value: data?.metrics.totalPosts ?? "—", color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { icon: RiGroupLine, label: "Total Users", value: data?.metrics.totalUsers ?? "—", color: "text-amber-400", bg: "bg-amber-500/10" },
    { icon: RiMicLine, label: "Speakers", value: data?.metrics.uniqueSpeakers ?? "—", color: "text-sky-400", bg: "bg-sky-500/10" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div>
        <h1 className="text-white font-bold text-xl tracking-tight">Analytics</h1>
        <p className="text-gray-500 text-sm mt-0.5">Content overview and enrollment statistics</p>
      </div>

      {/* Metric strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {metrics.map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="bg-dark-3 border border-border rounded-xl p-3.5 flex flex-col gap-2">
            <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center`}>
              <Icon size={14} className={color} />
            </div>
            <p className="text-white font-bold text-lg leading-none">{value}</p>
            <p className="text-gray-500 text-xs">{label}</p>
          </div>
        ))}
      </div>

      {/* Enrollments by Event */}
      <div className="bg-dark-3 border border-border rounded-2xl p-5">
        <h2 className="text-white font-semibold text-lg mb-4">Enrollments by Event</h2>
        
        {loading ? (
          <p className="text-gray-500 text-sm text-center py-8">Loading...</p>
        ) : !data?.eventEnrollments.length ? (
          <p className="text-gray-500 text-sm text-center py-8">No enrollment data available</p>
        ) : (
          <div className="space-y-3">
            {data.eventEnrollments.map((item) => (
              <div key={item.event.id} className="bg-dark-4 border border-border rounded-xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-medium text-sm">{item.event.title}</h3>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {new Date(item.event.date).toLocaleDateString()} • ₹{item.event.price}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold text-lg">{item.total}</p>
                    <p className="text-gray-500 text-xs">Total</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2 text-center">
                    <p className="text-emerald-400 font-bold text-sm">{item.approved}</p>
                    <p className="text-gray-500 text-xs">Approved</p>
                  </div>
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2 text-center">
                    <p className="text-amber-400 font-bold text-sm">{item.pending}</p>
                    <p className="text-gray-500 text-xs">Pending</p>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2 text-center">
                    <p className="text-red-400 font-bold text-sm">{item.rejected}</p>
                    <p className="text-gray-500 text-xs">Rejected</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

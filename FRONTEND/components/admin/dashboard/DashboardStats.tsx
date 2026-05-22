"use client";
import { useEffect, useState } from "react";
import { RiCalendarEventLine, RiGroupLine, RiMoneyDollarCircleLine, RiCheckboxCircleLine } from "react-icons/ri";

interface Overview {
  totalEarnings: number;
  totalEventsConducted: number;
  totalUsers: number;
  totalSuccessfulEnrollments: number;
}

interface EngagementChartItem {
  month: string;
  enrollments: number;
}

interface DashboardData {
  overview: Overview;
  engagementChart: EngagementChartItem[];
}

export default function DashboardStats() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [engagementChart, setEngagementChart] = useState<EngagementChartItem[]>([]);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((res) => res.json())
      .then((d) => {
        setOverview(d.data?.overview ?? null);
        setEngagementChart(d.data?.engagementChart ?? []);
      })
      .catch(console.error);
  }, []);

  const stats = [
    { icon: RiCalendarEventLine, label: "Total Events", value: overview?.totalEventsConducted ?? "—", color: "text-primary", bg: "bg-primary/10" },
    { icon: RiGroupLine, label: "Total Users", value: overview?.totalUsers ?? "—", color: "text-violet-400", bg: "bg-violet-500/10" },
    { icon: RiCheckboxCircleLine, label: "Enrollments", value: overview?.totalSuccessfulEnrollments ?? "—", color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { icon: RiMoneyDollarCircleLine, label: "Total Revenue", value: overview ? `₹${overview.totalEarnings}` : "—", color: "text-amber-400", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="space-y-6">
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
      
      {/* Engagement Chart */}
      <div className="bg-dark-3 border border-border rounded-xl p-4">
        <h2 className="text-white font-semibold mb-4">Monthly Enrollments</h2>
        {engagementChart.length > 0 ? (
          <div className="h-32 relative">
            {/* Chart Background */}
            <div className="absolute inset-0 grid grid-cols-[repeat(auto-fill,minmax(30px,1fr))] gap-x-2">
              {engagementChart.map((item, index) => (
                <div key={index} className="flex flex-col items-end justify-bottom">
                  <div className="w-3 bg-primary/20 rounded-t-lg" 
                       style={{ height: `${Math.min((item.enrollments || 0) * 4, 90)}%` }}></div>
                  <p className="text-xs text-gray-500 mt-1">{item.month}</p>
                </div>
              ))}
            </div>
            {/* Chart Bars */}
            <div className="absolute inset-0 grid grid-cols-[repeat(auto-fill,minmax(30px,1fr))] gap-x-2 pointer-events-none">
              {engagementChart.map((item, index) => (
                <div key={index} className="flex flex-col items-end justify-bottom">
                  <div className="w-3 bg-primary rounded-t-lg" 
                       style={{ height: `${Math.min((item.enrollments || 0) * 4, 90)}%` }}></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm text-center">No engagement data available</p>
        )}
      </div>
    </div>
  );
}

import { RiBarChartBoxLine, RiGroupLine, RiLineChartLine, RiArrowUpLine } from "react-icons/ri";

const metrics = [
  { label: "Page Views", icon: RiBarChartBoxLine },
  { label: "Unique Visitors", icon: RiGroupLine },
  { label: "Avg. Session", icon: RiLineChartLine },
  { label: "Bounce Rate", icon: RiArrowUpLine },
];

export default function AnalyticsPerformance() {
  return (
    <div className="bg-dark-3 border border-border rounded-xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RiLineChartLine size={15} className="text-gray-500" />
          <p className="text-white font-semibold text-sm">Web Performance</p>
        </div>
        <span className="text-xs text-gray-600 bg-dark-4 border border-border px-2.5 py-1 rounded-lg">Not connected</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-border">
        {metrics.map(({ label, icon: Icon }) => (
          <div key={label} className="p-5 flex flex-col gap-2">
            <Icon size={14} className="text-gray-600" />
            <p className="text-2xl font-bold text-gray-700">—</p>
            <p className="text-gray-500 text-xs">{label}</p>
          </div>
        ))}
      </div>

      <div className="px-5 py-4 border-t border-border bg-dark-4/50 flex items-center justify-between">
        <p className="text-gray-600 text-xs">
          Add{" "}
          <code className="text-gray-500 bg-dark-4 px-1.5 py-0.5 rounded text-[11px]">@vercel/analytics</code>
          {" "}or Google Analytics to unlock real data.
        </p>
        <a
          href="https://vercel.com/docs/analytics"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:underline shrink-0 ml-4"
        >
          Learn how →
        </a>
      </div>
    </div>
  );
}

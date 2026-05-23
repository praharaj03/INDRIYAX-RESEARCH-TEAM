import { RiVipCrownLine, RiFlashlightLine, RiShieldLine, RiGroupLine, RiMoneyDollarCircleLine } from "react-icons/ri";

// TODO (Backend Dev): Replace all mock values with real DB queries
// import { SubscriptionModel } from "@/lib/models/Subscription";
// const stats = await SubscriptionModel.aggregate([...]);

const mockStats = {
  total: 0,
  active: 0,
  pro: 0,
  elite: 0,
  free: 0,
  mrr: 0,
};

const tiers = [
  { id: "free",  label: "Free",  icon: RiShieldLine,          color: "text-gray-400",   bg: "bg-white/5",         count: mockStats.free,  pct: 0 },
  { id: "pro",   label: "Pro",   icon: RiFlashlightLine,      color: "text-primary",    bg: "bg-primary/10",      count: mockStats.pro,   pct: 0 },
  { id: "elite", label: "Elite", icon: RiVipCrownLine,        color: "text-amber-400",  bg: "bg-amber-500/10",    count: mockStats.elite, pct: 0 },
];

export default function AnalyticsSubscriptions() {
  return (
    <div className="bg-dark-3 border border-border rounded-xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RiVipCrownLine size={15} className="text-amber-400" />
          <p className="text-white font-semibold text-sm">Subscriptions</p>
        </div>
        <span className="text-xs text-gray-600 bg-dark-4 border border-border px-2.5 py-1 rounded-lg">
          Backend required
        </span>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
        {[
          { icon: RiGroupLine,              label: "Total Users",   value: mockStats.total,  color: "text-gray-400" },
          { icon: RiVipCrownLine,           label: "Active Subs",   value: mockStats.active, color: "text-primary"  },
          { icon: RiMoneyDollarCircleLine,  label: "MRR",           value: mockStats.mrr ? `₹${mockStats.mrr.toLocaleString()}` : "—", color: "text-emerald-400" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="p-4 flex flex-col gap-1.5">
            <Icon size={14} className={color} />
            <p className={`text-xl font-bold ${value === 0 || value === "—" ? "text-gray-700" : "text-white"}`}>
              {value === 0 ? "—" : value}
            </p>
            <p className="text-gray-500 text-xs">{label}</p>
          </div>
        ))}
      </div>

      {/* Tier breakdown */}
      <div className="p-5 flex flex-col gap-3">
        <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider">Plan Distribution</p>
        {tiers.map(({ id, label, icon: Icon, color, bg, count, pct }) => (
          <div key={id} className="flex items-center gap-3">
            <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
              <Icon size={13} className={color} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-400 text-xs">{label}</span>
                <span className="text-gray-600 text-xs">{count} users · {pct}%</span>
              </div>
              <div className="h-1 bg-dark-4 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    id === "pro" ? "bg-primary" : id === "elite" ? "bg-amber-400" : "bg-gray-600"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 py-3.5 border-t border-border bg-dark-4/40 flex items-center justify-between">
        <p className="text-gray-600 text-xs">
          Connect <code className="text-gray-500 bg-dark-4 px-1.5 py-0.5 rounded text-[11px]">SubscriptionModel</code> to see real data.
        </p>
        <a href="/events" target="_blank" className="text-xs text-primary hover:underline shrink-0 ml-4">
          View events →
        </a>
      </div>
    </div>
  );
}

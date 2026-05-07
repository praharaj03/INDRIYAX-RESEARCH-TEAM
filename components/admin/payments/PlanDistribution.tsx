import { RiVipCrownLine, RiFlashlightLine, RiShieldLine } from "react-icons/ri";

// TODO (Backend Dev): Replace with real counts from SubscriptionModel
const tiers = [
  { label: "Free",  icon: RiShieldLine,     color: "text-gray-400",  dot: "bg-gray-500",   count: 0, pct: 0 },
  { label: "Pro",   icon: RiFlashlightLine, color: "text-primary",   dot: "bg-primary",    count: 0, pct: 0 },
  { label: "Elite", icon: RiVipCrownLine,   color: "text-amber-400", dot: "bg-amber-400",  count: 0, pct: 0 },
];

export default function PlanDistribution() {
  const r = 44;
  const circ = 2 * Math.PI * r;

  return (
    <div className="bg-dark-3 border border-border rounded-xl p-5">
      <p className="text-white font-semibold text-sm mb-4">Plan Distribution</p>

      {/* Mini donut */}
      <div className="flex items-center justify-center mb-5">
        <div className="relative">
          <svg width="110" height="110" viewBox="0 0 110 110" className="-rotate-90">
            <circle cx="55" cy="55" r={r} fill="none" stroke="#1C2128" strokeWidth="12" />
            {/* All empty — backend will fill */}
            <circle cx="55" cy="55" r={r} fill="none" stroke="#21262D" strokeWidth="12"
              strokeDasharray={`${circ} 0`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-gray-700 font-bold text-xl leading-none">—</p>
            <p className="text-gray-600 text-[10px] mt-0.5">users</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {tiers.map(({ label, icon: Icon, color, dot, count, pct }) => (
          <div key={label} className="flex items-center gap-2.5">
            <span className={`w-2 h-2 rounded-full ${dot} shrink-0`} />
            <Icon size={13} className={color} />
            <span className="text-gray-400 text-xs flex-1">{label}</span>
            <span className={`text-xs font-semibold ${count === 0 ? "text-gray-700" : "text-white"}`}>
              {count === 0 ? "—" : count}
            </span>
            <span className="text-gray-600 text-xs w-8 text-right">{pct}%</span>
          </div>
        ))}
      </div>

      <div className="mt-4 h-1.5 bg-dark-4 rounded-full overflow-hidden">
        <div className="h-full bg-dark-4 rounded-full w-full" />
      </div>

      <p className="text-gray-700 text-[11px] mt-3 text-center">Connect SubscriptionModel to populate</p>
    </div>
  );
}

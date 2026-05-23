import { RiVipCrownLine, RiFlashlightLine, RiShieldLine } from "react-icons/ri";

// TODO (Backend Dev): Replace with real data
// const subs = await SubscriptionModel.find().populate("userId").sort({ createdAt: -1 }).limit(10);

const mockRows = [
  { user: "—", email: "—", plan: "—", status: "—", start: "—", end: "—" },
  { user: "—", email: "—", plan: "—", status: "—", start: "—", end: "—" },
  { user: "—", email: "—", plan: "—", status: "—", start: "—", end: "—" },
];

const planIcon: Record<string, React.ElementType> = {
  elite: RiVipCrownLine,
  pro: RiFlashlightLine,
  free: RiShieldLine,
  "—": RiShieldLine,
};
const planColor: Record<string, string> = {
  elite: "text-amber-400",
  pro: "text-primary",
  free: "text-gray-500",
  "—": "text-gray-600",
};
const statusStyle: Record<string, string> = {
  active:    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  expired:   "bg-red-500/10 text-red-400 border-red-500/20",
  cancelled: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  "—":       "bg-white/5 text-gray-600 border-border",
};

export default function SubscriptionRoster() {
  return (
    <div className="bg-dark-3 border border-border rounded-xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
        <p className="text-white font-semibold text-sm">Subscribers</p>
        <span className="text-xs text-gray-600 bg-dark-4 border border-border px-2.5 py-1 rounded-lg">
          Backend required
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {["User", "Email", "Plan", "Status", "Start", "Expires"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs text-gray-600 font-semibold uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockRows.map((row, i) => {
              const PlanIcon = planIcon[row.plan] ?? RiShieldLine;
              return (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5 text-gray-400 text-xs font-medium">{row.user}</td>
                  <td className="px-5 py-3.5 text-gray-600 text-xs">{row.email}</td>
                  <td className="px-5 py-3.5">
                    <div className={`flex items-center gap-1.5 text-xs font-medium ${planColor[row.plan] ?? "text-gray-600"}`}>
                      <PlanIcon size={12} />
                      {row.plan === "—" ? "—" : row.plan.charAt(0).toUpperCase() + row.plan.slice(1)}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${statusStyle[row.status] ?? statusStyle["—"]}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 text-xs">{row.start}</td>
                  <td className="px-5 py-3.5 text-gray-600 text-xs">{row.end}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3.5 border-t border-border bg-dark-4/40">
        <p className="text-gray-600 text-xs">
          Wire up <code className="text-gray-500 bg-dark-4 px-1.5 py-0.5 rounded text-[11px]">GET /api/admin/subscriptions</code> to populate this table
        </p>
      </div>
    </div>
  );
}

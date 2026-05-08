import { RiArrowRightLine } from "react-icons/ri";

// TODO (Backend Dev): Replace with real data from PaymentModel
// const payments = await PaymentModel.find().sort({ createdAt: -1 }).limit(8).populate("userId");

const mockRows = [
  { id: "—", user: "—", plan: "—", amount: "—", status: "—", date: "—" },
  { id: "—", user: "—", plan: "—", amount: "—", status: "—", date: "—" },
  { id: "—", user: "—", plan: "—", amount: "—", status: "—", date: "—" },
  { id: "—", user: "—", plan: "—", amount: "—", status: "—", date: "—" },
];

const statusStyle: Record<string, string> = {
  paid:     "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  failed:   "bg-red-500/10 text-red-400 border-red-500/20",
  refunded: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "—":      "bg-white/5 text-gray-600 border-border",
};

export default function RecentTransactions() {
  return (
    <div className="bg-dark-3 border border-border rounded-xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
        <p className="text-white font-semibold text-sm">Recent Transactions</p>
        <span className="text-xs text-gray-600 bg-dark-4 border border-border px-2.5 py-1 rounded-lg">
          Backend required
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {["Payment ID", "User", "Plan", "Amount", "Status", "Date"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs text-gray-600 font-semibold uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockRows.map((row, i) => (
              <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-3.5 text-gray-600 text-xs font-mono">{row.id}</td>
                <td className="px-5 py-3.5 text-gray-500 text-xs">{row.user}</td>
                <td className="px-5 py-3.5">
                  <span className="text-gray-600 text-xs">{row.plan}</span>
                </td>
                <td className="px-5 py-3.5 text-gray-500 text-xs font-medium">{row.amount}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${statusStyle[row.status] ?? statusStyle["—"]}`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-gray-600 text-xs">{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3.5 border-t border-border bg-dark-4/40 flex items-center justify-between">
        <p className="text-gray-600 text-xs">
          Wire up <code className="text-gray-500 bg-dark-4 px-1.5 py-0.5 rounded text-[11px]">GET /api/admin/payments</code> to populate this table
        </p>
        <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary transition-colors">
          View all <RiArrowRightLine size={11} />
        </button>
      </div>
    </div>
  );
}

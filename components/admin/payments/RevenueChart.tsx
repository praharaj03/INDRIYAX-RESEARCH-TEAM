"use client";
// TODO (Backend Dev): Replace mockData with real monthly revenue from PaymentModel
// const data = await PaymentModel.aggregate([
//   { $match: { status: "paid" } },
//   { $group: { _id: { $month: "$createdAt" }, total: { $sum: "$amount" } } }
// ]);

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// All zeros until backend is connected
const mockData = months.map((m) => ({ month: m, pro: 0, elite: 0 }));
const maxVal = 1; // avoid division by zero

export default function RevenueChart() {
  return (
    <div className="bg-dark-3 border border-border rounded-xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
        <div>
          <p className="text-white font-semibold text-sm">Monthly Revenue</p>
          <p className="text-gray-600 text-xs mt-0.5">Pro + Elite subscriptions</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-gray-500 text-xs">Pro</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-gray-500 text-xs">Elite</span>
          </div>
          <span className="text-xs text-gray-600 bg-dark-4 border border-border px-2.5 py-1 rounded-lg">
            Backend required
          </span>
        </div>
      </div>

      <div className="p-5">
        {/* Chart bars */}
        <div className="flex items-end gap-1.5 h-36">
          {mockData.map(({ month, pro, elite }) => {
            const total = pro + elite;
            const proH = (pro / maxVal) * 100;
            const eliteH = (elite / maxVal) * 100;
            return (
              <div key={month} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="w-full flex flex-col justify-end gap-0.5" style={{ height: "120px" }}>
                  {/* Stacked bar */}
                  <div className="w-full flex flex-col justify-end rounded-sm overflow-hidden gap-px">
                    <div
                      className="w-full bg-amber-400/70 rounded-t-sm transition-all"
                      style={{ height: `${Math.max(eliteH, total > 0 ? 2 : 0)}%` }}
                    />
                    <div
                      className="w-full bg-primary/70 transition-all"
                      style={{ height: `${Math.max(proH, total > 0 ? 2 : 0)}%` }}
                    />
                    {total === 0 && (
                      <div className="w-full bg-dark-4 rounded-sm" style={{ height: "100%" }} />
                    )}
                  </div>
                </div>
                <span className="text-[10px] text-gray-600 group-hover:text-gray-400 transition-colors">{month}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-border flex items-center justify-center">
          <p className="text-gray-600 text-xs text-center">
            Connect <code className="text-gray-500 bg-dark-4 px-1.5 py-0.5 rounded text-[11px]">PaymentModel</code> to populate revenue data
          </p>
        </div>
      </div>
    </div>
  );
}

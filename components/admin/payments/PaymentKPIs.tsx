import {
  RiMoneyDollarCircleLine, RiGroupLine,
  RiVipCrownLine, RiRefundLine,
} from "react-icons/ri";

// TODO (Backend Dev): Replace with real aggregated DB values
// const stats = await PaymentModel.aggregate([...])
const kpis = [
  {
    icon: RiMoneyDollarCircleLine,
    label: "Total Revenue",
    value: "—",
    sub: "All time",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    trend: null,
  },
  {
    icon: RiMoneyDollarCircleLine,
    label: "MRR",
    value: "—",
    sub: "This month",
    color: "text-primary",
    bg: "bg-primary/10",
    trend: null,
  },
  {
    icon: RiGroupLine,
    label: "Active Subscribers",
    value: "—",
    sub: "Pro + Elite",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    trend: null,
  },
  {
    icon: RiVipCrownLine,
    label: "Elite Members",
    value: "—",
    sub: "Annual plan",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    trend: null,
  },
  {
    icon: RiGroupLine,
    label: "Pro Members",
    value: "—",
    sub: "Monthly plan",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    trend: null,
  },
  {
    icon: RiRefundLine,
    label: "Refunds",
    value: "—",
    sub: "All time",
    color: "text-red-400",
    bg: "bg-red-500/10",
    trend: null,
  },
];

export default function PaymentKPIs() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
      {kpis.map(({ icon: Icon, label, value, sub, color, bg }) => (
        <div key={label} className="bg-dark-3 border border-border rounded-xl p-4 flex flex-col gap-2">
          <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
            <Icon size={15} className={color} />
          </div>
          <p className={`text-xl font-bold leading-none ${value === "—" ? "text-gray-700" : "text-white"}`}>{value}</p>
          <div>
            <p className="text-gray-400 text-xs font-medium">{label}</p>
            <p className="text-gray-600 text-[11px]">{sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

import PaymentKPIs from "@/components/admin/payments/PaymentKPIs";
import RevenueChart from "@/components/admin/payments/RevenueChart";
import RecentTransactions from "@/components/admin/payments/RecentTransactions";
import SubscriptionRoster from "@/components/admin/payments/SubscriptionRoster";
import PricingControls from "@/components/admin/payments/PricingControls";
import PlanDistribution from "@/components/admin/payments/PlanDistribution";

export default function PaymentsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white font-bold text-xl tracking-tight">Payments & Subscriptions</h1>
          <p className="text-gray-500 text-sm mt-0.5">Revenue overview, subscriber management, and pricing controls</p>
        </div>
        <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg font-medium">
          Connect backend to activate
        </span>
      </div>

      {/* KPI strip */}
      <PaymentKPIs />

      {/* Revenue chart + plan distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <RevenueChart />
        </div>
        <PlanDistribution />
      </div>

      {/* Transactions + pricing controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RecentTransactions />
        </div>
        <PricingControls />
      </div>

      {/* Subscriber roster — full width */}
      <SubscriptionRoster />

    </div>
  );
}

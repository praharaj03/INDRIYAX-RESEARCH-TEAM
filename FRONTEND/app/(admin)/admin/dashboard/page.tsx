import DashboardStats from "@/components/admin/dashboard/DashboardStats";
import DashboardRecentEvents from "@/components/admin/dashboard/DashboardRecentEvents";
import DashboardNextEvent from "@/components/admin/dashboard/DashboardNextEvent";
import DashboardQuickActions from "@/components/admin/dashboard/DashboardQuickActions";

export default function DashboardPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-white font-bold text-xl tracking-tight">Good to see you 👋</h1>
        <p className="text-gray-500 text-sm mt-0.5">Here's a snapshot of IndriyaX.</p>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <DashboardRecentEvents />
        <div className="flex flex-col gap-4">
          <DashboardNextEvent />
          <DashboardQuickActions />
        </div>
      </div>
    </div>
  );
}

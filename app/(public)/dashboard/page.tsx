import AnimateIn from "@/components/ui/AnimateIn";
import { RiCalendarEventLine, RiUserLine, RiMailLine } from "react-icons/ri";
import Link from "next/link";

// TODO (Backend Dev): Replace mock data with real Clerk currentUser() + MongoDB registrations
// import { currentUser } from "@clerk/nextjs/server";
// import { connectDB } from "@/config/db";
// import { RegistrationModel } from "@/lib/models/Registration";

const mockUser = { name: "Dr. Your Name", email: "you@example.com" };
const mockRegistrations: { eventTitle: string; eventDate: string; status: string }[] = [];

export default function DashboardPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <AnimateIn>
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            My Dashboard
          </div>
          <h1 className="text-3xl font-bold text-white">Welcome, {mockUser.name} 👋</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your registrations and profile</p>
        </div>
      </AnimateIn>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <AnimateIn delay={0.05} className="md:col-span-1">
          <div className="bg-dark-3 border border-border rounded-2xl p-6">
            <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-4">Profile</p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <RiUserLine className="text-primary shrink-0" size={14} /> {mockUser.name}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <RiMailLine className="text-primary shrink-0" size={14} /> {mockUser.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <RiCalendarEventLine className="text-primary shrink-0" size={14} />
                {mockRegistrations.length} registrations
              </div>
            </div>
            <div className="mt-4 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs px-3 py-2 rounded-xl">
              🔧 Connect Clerk + MongoDB to show real user data
            </div>
          </div>
        </AnimateIn>

        <AnimateIn delay={0.1} className="md:col-span-2">
          <div className="bg-dark-3 border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="text-white font-semibold text-sm">My Registrations</h3>
            </div>
            <div className="px-5 py-10 text-center">
              <p className="text-gray-600 text-sm mb-3">No registrations yet</p>
              <Link href="/events/upcoming" className="text-primary text-sm hover:underline">
                Browse upcoming events →
              </Link>
            </div>
          </div>
        </AnimateIn>
      </div>
    </div>
  );
}

"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import AnimateIn from "@/components/ui/AnimateIn";
import { RiCalendarEventLine, RiUserLine, RiMailLine } from "react-icons/ri";
import Link from "next/link";
import { getSession } from "@/services/authService";
import { apiFetch } from "@/lib/api";

interface UserProfile {
  fullName?: string;
  email: string;
  role: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const session = await getSession();
        if (!session) return;
        const data = await apiFetch("/api/v1/auth/me", {}, session.access_token);
        setUser(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-600">Loading...</div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">Please sign in to view your dashboard.</p>
        <Link href="/login" className="text-primary hover:underline">Sign in →</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <AnimateIn>
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            My Dashboard
          </div>
          <h1 className="text-3xl font-bold text-white">Welcome, {user.fullName ?? user.email} 👋</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your registrations and profile</p>
        </div>
      </AnimateIn>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <AnimateIn delay={0.05} className="md:col-span-1">
          <div className="bg-dark-3 border border-border rounded-2xl p-6">
            <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-4">Profile</p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <RiUserLine className="text-primary shrink-0" size={14} /> {user.fullName ?? "—"}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <RiMailLine className="text-primary shrink-0" size={14} /> {user.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <RiCalendarEventLine className="text-primary shrink-0" size={14} /> {user.role}
              </div>
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

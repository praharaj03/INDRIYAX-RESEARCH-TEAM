"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AnimateIn from "@/components/ui/AnimateIn";
import {
  RiCalendarEventLine, RiUserLine, RiMailLine,
  RiEditLine, RiSaveLine, RiCloseLine, RiLogoutBoxRLine,
  RiCameraLine, RiShieldCheckLine, RiLoader4Line,
} from "react-icons/ri";
import Link from "next/link";
import { getSession, signOut } from "@/services/authService";
import { apiFetch, getToken } from "@/lib/api";
import { useAppStore } from "@/store";

interface UserProfile {
  id: string;
  fullName?: string;
  email: string;
  role: string;
  imageUrl?: string;
  createdAt?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const { logout: storeLogout } = useAppStore();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: "", imageUrl: "" });
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    async function load() {
      try {
        const session = await getSession();
        if (!session) {
          router.push("/login");
          return;
        }
        const data = await apiFetch("/api/v1/auth/me", {}, session.access_token);
        const profile = data.data as UserProfile;
        setUser(profile);
        setEditForm({
          fullName: profile?.fullName || "",
          imageUrl: profile?.imageUrl || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "avatars");

      const token = getToken();
      const data = await apiFetch("/api/v1/uploads/image", {
        method: "POST",
        body: fd,
      }, token ?? undefined);

      const url = data.data?.url;
      if (url) {
        setEditForm((prev) => ({ ...prev, imageUrl: url }));
        // Auto-save avatar
        const session = await getSession();
        if (session) {
          await apiFetch("/api/v1/auth/me", {
            method: "PATCH",
            body: JSON.stringify({ imageUrl: url }),
          }, session.access_token);
          setUser((prev) => prev ? { ...prev, imageUrl: url } : prev);
          setMessage({ type: "success", text: "Avatar updated!" });
          setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        }
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to upload avatar" });
    } finally {
      setUploadingAvatar(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const session = await getSession();
      if (!session) return;

      const data = await apiFetch("/api/v1/auth/me", {
        method: "PATCH",
        body: JSON.stringify({
          fullName: editForm.fullName,
          ...(editForm.imageUrl ? { imageUrl: editForm.imageUrl } : {}),
        }),
      }, session.access_token);

      setUser(data.data as UserProfile);
      setEditing(false);
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to update" });
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await signOut();
    storeLogout();
    router.push("/");
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex items-center justify-center min-h-[50vh]">
        <RiLoader4Line className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">Please sign in to view your dashboard.</p>
        <Link href="/login" className="text-primary hover:underline">Sign in</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <AnimateIn>
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              My Profile
            </div>
            <h1 className="text-3xl font-bold text-white">
              Welcome, {user.fullName || user.email.split("@")[0]}
            </h1>
            <p className="text-gray-500 text-sm mt-1">Manage your profile and settings</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 border border-border text-gray-400 hover:text-red-400 hover:border-red-500/30 text-sm font-medium px-4 py-2.5 rounded-xl transition-all"
          >
            <RiLogoutBoxRLine size={16} /> Logout
          </button>
        </div>
      </AnimateIn>

      {/* Success/Error Message */}
      {message.text && (
        <AnimateIn>
          <div className={`mb-6 px-4 py-3 rounded-xl text-sm border ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}>
            {message.text}
          </div>
        </AnimateIn>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <AnimateIn delay={0.05} className="md:col-span-1">
          <div className="bg-dark-3 border border-border rounded-2xl p-6">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/30 bg-dark-4">
                  {user.imageUrl ? (
                    <Image
                      src={user.imageUrl}
                      alt={user.fullName || "Avatar"}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-primary/60">
                      {(user.fullName || user.email)[0].toUpperCase()}
                    </div>
                  )}
                </div>
                {/* Upload overlay */}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-dark flex items-center justify-center border-2 border-dark-3 hover:bg-primary/80 transition-all disabled:opacity-60"
                  title="Change avatar"
                >
                  {uploadingAvatar ? (
                    <RiLoader4Line size={14} className="animate-spin" />
                  ) : (
                    <RiCameraLine size={14} />
                  )}
                </button>
              </div>
              <p className="text-white font-semibold text-base mt-3">{user.fullName || "—"}</p>
              <p className="text-gray-500 text-xs">{user.email}</p>
            </div>

            {/* Role badge */}
            <div className="flex items-center justify-center mb-5">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                <RiShieldCheckLine size={12} /> {user.role}
              </span>
            </div>

            {/* Member since */}
            {user.createdAt && (
              <p className="text-center text-gray-600 text-xs">
                Member since {new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
              </p>
            )}
          </div>
        </AnimateIn>

        {/* Profile Details + Edit */}
        <AnimateIn delay={0.1} className="md:col-span-2">
          <div className="bg-dark-3 border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h3 className="text-white font-semibold text-sm">Profile Details</h3>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-primary/10"
                >
                  <RiEditLine size={13} /> Edit
                </button>
              ) : (
                <button
                  onClick={() => { setEditing(false); setEditForm({ fullName: user.fullName || "", imageUrl: user.imageUrl || "" }); }}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-500/10"
                >
                  <RiCloseLine size={13} /> Cancel
                </button>
              )}
            </div>

            <div className="p-5">
              {editing ? (
                <div className="flex flex-col gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="text-xs text-gray-500 font-medium mb-1.5 block">Full Name</label>
                    <input
                      type="text"
                      value={editForm.fullName}
                      onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                      placeholder="Enter your full name"
                      className="w-full bg-dark-4 border border-border text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-gray-700"
                    />
                  </div>

                  {/* Image URL (optional manual input) */}
                  <div>
                    <label className="text-xs text-gray-500 font-medium mb-1.5 block">Profile Image URL <span className="text-gray-700">(or use camera icon to upload)</span></label>
                    <input
                      type="url"
                      value={editForm.imageUrl}
                      onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-dark-4 border border-border text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-gray-700"
                    />
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 w-full bg-primary text-dark font-semibold py-3 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-60 mt-2"
                  >
                    {saving ? "Saving..." : <><RiSaveLine size={15} /> Save Changes</>}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 py-3 border-b border-border/50">
                    <RiUserLine className="text-primary shrink-0" size={16} />
                    <div>
                      <p className="text-gray-500 text-xs">Full Name</p>
                      <p className="text-white text-sm font-medium">{user.fullName || "Not set"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 py-3 border-b border-border/50">
                    <RiMailLine className="text-primary shrink-0" size={16} />
                    <div>
                      <p className="text-gray-500 text-xs">Email</p>
                      <p className="text-white text-sm font-medium">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 py-3 border-b border-border/50">
                    <RiShieldCheckLine className="text-primary shrink-0" size={16} />
                    <div>
                      <p className="text-gray-500 text-xs">Role</p>
                      <p className="text-white text-sm font-medium capitalize">{user.role?.toLowerCase()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 py-3">
                    <RiCalendarEventLine className="text-primary shrink-0" size={16} />
                    <div>
                      <p className="text-gray-500 text-xs">Joined</p>
                      <p className="text-white text-sm font-medium">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
                          : "—"
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enrollments Section */}
          <div className="bg-dark-3 border border-border rounded-2xl overflow-hidden mt-6">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="text-white font-semibold text-sm">My Event Enrollments</h3>
            </div>
            <div className="px-5 py-10 text-center">
              <p className="text-gray-600 text-sm mb-3">No enrollments yet</p>
              <Link href="/events/upcoming" className="text-primary text-sm hover:underline">
                Browse upcoming events
              </Link>
            </div>
          </div>
        </AnimateIn>
      </div>
    </div>
  );
}

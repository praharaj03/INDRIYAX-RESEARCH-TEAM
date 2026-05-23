"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { RiMailLine, RiLockPasswordLine, RiEyeLine, RiEyeOffLine, RiArrowRightLine, RiUserLine, RiShieldUserLine } from "react-icons/ri";
import { signIn } from "@/services/authService";
import { apiFetch } from "@/lib/api";
import { useAppStore } from "@/store";

const inputClass = "w-full bg-dark-4 border border-border text-[var(--color-text)] text-sm rounded-xl pl-9 pr-4 py-3 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-[var(--color-text-muted)]";

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setToken } = useAppStore();
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState<"user" | "admin">("user");
  const [form, setForm] = useState({ email: "", password: "", adminUser: "", adminPass: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleUserLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const session = await signIn(form.email, form.password);
      const token = session.session?.access_token;
      if (token) {
        setToken(token);
        try {
          const profile = await apiFetch("/api/v1/auth/me", {}, token);
          setUser(profile.data as { id: string; email: string; fullName?: string; imageUrl?: string; role?: string } | null);
        } catch { /* continue */ }
      }
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.adminUser, password: form.adminPass }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Invalid admin credentials");
      }
      router.push("/admin/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Admin login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
      <div className="relative w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <Link href="/" className="flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-primary/20">
              <Image src="/logo.jpeg" alt="IndriyaX" width={36} height={36} className="object-cover w-full h-full" />
            </div>
            <span className="font-bold text-[var(--color-text)] text-lg">Indriya<span className="text-primary">X</span></span>
          </Link>
          <h1 className="text-[var(--color-text)] font-bold text-2xl">Welcome back</h1>
          <p className="text-[var(--color-text-muted)] text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="bg-dark-3 border border-border rounded-2xl p-6 shadow-2xl shadow-black/20">
          {/* Role Toggle */}
          <div className="flex gap-1 p-1 bg-dark-4 border border-border rounded-xl mb-5">
            <button
              type="button"
              onClick={() => { setRole("user"); setError(""); }}
              className={`flex-1 flex items-center justify-center gap-2 text-sm font-medium py-2.5 rounded-lg transition-all ${
                role === "user"
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              }`}
            >
              <RiUserLine size={15} /> User
            </button>
            <button
              type="button"
              onClick={() => { setRole("admin"); setError(""); }}
              className={`flex-1 flex items-center justify-center gap-2 text-sm font-medium py-2.5 rounded-lg transition-all ${
                role === "admin"
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              }`}
            >
              <RiShieldUserLine size={15} /> Admin
            </button>
          </div>

          {/* User Login Form */}
          {role === "user" && (
            <form onSubmit={handleUserLogin} className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-[var(--color-text-muted)] font-medium mb-1.5 block">Email</label>
                <div className="relative">
                  <RiMailLine className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={15} />
                  <input type="email" required autoComplete="email" placeholder="you@example.com"
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputClass} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs text-[var(--color-text-muted)] font-medium">Password</label>
                  <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
                </div>
                <div className="relative">
                  <RiLockPasswordLine className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={15} />
                  <input type={showPass ? "text" : "password"} required autoComplete="current-password"
                    placeholder="••••••••"
                    value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className={`${inputClass} pr-10`} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
                    {showPass ? <RiEyeOffLine size={15} /> : <RiEyeLine size={15} />}
                  </button>
                </div>
              </div>

              {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3 py-2.5 rounded-xl">{error}</div>}

              <button type="submit" disabled={loading}
                className="flex items-center justify-center gap-2 w-full bg-primary text-dark font-semibold py-3 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-60 mt-1">
                {loading ? "Signing in..." : <><span>Sign In</span><RiArrowRightLine size={15} /></>}
              </button>
            </form>
          )}

          {/* Admin Login Form */}
          {role === "admin" && (
            <form onSubmit={handleAdminLogin} className="flex flex-col gap-4">
              <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs px-3 py-2.5 rounded-xl mb-1">
                <RiShieldUserLine className="inline mr-1.5" size={12} />
                Admin access — you will be redirected to the admin panel
              </div>

              <div>
                <label className="text-xs text-[var(--color-text-muted)] font-medium mb-1.5 block">Admin Username</label>
                <div className="relative">
                  <RiUserLine className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={15} />
                  <input type="text" required autoComplete="username" placeholder="admin"
                    value={form.adminUser} onChange={(e) => setForm({ ...form, adminUser: e.target.value })}
                    className={inputClass} />
                </div>
              </div>

              <div>
                <label className="text-xs text-[var(--color-text-muted)] font-medium mb-1.5 block">Admin Password</label>
                <div className="relative">
                  <RiLockPasswordLine className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={15} />
                  <input type={showPass ? "text" : "password"} required autoComplete="current-password"
                    placeholder="••••••••"
                    value={form.adminPass} onChange={(e) => setForm({ ...form, adminPass: e.target.value })}
                    className={`${inputClass} pr-10`} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
                    {showPass ? <RiEyeOffLine size={15} /> : <RiEyeLine size={15} />}
                  </button>
                </div>
              </div>

              {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3 py-2.5 rounded-xl">{error}</div>}

              <button type="submit" disabled={loading}
                className="flex items-center justify-center gap-2 w-full bg-amber-500 text-dark font-semibold py-3 rounded-xl hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-60 mt-1">
                {loading ? "Signing in..." : <><span>Admin Sign In</span><RiArrowRightLine size={15} /></>}
              </button>
            </form>
          )}

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[var(--color-text-muted)] text-xs">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <p className="text-center text-sm text-[var(--color-text-muted)]">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline font-medium">Sign up free</Link>
          </p>
        </div>

        <p className="text-center text-[var(--color-text-muted)] text-xs mt-4">
          By signing in, you agree to our{" "}
          <Link href="#" className="hover:text-primary transition-colors">Terms</Link> &{" "}
          <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}

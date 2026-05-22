"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  RiMailLine, RiLockPasswordLine, RiEyeLine, RiEyeOffLine,
  RiUserLine, RiArrowRightLine, RiShieldLine, RiFlashlightLine, RiVipCrownLine,
} from "react-icons/ri";
import { signUp } from "@/services/authService";
import { apiFetch } from "@/lib/api";
import { useAppStore } from "@/store";

const plans = [
  { id: "free",  label: "Free",  price: "₹0",       icon: RiShieldLine,    color: "border-border text-[var(--color-text-muted)]" },
  { id: "pro",   label: "Pro",   price: "₹199/mo",  icon: RiFlashlightLine, color: "border-primary/40 text-primary" },
  { id: "elite", label: "Elite", price: "₹1,499/yr", icon: RiVipCrownLine,  color: "border-amber-500/40 text-amber-400" },
];

const inputClass = "w-full bg-dark-4 border border-border text-[var(--color-text)] text-sm rounded-xl pl-9 pr-4 py-3 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-[var(--color-text-muted)]";

function SignupForm() {
  const router = useRouter();
  const { setUser, setToken } = useAppStore();
  const params = useSearchParams();
  const defaultPlan = params.get("plan") ?? "free";

  const [showPass, setShowPass] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(defaultPlan);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const session = await signUp(form.email, form.password, form.name);
      const token = session.session?.access_token;
      if (token) {
        setToken(token);
        try {
          const profile = await apiFetch("/api/v1/auth/me", {}, token);
          setUser(profile.data);
        } catch { /* profile sync happens on backend */ }
      }
      // Auto-login: redirect to dashboard immediately after signup
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="text-xs text-[var(--color-text-muted)] font-medium mb-2 block">Choose your plan</label>
        <div className="grid grid-cols-3 gap-2">
          {plans.map(({ id, label, price, icon: Icon, color }) => (
            <button key={id} type="button" onClick={() => setSelectedPlan(id)}
              className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl border text-xs font-medium transition-all ${
                selectedPlan === id ? `${color} bg-primary/5` : "border-border text-[var(--color-text-muted)] hover:border-primary/30"
              }`}>
              <Icon size={14} />
              <span>{label}</span>
              <span className="text-[10px] opacity-70">{price}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs text-[var(--color-text-muted)] font-medium mb-1.5 block">Full Name</label>
        <div className="relative">
          <RiUserLine className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={15} />
          <input type="text" required autoComplete="name" placeholder="Dr. Your Name"
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass} />
        </div>
      </div>

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
        <label className="text-xs text-[var(--color-text-muted)] font-medium mb-1.5 block">Password</label>
        <div className="relative">
          <RiLockPasswordLine className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={15} />
          <input type={showPass ? "text" : "password"} required autoComplete="new-password"
            placeholder="Min. 8 characters" minLength={8}
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
        {loading ? "Creating account..." : <><span>Create Account</span><RiArrowRightLine size={15} /></>}
      </button>
    </form>
  );
}

export default function SignupPage() {
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
          <h1 className="text-[var(--color-text)] font-bold text-2xl">Create your account</h1>
          <p className="text-[var(--color-text-muted)] text-sm mt-1">Join India&apos;s optometry community</p>
        </div>

        <div className="bg-dark-3 border border-border rounded-2xl p-6 shadow-2xl shadow-black/20">
          <Suspense fallback={<div className="h-64 flex items-center justify-center text-[var(--color-text-muted)] text-sm">Loading...</div>}>
            <SignupForm />
          </Suspense>
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[var(--color-text-muted)] text-xs">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <p className="text-center text-sm text-[var(--color-text-muted)]">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">Sign in</Link>
          </p>
        </div>

        <p className="text-center text-[var(--color-text-muted)] text-xs mt-4">
          By signing up, you agree to our{" "}
          <Link href="#" className="hover:text-primary transition-colors">Terms</Link> &{" "}
          <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}

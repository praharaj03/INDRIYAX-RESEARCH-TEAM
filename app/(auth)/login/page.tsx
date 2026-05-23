"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { RiMailLine, RiLockPasswordLine, RiEyeLine, RiEyeOffLine, RiArrowRightLine } from "react-icons/ri";

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // TODO (Backend Dev): POST /api/auth/login with { email, password }
    // On success: set session cookie / JWT, redirect to /dashboard
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
  }

  const inputClass = "w-full bg-dark-4 border border-border text-white text-sm rounded-xl pl-9 pr-4 py-3 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-gray-700";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-primary/20">
              <Image src="/logo.jpeg" alt="IndriyaX" width={36} height={36} className="object-cover w-full h-full" />
            </div>
            <span className="font-bold text-white text-lg">Indriya<span className="text-primary">X</span></span>
          </Link>
          <h1 className="text-white font-bold text-2xl">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="bg-dark-3 border border-border rounded-2xl p-6 shadow-2xl shadow-black/40">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1.5 block">Email</label>
              <div className="relative">
                <RiMailLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={15} />
                <input
                  type="email" required autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-gray-500 font-medium">Password</label>
                <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <RiLockPasswordLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={15} />
                <input
                  type={showPass ? "text" : "password"} required autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={`${inputClass} pr-10`}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors">
                  {showPass ? <RiEyeOffLine size={15} /> : <RiEyeLine size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="flex items-center justify-center gap-2 w-full bg-primary text-dark font-semibold py-3 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-60 mt-1"
            >
              {loading ? "Signing in..." : <><span>Sign In</span><RiArrowRightLine size={15} /></>}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-gray-600 text-xs">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline font-medium">Sign up free</Link>
          </p>
        </div>

        <p className="text-center text-gray-700 text-xs mt-5">
          By signing in, you agree to our{" "}
          <Link href="#" className="hover:text-gray-500 transition-colors">Terms</Link> &{" "}
          <Link href="#" className="hover:text-gray-500 transition-colors">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}

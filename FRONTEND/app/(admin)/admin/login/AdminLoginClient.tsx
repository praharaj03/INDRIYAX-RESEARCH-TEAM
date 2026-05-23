"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { RiLockPasswordLine, RiUserLine, RiEyeLine, RiEyeOffLine, RiShieldLine } from "react-icons/ri";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") ?? "/admin/dashboard";

  const [form, setForm] = useState({ username: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (res.ok) {
      router.push(from);
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Login failed");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="text-xs text-gray-500 font-medium mb-1.5 block">Username</label>
        <div className="relative">
          <RiUserLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={15} />
          <input
            type="text"
            autoComplete="username"
            required
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full bg-dark-4 border border-border text-white text-sm rounded-xl pl-9 pr-4 py-3 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-gray-700"
            placeholder="admin"
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-500 font-medium mb-1.5 block">Password</label>
        <div className="relative">
          <RiLockPasswordLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={15} />
          <input
            type={showPass ? "text" : "password"}
            autoComplete="current-password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full bg-dark-4 border border-border text-white text-sm rounded-xl pl-9 pr-10 py-3 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-gray-700"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
          >
            {showPass ? <RiEyeOffLine size={15} /> : <RiEyeLine size={15} />}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3 py-2.5 rounded-xl">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-dark font-semibold py-3 rounded-xl hover:bg-primary/80 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
      >
        {loading ? "Verifying..." : "Enter Admin Panel"}
      </button>
    </form>
  );
}

export default function AdminLoginClient() {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-sm">
        <div className="bg-dark-3 border border-border rounded-2xl p-8 shadow-2xl shadow-black/50">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border border-primary/20 mb-4">
              <Image src="/logo.jpeg" alt="IndriyaX" width={56} height={56} className="object-cover w-full h-full" />
            </div>
            <h1 className="text-white font-bold text-xl">Admin Access</h1>
            <p className="text-gray-500 text-sm mt-1">IndriyaX Control Panel</p>
          </div>

          <div className="flex items-center justify-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold px-3 py-2 rounded-xl mb-6">
            <RiShieldLine size={13} /> Restricted Area — Authorized Personnel Only
          </div>

          <Suspense fallback={<div className="h-40 flex items-center justify-center text-gray-600 text-sm">Loading...</div>}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="text-center text-gray-700 text-xs mt-4">
          This area is monitored and access is logged.
        </p>
      </div>
    </div>
  );
}

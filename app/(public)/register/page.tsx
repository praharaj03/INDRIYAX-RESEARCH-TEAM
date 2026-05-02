import AnimateIn from "@/components/ui/AnimateIn";
import { RiUserLine, RiMailLine, RiLockPasswordLine, RiGoogleLine } from "react-icons/ri";

// TODO (Backend Dev): Replace this UI with <SignUp /> from @clerk/nextjs
// Clerk keys needed in .env.local:
//   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
//   CLERK_SECRET_KEY

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <AnimateIn className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            Create Account
          </div>
          <h1 className="text-3xl font-bold text-white">Join IndriyaX</h1>
          <p className="text-gray-500 text-sm mt-1">Register to access events and track your learning</p>
        </div>

        <div className="bg-dark-3 border border-border rounded-2xl p-7 shadow-2xl shadow-black/40">
          {/* Google OAuth button */}
          <button className="w-full flex items-center justify-center gap-2 bg-white/5 border border-border text-white text-sm font-medium py-3 rounded-xl hover:bg-white/10 transition-all mb-5">
            <RiGoogleLine size={16} /> Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-gray-600 text-xs">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1.5 block">Full Name</label>
              <div className="relative">
                <RiUserLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={15} />
                <input disabled placeholder="Dr. Your Name" className="w-full bg-dark-4 border border-border text-gray-500 text-sm rounded-xl pl-9 pr-4 py-3 cursor-not-allowed placeholder:text-gray-700" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1.5 block">Email</label>
              <div className="relative">
                <RiMailLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={15} />
                <input disabled placeholder="you@example.com" className="w-full bg-dark-4 border border-border text-gray-500 text-sm rounded-xl pl-9 pr-4 py-3 cursor-not-allowed placeholder:text-gray-700" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1.5 block">Password</label>
              <div className="relative">
                <RiLockPasswordLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={15} />
                <input disabled placeholder="••••••••" className="w-full bg-dark-4 border border-border text-gray-500 text-sm rounded-xl pl-9 pr-4 py-3 cursor-not-allowed placeholder:text-gray-700" />
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs px-3 py-2.5 rounded-xl">
              🔧 Auth integration pending — backend developer will connect Clerk here
            </div>

            <button disabled className="w-full bg-primary/50 text-dark font-semibold py-3 rounded-xl cursor-not-allowed text-sm">
              Create Account
            </button>
          </div>
        </div>
      </AnimateIn>
    </div>
  );
}

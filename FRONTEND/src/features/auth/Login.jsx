import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { supabase } from '../../api/supabase';
import { getErrorMessage } from '../../utils/apiMessage';

const ACCENT = '#0C6E72';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/profile';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please fill in all fields.');
    setIsLoading(true);
    const t = toast.loading('Authenticating…');
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('Welcome back!', { id: t });
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err, 'Invalid credentials.'), { id: t });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-[calc(100vh-88px)] flex items-center justify-center px-4 bg-indriya-bg dark:bg-indriya-darkBg"
      style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[420px]"
      >
        {/* Card */}
        <div className="bg-indriya-card dark:bg-indriya-darkCard border border-indriya-border dark:border-indriya-darkBorder rounded-[28px] p-8 shadow-premium dark:shadow-premium-dark relative overflow-hidden">
          {/* Top shimmer */}
          <div
            className="absolute top-0 inset-x-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(12,110,114,0.5), transparent)' }}
          />

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 mb-8 w-fit hover:opacity-80 transition-opacity group">
            <img
              src="/INDRIYAX_LOGO_EYE.jpeg"
              alt="INDRIYAX"
              className="h-8 md:h-9 w-auto object-contain rounded-md"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <span className="font-black tracking-[-0.03em] text-[21px]">
              <span style={{ color: ACCENT }}>INDRIYA</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-br from-[#3fb3b8] to-[#0C6E72]">
                X
              </span>
            </span>
          </Link>

          <h1 className="text-[26px] font-black text-indriya-text dark:text-indriya-darkText tracking-[-0.02em] mb-1">
            Welcome back
          </h1>
          <p className="text-[14px] text-indriya-muted dark:text-indriya-darkMuted mb-8">
            Sign in to your IndriyaX account.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold uppercase tracking-[0.08em] text-indriya-muted dark:text-indriya-darkMuted">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-indriya-secondary dark:bg-indriya-darkSecondary border border-indriya-border dark:border-indriya-darkBorder rounded-[14px] text-[14px] text-indriya-text dark:text-indriya-darkText placeholder:text-indriya-muted focus:outline-none transition-colors disabled:opacity-60"
                onFocus={(e) => (e.target.style.borderColor = ACCENT)}
                onBlur={(e) => (e.target.style.borderColor = '')}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold uppercase tracking-[0.08em] text-indriya-muted dark:text-indriya-darkMuted">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="w-full px-4 py-3 pr-11 bg-indriya-secondary dark:bg-indriya-darkSecondary border border-indriya-border dark:border-indriya-darkBorder rounded-[14px] text-[14px] text-indriya-text dark:text-indriya-darkText placeholder:text-indriya-muted focus:outline-none transition-colors disabled:opacity-60"
                  onFocus={(e) => (e.target.style.borderColor = ACCENT)}
                  onBlur={(e) => (e.target.style.borderColor = '')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-indriya-muted hover:text-indriya-text dark:hover:text-indriya-darkText transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 text-white font-bold text-[15px] rounded-[14px] transition-all hover:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 mt-1"
              style={{ backgroundColor: ACCENT, boxShadow: '0 4px 20px rgba(12,110,114,0.3)' }}
            >
              {isLoading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <><LogIn size={16} /> Sign In</>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-[13px] text-indriya-muted dark:text-indriya-darkMuted">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold hover:underline" style={{ color: ACCENT }}>
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
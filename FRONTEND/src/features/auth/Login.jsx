import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '../../api/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/profile';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error('Please fill in all fields.');
    }

    setIsLoading(true);
    const loadingToast = toast.loading('Authenticating...');

    try {
      // Authenticate directly with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Login successful!', { id: loadingToast });
      
      // The AuthContext listener automatically detects this sign-in, 
      // grabs the token, and fetches the profile from your Express backend in the background.
      
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message || 'Invalid credentials', { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md mt-16 p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome Back</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Sign in to your IndriyaX account.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-medical-500 dark:text-white"
            placeholder="admin@indriyax.com"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-medical-500 dark:text-white"
            placeholder="••••••••"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-medical-500 hover:bg-medical-600 text-white font-semibold rounded-lg shadow-md transition-all disabled:opacity-70"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        Don't have an account yet?{' '}
        <button 
          type="button"
          onClick={() => navigate('/register')} 
          className="text-medical-500 font-semibold hover:text-medical-600 hover:underline bg-transparent border-none p-0 cursor-pointer"
        >
          Sign Up
        </button>
      </div>

    </div>
  );
}
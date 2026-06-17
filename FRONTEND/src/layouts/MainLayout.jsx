import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../utils/ThemeContext';
import { useAuth } from '../features/auth/AuthContext';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function MainLayout({ children }) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300 flex flex-col">
      {/* Structural Header Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-medical-500 flex items-center justify-center font-bold text-white text-lg group-hover:scale-105 transition-transform">
              I
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Indriya<span className="text-medical-500">X</span>
            </span>
          </Link>

          {/* Desktop Center Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/events" className={`text-sm font-semibold transition-colors ${isActive('/events') ? 'text-medical-500' : 'text-slate-600 dark:text-slate-300 hover:text-medical-500'}`}>Events</Link>
            <Link to="/posts" className={`text-sm font-semibold transition-colors ${isActive('/posts') ? 'text-medical-500' : 'text-slate-600 dark:text-slate-300 hover:text-medical-500'}`}>Medical Blog</Link>
            <Link to="/about" className={`text-sm font-semibold transition-colors ${isActive('/about') ? 'text-medical-500' : 'text-slate-600 dark:text-slate-300 hover:text-medical-500'}`}>About Us</Link>
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={toggleTheme}
              className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <span className="text-xl">🌙</span> : <span className="text-xl">☀️</span>}
            </button>

            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  {['ADMIN', 'AUTHOR'].includes(user.role) ? (
                    <Link to="/dashboard" className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-medical-500 transition-colors">Admin Dashboard</Link>
                  ) : (
                    <Link to="/profile" className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-medical-500 transition-colors">My Profile</Link>
                  )}
                  <button onClick={logout} className="rounded-md bg-slate-200 dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700 transition-all">Sign Out</button>
                </>
              ) : (
                <Link to="/login" className="rounded-md bg-medical-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-medical-500/30 hover:bg-medical-600 transition-all hover:-translate-y-0.5">Sign In</Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden p-2 text-slate-600 dark:text-slate-300" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-4 shadow-lg animate-in slide-in-from-top-2">
            <Link to="/events" className="block text-base font-medium text-slate-900 dark:text-white" onClick={() => setIsMobileMenuOpen(false)}>Events</Link>
            <Link to="/posts" className="block text-base font-medium text-slate-900 dark:text-white" onClick={() => setIsMobileMenuOpen(false)}>Medical Blog</Link>
            <Link to="/about" className="block text-base font-medium text-slate-900 dark:text-white" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
            
            <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
              {user ? (
                <div className="flex flex-col gap-3">
                  <Link to={['ADMIN', 'AUTHOR'].includes(user.role) ? "/dashboard" : "/profile"} className="block text-base font-medium text-slate-900 dark:text-white" onClick={() => setIsMobileMenuOpen(false)}>Dashboard / Profile</Link>
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="text-left text-base font-medium text-red-500">Sign Out</button>
                </div>
              ) : (
                <Link to="/login" className="block w-full text-center rounded-md bg-medical-500 px-4 py-3 text-base font-semibold text-white" onClick={() => setIsMobileMenuOpen(false)}>Sign In / Register</Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Viewport */}
      <main className="flex-grow flex flex-col w-full">
        {children}
      </main>
    </div>
  );
}
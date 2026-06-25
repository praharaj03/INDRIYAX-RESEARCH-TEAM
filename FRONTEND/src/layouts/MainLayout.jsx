import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import { useTheme } from "../utils/ThemeContext";
import {
  Menu,
  X,
  Search,
  Moon,
  Sun,
  LogOut,
  LayoutDashboard,
  User,
  ChevronDown,
} from "lucide-react";
import Lenis from "lenis";

/* Brand accent — matches Home / About / Contact */
const ACCENT = "#0C6E72";

/* ─────────────────────────────────────────────
   Avatar — shows photo if present, else initials.
   Deterministic colour from the user's name.
───────────────────────────────────────────── */
function Avatar({ user, size = 36, ring = false }) {
  const photo = user?.avatar || user?.photoURL || user?.image || user?.profilePhoto;
  const name = user?.name || user?.fullName || user?.username || user?.email || "User";
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  const [imgError, setImgError] = useState(false);
  const showPhoto = photo && !imgError;

  return (
    <div
      className="rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 select-none"
      style={{
        width: size,
        height: size,
        backgroundColor: showPhoto ? "transparent" : "rgba(12,110,114,0.12)",
        boxShadow: ring ? `0 0 0 2px ${ACCENT}` : "none",
      }}
    >
      {showPhoto ? (
        <img
          src={photo}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span
          className="font-bold"
          style={{
            color: ACCENT,
            fontSize: size * 0.38,
            letterSpacing: "0.02em",
          }}
        >
          {initials}
        </span>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Profile dropdown for desktop
───────────────────────────────────────────── */
function ProfileDropdown({ user, logout, isScrolled }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const name = user?.name || user?.fullName || user?.username || "Member";
  const email = user?.email || "";
  const role = user?.role || "MEMBER";
  const isStaff = ["ADMIN", "AUTHOR"].includes(role);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const esc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", esc);
    };
  }, []);

  const roleLabel =
    { ADMIN: "Administrator", AUTHOR: "Author", MEMBER: "Member" }[role] || role;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 rounded-full transition-all duration-300
          ${isScrolled ? "pl-1 pr-2 py-1" : "pl-1 pr-2.5 py-1"}
          hover:bg-black/5 dark:hover:bg-white/8`}
        style={open ? { backgroundColor: "rgba(12,110,114,0.08)" } : {}}
        aria-label="Open profile menu"
      >
        <Avatar user={user} size={isScrolled ? 28 : 32} />
        <ChevronDown
          size={14}
          className={`text-indriya-muted dark:text-indriya-darkMuted transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown panel */}
      <div
        className={`absolute right-0 mt-3 w-64 origin-top-right transition-all duration-200 ${
          open
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div
          className="rounded-[18px] overflow-hidden border border-indriya-border dark:border-indriya-darkBorder bg-white dark:bg-indriya-darkCard"
          style={{ boxShadow: "0 16px 48px rgba(0,0,0,0.16)" }}
        >
          {/* Header */}
          <div className="p-4 flex items-center gap-3 border-b border-indriya-border dark:border-indriya-darkBorder">
            <Avatar user={user} size={42} ring />
            <div className="min-w-0">
              <p className="text-[14px] font-bold text-indriya-text dark:text-indriya-darkText truncate">
                {name}
              </p>
              {email && (
                <p className="text-[12px] text-indriya-muted dark:text-indriya-darkMuted truncate">
                  {email}
                </p>
              )}
            </div>
          </div>

          {/* Role badge */}
          <div className="px-4 pt-3">
            <span
              className="inline-block text-[9px] font-black tracking-[0.12em] uppercase px-2.5 py-1 rounded-full"
              style={{ color: ACCENT, backgroundColor: "rgba(12,110,114,0.08)" }}
            >
              {roleLabel}
            </span>
          </div>

          {/* Menu items */}
          <div className="p-2 pt-3">
            {isStaff && (
              <DropdownLink to="/dashboard" icon={LayoutDashboard} onClick={() => setOpen(false)}>
                Dashboard
              </DropdownLink>
            )}
            <DropdownLink to="/profile" icon={User} onClick={() => setOpen(false)}>
              Profile
            </DropdownLink>

            <div className="my-2 h-px bg-indriya-border dark:bg-indriya-darkBorder" />

            <button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[13px] font-semibold text-indriya-danger hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <LogOut size={15} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DropdownLink({ to, icon: Icon, children, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[13px] font-semibold text-indriya-text dark:text-indriya-darkText hover:bg-black/5 dark:hover:bg-white/8 transition-colors group"
    >
      <Icon
        size={15}
        className="text-indriya-muted dark:text-indriya-darkMuted group-hover:text-[#0C6E72] transition-colors"
      />
      {children}
    </Link>
  );
}

/* ═════════════════════════════════════════════
   MAIN LAYOUT
═════════════════════════════════════════════ */
export default function MainLayout({ children }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      lenis.destroy();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close search on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/posts", label: "Posts" },
    { path: "/events", label: "Events" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  const isStaff = user && ["ADMIN", "AUTHOR"].includes(user.role);

  return (
    <div
      className="min-h-screen bg-indriya-bg dark:bg-indriya-darkBg text-indriya-text dark:text-indriya-darkText flex flex-col transition-colors duration-300"
      style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
    >
      {/* ── DYNAMIC ISLAND NAVBAR ── */}
      <div className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center pointer-events-none">
        <div
          className={`pointer-events-auto transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
            ${
              isScrolled
                ? "mt-4 w-[min(820px,94vw)] rounded-[999px]"
                : "mt-0 w-full rounded-none"
            }
          `}
          style={{
            background: isScrolled
              ? theme === "dark"
                ? "rgba(8,13,14,0.82)"
                : "rgba(255,255,255,0.80)"
              : "transparent",
            backdropFilter: isScrolled ? "blur(24px) saturate(180%)" : "none",
            WebkitBackdropFilter: isScrolled
              ? "blur(24px) saturate(180%)"
              : "none",
            boxShadow: isScrolled
              ? theme === "dark"
                ? "0 0 0 1px rgba(255,255,255,0.08), 0 8px 40px rgba(0,0,0,0.5)"
                : "0 0 0 1px rgba(12,110,114,0.08), 0 8px 40px rgba(0,0,0,0.10)"
              : "none",
            transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div
            className={`flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
              ${
                isScrolled
                  ? "px-4 py-2.5 max-w-none mx-0"
                  : "px-6 lg:px-16 py-5 max-w-[1440px] mx-auto w-full"
              }
            `}
          >
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
              <img
                src="/INDRIYAX_LOGO_EYE.jpeg"
                alt="INDRIYAX"
                className={`object-contain rounded-md transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-80
                  ${isScrolled ? "h-6 md:h-7 w-auto" : "h-8 md:h-9 w-auto"}`}
              />
              <span
                className={`font-black tracking-[-0.03em] transition-all duration-700
                  ${isScrolled ? "text-[15px]" : "text-[21px]"}`}
              >
                <span style={{ color: ACCENT }}>INDRIYA</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-br from-[#3fb3b8] to-[#0C6E72]">
                  X
                </span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <nav
              className={`hidden md:flex items-center transition-all duration-700
                ${isScrolled ? "gap-0.5" : "gap-8"}`}
            >
              {navLinks.map(({ path, label }) => {
                const active = isActive(path);
                return (
                  <Link
                    key={path}
                    to={path}
                    className={`font-semibold transition-all duration-300 relative
                      ${isScrolled ? "text-[13px] px-3.5 py-1.5 rounded-full" : "text-[14px] px-0 py-0"}
                    `}
                    style={
                      active
                        ? isScrolled
                          ? { backgroundColor: "rgba(12,110,114,0.12)", color: ACCENT }
                          : { color: ACCENT }
                        : {}
                    }
                  >
                    <span
                      className={
                        active
                          ? ""
                          : "text-indriya-muted dark:text-indriya-darkMuted hover:text-indriya-text dark:hover:text-indriya-darkText"
                      }
                    >
                      {label}
                    </span>
                    {!isScrolled && active && (
                      <span
                        className="absolute -bottom-1.5 left-0 right-0 h-[2px] rounded-full"
                        style={{ backgroundColor: ACCENT }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right actions */}
            <div
              className={`flex items-center transition-all duration-700 ${
                isScrolled ? "gap-1" : "gap-2.5"
              }`}
            >
              {/* Search */}
              <div ref={searchRef} className="relative hidden sm:block">
                {isSearchOpen ? (
                  <div className="flex items-center gap-2">
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search articles…"
                      className={`bg-indriya-secondary dark:bg-indriya-darkSecondary border border-indriya-border dark:border-indriya-darkBorder rounded-full text-[13px] text-indriya-text dark:text-indriya-darkText placeholder:text-indriya-muted outline-none transition-all focus:border-[#0C6E72]
                        ${isScrolled ? "px-3.5 py-1.5 w-40" : "px-4 py-2 w-48"}`}
                      style={{ "--tw-ring-color": ACCENT }}
                    />
                    <button
                      onClick={() => setIsSearchOpen(false)}
                      className="p-1.5 text-indriya-muted hover:text-indriya-text dark:hover:text-indriya-darkText transition-colors"
                    >
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className={`text-indriya-muted dark:text-indriya-darkMuted hover:text-indriya-text dark:hover:text-indriya-darkText transition-colors rounded-full
                      ${isScrolled ? "p-1.5 hover:bg-black/5 dark:hover:bg-white/8" : "p-2"}`}
                    aria-label="Search"
                  >
                    <Search size={isScrolled ? 16 : 19} strokeWidth={2} />
                  </button>
                )}
              </div>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className={`text-indriya-muted dark:text-indriya-darkMuted hover:text-indriya-text dark:hover:text-indriya-darkText transition-all rounded-full
                  ${isScrolled ? "p-1.5 hover:bg-black/5 dark:hover:bg-white/8" : "p-2"}`}
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <Moon size={isScrolled ? 16 : 19} strokeWidth={2} />
                ) : (
                  <Sun size={isScrolled ? 16 : 19} strokeWidth={2} />
                )}
              </button>

              {/* Auth — desktop */}
              <div className="hidden md:block">
                {user ? (
                  <ProfileDropdown user={user} logout={logout} isScrolled={isScrolled} />
                ) : (
                  <Link
                    to="/login"
                    className={`rounded-full text-white font-bold transition-all hover:opacity-90 hover:scale-[0.97] inline-block
                      ${isScrolled ? "text-[12px] px-4 py-1.5" : "text-[14px] px-6 py-2.5"}`}
                    style={{
                      backgroundColor: ACCENT,
                      boxShadow: "0 4px 16px rgba(12,110,114,0.28)",
                    }}
                  >
                    Sign In
                  </Link>
                )}
              </div>

              {/* Mobile: avatar (if logged in) + hamburger */}
              {user && (
                <div className="md:hidden">
                  <Avatar user={user} size={isScrolled ? 28 : 32} />
                </div>
              )}
              <button
                className={`md:hidden text-indriya-text dark:text-indriya-darkText transition-all rounded-full
                  ${isScrolled ? "p-1.5 hover:bg-black/5 dark:hover:bg-white/8" : "p-2"}`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Menu"
              >
                {isMobileMenuOpen ? (
                  <X size={isScrolled ? 18 : 24} />
                ) : (
                  <Menu size={isScrolled ? 18 : 24} />
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu — drops below the island */}
          {isMobileMenuOpen && (
            <div
              className={`md:hidden absolute top-full left-0 w-full bg-white dark:bg-indriya-darkCard border-t border-indriya-border/40 dark:border-indriya-darkBorder/40 px-5 pt-4 pb-5 space-y-1 shadow-xl z-50
                ${isScrolled ? "rounded-b-[24px]" : ""}`}
            >
              {/* Logged-in user header */}
              {user && (
                <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-[16px] bg-indriya-secondary dark:bg-indriya-darkSecondary">
                  <Avatar user={user} size={44} ring />
                  <div className="min-w-0">
                    <p className="text-[14px] font-bold text-indriya-text dark:text-indriya-darkText truncate">
                      {user.name || user.fullName || user.username || "Member"}
                    </p>
                    {user.email && (
                      <p className="text-[12px] text-indriya-muted dark:text-indriya-darkMuted truncate">
                        {user.email}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Mobile search */}
              <div className="sm:hidden px-1 pb-2">
                <div className="flex items-center gap-2 bg-indriya-secondary dark:bg-indriya-darkSecondary border border-indriya-border dark:border-indriya-darkBorder rounded-full px-4 py-2.5">
                  <Search size={16} className="text-indriya-muted flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search articles…"
                    className="bg-transparent text-[14px] text-indriya-text dark:text-indriya-darkText placeholder:text-indriya-muted outline-none w-full"
                  />
                </div>
              </div>

              {/* Nav links */}
              {navLinks.map(({ path, label }) => {
                const active = isActive(path);
                return (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-[15px] font-semibold px-3 py-2.5 rounded-xl transition-colors"
                    style={
                      active
                        ? { color: ACCENT, backgroundColor: "rgba(12,110,114,0.10)" }
                        : {}
                    }
                  >
                    <span
                      className={
                        active
                          ? ""
                          : "text-indriya-text dark:text-indriya-darkText"
                      }
                    >
                      {label}
                    </span>
                  </Link>
                );
              })}

              {/* Auth actions */}
              <div className="pt-4 mt-2 border-t border-indriya-border/40 dark:border-indriya-darkBorder/40">
                {user ? (
                  <div className="flex flex-col gap-2">
                    {isStaff && (
                      <Link
                        to="/dashboard"
                        className="flex items-center justify-center gap-2 w-full text-center rounded-xl bg-indriya-secondary dark:bg-indriya-darkSecondary px-4 py-3 text-[14px] font-semibold text-indriya-text dark:text-indriya-darkText"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <LayoutDashboard size={15} />
                        Dashboard
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      className="flex items-center justify-center gap-2 w-full text-center rounded-xl bg-indriya-secondary dark:bg-indriya-darkSecondary px-4 py-3 text-[14px] font-semibold text-indriya-text dark:text-indriya-darkText"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User size={15} />
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 w-full text-center rounded-xl px-4 py-3 text-[14px] font-semibold text-indriya-danger hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                      <LogOut size={15} />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center rounded-full px-4 py-3 text-[14px] font-bold text-white hover:scale-[0.98] transition-transform"
                    style={{ backgroundColor: ACCENT }}
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <main className="flex-grow flex flex-col w-full relative z-10 pt-[88px]">
        {children}
      </main>
    </div>
  );
}
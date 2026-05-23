"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  RiMenuLine, RiCloseLine,
  RiArrowDownSLine, RiCalendarEventLine,
  RiHistoryLine, RiLayoutGridLine, RiDashboardLine, RiLogoutBoxRLine,
} from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/config/site";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useAppStore } from "@/store";
import { getSession, signOut } from "@/services/authService";

const links = siteConfig.navLinks;

const eventDropdown = [
  { href: "/events",          label: "All Events",  icon: RiLayoutGridLine,    desc: "Browse everything" },
  { href: "/events/upcoming", label: "Upcoming",    icon: RiCalendarEventLine, desc: "Register now" },
  { href: "/events/past",     label: "Past Events", icon: RiHistoryLine,       desc: "Recordings & summaries" },
];

function NavLink({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
  return (
    <Link href={href} onClick={onClick}
      className={`relative text-sm px-3 py-2 rounded-lg transition-all duration-200 ${
        isActive ? "text-primary font-medium" : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white/5"
      }`}>
      {label}
      {isActive && (
        <>
          <span className="absolute inset-0 rounded-lg bg-primary/10 pointer-events-none" />
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-px bg-primary shadow-[0_0_6px_2px_rgba(0,212,255,0.6)] pointer-events-none" />
        </>
      )}
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [eventsOpen, setEventsOpen] = useState(false);
  const [mobileEventsOpen, setMobileEventsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const eventsActive = pathname.startsWith("/events");

  const { user, logout: storeLogout } = useAppStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user has an active session
    getSession().then((session) => {
      setIsAuthenticated(!!session);
    }).catch(() => setIsAuthenticated(false));
  }, [pathname]);

  // Also check store user
  useEffect(() => {
    if (user) setIsAuthenticated(true);
  }, [user]);

  async function handleLogout() {
    await signOut();
    storeLogout();
    setIsAuthenticated(false);
    window.location.href = "/";
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setEventsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? "glass border-b border-border shadow-lg shadow-black/10" : "bg-transparent"
    }`}>
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14 md:h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg overflow-hidden border border-primary/20 group-hover:border-primary/50 transition-colors shrink-0">
            <Image src="/logo.jpeg" alt="IndriyaX" width={32} height={32} className="object-cover w-full h-full" />
          </div>
          <span className="font-bold text-[var(--color-text)] text-base md:text-lg tracking-tight">
            Indriya<span className="text-primary">X</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-1 items-center">
          <NavLink href="/" label="Home" />

          {/* Events dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setEventsOpen(!eventsOpen)}
              className={`relative flex items-center gap-1 text-sm px-3 py-2 rounded-lg transition-all duration-200 ${
                eventsActive ? "text-primary font-medium" : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white/5"
              }`}>
              Events
              <RiArrowDownSLine size={15} className={`transition-transform duration-200 ${eventsOpen ? "rotate-180" : ""}`} />
              {eventsActive && (
                <>
                  <span className="absolute inset-0 rounded-lg bg-primary/10 pointer-events-none" />
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-px bg-primary shadow-[0_0_6px_2px_rgba(0,212,255,0.6)] pointer-events-none" />
                </>
              )}
            </button>
            <AnimatePresence>
              {eventsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute top-full left-0 mt-2 w-52 bg-dark-3 border border-border rounded-2xl shadow-2xl shadow-black/30 overflow-hidden"
                >
                  {eventDropdown.map(({ href, label, icon: Icon, desc }) => (
                    <Link key={href} href={href} onClick={() => setEventsOpen(false)}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors group/item">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-primary/20 transition-colors">
                        <Icon size={13} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-[var(--color-text)] text-sm font-medium leading-none mb-0.5">{label}</p>
                        <p className="text-[var(--color-text-muted)] text-xs">{desc}</p>
                      </div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {links.map((l) => <NavLink key={l.href} href={l.href} label={l.label} />)}

          <div className="flex items-center gap-2 ml-2">
            <ThemeToggle />

            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="flex items-center gap-1.5 border border-primary/30 text-primary text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary/10 transition-all">
                  <RiDashboardLine size={15} /> Dashboard
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-1.5 border border-border text-[var(--color-text-muted)] text-sm font-medium px-3 py-2 rounded-lg hover:border-red-500/40 hover:text-red-400 transition-all">
                  <RiLogoutBoxRLine size={15} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="border border-border text-[var(--color-text-muted)] text-sm font-medium px-4 py-2 rounded-lg hover:border-primary/40 hover:text-primary transition-all">
                  Sign In
                </Link>
                <Link href="/signup" className="bg-primary text-dark text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary/80 transition-all shadow-lg shadow-primary/20">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile right */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors p-1" onClick={() => setOpen(!open)}>
            {open ? <RiCloseLine size={22} /> : <RiMenuLine size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden glass border-t border-border overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              <NavLink href="/" label="Home" onClick={() => setOpen(false)} />

              <div>
                <button onClick={() => setMobileEventsOpen(!mobileEventsOpen)}
                  className={`w-full flex items-center justify-between text-sm px-3 py-2 rounded-lg transition-all ${
                    eventsActive ? "text-primary bg-primary/10" : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white/5"
                  }`}>
                  Events
                  <RiArrowDownSLine size={15} className={`transition-transform duration-200 ${mobileEventsOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {mobileEventsOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden pl-3 mt-1 flex flex-col gap-1"
                    >
                      {eventDropdown.map(({ href, label, icon: Icon }) => (
                        <Link key={href} href={href} onClick={() => { setOpen(false); setMobileEventsOpen(false); }}
                          className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition-all ${
                            pathname === href ? "text-primary bg-primary/10" : "text-[var(--color-text-muted)] hover:text-primary hover:bg-white/5"
                          }`}>
                          <Icon size={13} className="text-primary/60" /> {label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {links.map((l) => <NavLink key={l.href} href={l.href} label={l.label} onClick={() => setOpen(false)} />)}

              <div className="flex gap-2 mt-3 flex-wrap">
                {isAuthenticated ? (
                  <>
                    <Link href="/dashboard" onClick={() => setOpen(false)}
                      className="flex-1 min-w-[80px] flex items-center justify-center gap-1.5 border border-primary/30 text-primary text-sm font-medium px-3 py-2.5 rounded-lg">
                      <RiDashboardLine size={14} /> Dashboard
                    </Link>
                    <button onClick={() => { setOpen(false); handleLogout(); }}
                      className="flex items-center gap-1.5 border border-border text-[var(--color-text-muted)] text-sm font-medium px-3 py-2.5 rounded-lg hover:text-red-400">
                      <RiLogoutBoxRLine size={14} /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setOpen(false)}
                      className="flex-1 min-w-[80px] border border-border text-[var(--color-text-muted)] text-sm font-medium px-3 py-2.5 rounded-lg text-center hover:border-primary/40 hover:text-primary transition-all">
                      Sign In
                    </Link>
                    <Link href="/signup" onClick={() => setOpen(false)}
                      className="flex-1 min-w-[80px] bg-primary text-dark text-sm font-semibold px-3 py-2.5 rounded-lg text-center">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

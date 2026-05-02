"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { RiMenuLine, RiCloseLine, RiShieldUserLine, RiArrowDownSLine, RiCalendarEventLine, RiHistoryLine, RiLayoutGridLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/config/site";

const links = siteConfig.navLinks;

const eventDropdown = [
  { href: "/events", label: "All Events", icon: RiLayoutGridLine, desc: "Browse everything" },
  { href: "/events/upcoming", label: "Upcoming", icon: RiCalendarEventLine, desc: "Register now" },
  { href: "/events/past", label: "Past Events", icon: RiHistoryLine, desc: "Recordings & summaries" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [eventsOpen, setEventsOpen] = useState(false);
  const [mobileEventsOpen, setMobileEventsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setEventsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "glass border-b border-border shadow-lg shadow-black/30" : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-primary/20 group-hover:border-primary/50 transition-colors shrink-0">
            <Image src="/logo.jpeg" alt="IndriyaX" width={32} height={32} className="object-cover w-full h-full" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">
            Indriya<span className="text-primary">X</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-1 items-center">

          {/* Home */}
          <Link href="/" className="text-sm text-gray-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all">
            Home
          </Link>

          {/* Events dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setEventsOpen(!eventsOpen)}
              className={`flex items-center gap-1 text-sm px-3 py-2 rounded-lg transition-all ${eventsOpen ? "text-white bg-white/5" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              Events
              <RiArrowDownSLine size={15} className={`transition-transform duration-200 ${eventsOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {eventsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute top-full left-0 mt-2 w-52 bg-dark-3 border border-border rounded-2xl shadow-2xl shadow-black/50 overflow-hidden"
                >
                  {eventDropdown.map(({ href, label, icon: Icon, desc }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setEventsOpen(false)}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors group/item"
                    >
                      <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-primary/20 transition-colors">
                        <Icon size={13} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium leading-none mb-0.5">{label}</p>
                        <p className="text-gray-600 text-xs">{desc}</p>
                      </div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Other links */}
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-gray-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all">
              {l.label}
            </Link>
          ))}

          <div className="flex items-center gap-2 ml-2">
            <Link href="/register" className="bg-primary text-dark text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary/80 transition-all shadow-lg shadow-primary/20">
              Register
            </Link>
            <Link href="/admin/login" className="flex items-center gap-1.5 border border-gray-600 text-gray-300 text-sm font-medium px-3 py-2 rounded-lg hover:border-primary/60 hover:text-primary hover:bg-primary/5 transition-all">
              <RiShieldUserLine size={15} />
              Admin
            </Link>
          </div>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-gray-400 hover:text-white transition-colors p-1" onClick={() => setOpen(!open)}>
          {open ? <RiCloseLine size={22} /> : <RiMenuLine size={22} />}
        </button>
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
              <Link href="/" className="text-sm text-gray-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all" onClick={() => setOpen(false)}>
                Home
              </Link>

              {/* Mobile Events accordion */}
              <div>
                <button
                  onClick={() => setMobileEventsOpen(!mobileEventsOpen)}
                  className="w-full flex items-center justify-between text-sm text-gray-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all"
                >
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
                        <Link
                          key={href}
                          href={href}
                          onClick={() => { setOpen(false); setMobileEventsOpen(false); }}
                          className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary px-3 py-2 rounded-lg hover:bg-white/5 transition-all"
                        >
                          <Icon size={13} className="text-primary/60" /> {label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {links.map((l) => (
                <Link key={l.href} href={l.href} className="text-sm text-gray-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all" onClick={() => setOpen(false)}>
                  {l.label}
                </Link>
              ))}

              <div className="flex gap-2 mt-2">
                <Link href="/register" className="flex-1 bg-primary text-dark text-sm font-semibold px-4 py-2 rounded-lg text-center" onClick={() => setOpen(false)}>
                  Register
                </Link>
                <Link href="/admin/login" className="flex items-center gap-1.5 border border-gray-600 text-gray-300 text-sm font-medium px-3 py-2 rounded-lg hover:border-primary/60 hover:text-primary transition-all" onClick={() => setOpen(false)}>
                  <RiShieldUserLine size={14} /> Admin
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

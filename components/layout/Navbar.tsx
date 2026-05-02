"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { RiMenuLine, RiCloseLine, RiShieldUserLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/config/site";

const links = siteConfig.navLinks;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
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

        {/* Desktop */}
        <div className="hidden md:flex gap-1 items-center">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-gray-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all">
              {l.label}
            </Link>
          ))}

          <div className="flex items-center gap-2 ml-2">
            <Link
              href="/register"
              className="bg-primary text-dark text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary/80 transition-all shadow-lg shadow-primary/20"
            >
              Register
            </Link>

            {/* Admin — prominent outlined button */}
            <Link
              href="/admin/login"
              className="flex items-center gap-1.5 border border-gray-600 text-gray-300 text-sm font-medium px-3 py-2 rounded-lg hover:border-primary/60 hover:text-primary hover:bg-primary/5 transition-all"
            >
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

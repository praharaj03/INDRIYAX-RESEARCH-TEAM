import Link from "next/link";
import Image from "next/image";
import {
  RiMailLine, RiPhoneLine,
  RiTwitterXLine, RiInstagramLine,
  RiLinkedinBoxLine, RiWhatsappLine, RiTelegramLine,
} from "react-icons/ri";
import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer className="bg-dark-2 border-t border-border mt-16 md:mt-24">
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-12 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-10">

        {/* Brand — full width on mobile */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 rounded-lg overflow-hidden border border-primary/20 shrink-0">
              <Image src="/logo.jpeg" alt="IndriyaX" width={28} height={28} className="object-cover w-full h-full" />
            </div>
            <span className="font-bold text-white text-base">
              Indriya<span className="text-primary">X</span>
            </span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed mb-4 max-w-xs">
            Advancing optometry through education, events, and community across India.
          </p>
          <div className="flex gap-2 flex-wrap">
            {[
              { icon: RiWhatsappLine,    href: siteConfig.social.whatsapp,  title: "WhatsApp" },
              { icon: RiTelegramLine,    href: siteConfig.social.telegram,  title: "Telegram" },
              { icon: RiInstagramLine,   href: siteConfig.social.instagram, title: "Instagram" },
              { icon: RiLinkedinBoxLine, href: siteConfig.social.linkedin,  title: "LinkedIn" },
              { icon: RiTwitterXLine,    href: siteConfig.social.twitter,   title: "X" },
            ].map(({ icon: Icon, href, title }) => (
              <a
                key={title}
                href={href}
                title={title}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-dark-3 border border-border flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary/40 transition-all"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <p className="text-white font-semibold text-sm mb-4">Quick Links</p>
          <div className="flex flex-col gap-2 text-sm">
            {[
              { href: "/events/upcoming", label: "Upcoming Events" },
              { href: "/events/past",     label: "Past Events" },
              { href: "/news",            label: "Medical News" },
              { href: "/about",           label: "About Us" },
              { href: "/signup",          label: "Sign Up" },
              { href: "/contact",         label: "Contact" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="text-gray-500 hover:text-primary transition-colors w-fit">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <p className="text-white font-semibold text-sm mb-4">Contact</p>
          <div className="flex flex-col gap-3 text-sm">
            <a href={`mailto:${siteConfig.email}`} className="flex items-start gap-2 text-gray-500 hover:text-primary transition-colors">
              <RiMailLine size={14} className="mt-0.5 shrink-0" /> <span className="break-all">{siteConfig.email}</span>
            </a>
            <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors">
              <RiPhoneLine size={14} className="shrink-0" /> {siteConfig.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border text-center text-xs py-4 text-gray-600 px-4">
        © {new Date().getFullYear()} IndriyaX. All rights reserved.
      </div>
    </footer>
  );
}

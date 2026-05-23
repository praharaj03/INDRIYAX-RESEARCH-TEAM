"use client";
import AnimateIn from "@/components/ui/AnimateIn";
import { contactConfig } from "./contact.config";
import {
  RiMailLine, RiPhoneLine, RiMapPinLine, RiTimeLine, RiContactsLine,
  RiWhatsappLine, RiLinkedinBoxLine, RiInstagramLine, RiTwitterXLine, RiTelegramLine,
} from "react-icons/ri";

const { email, phone, address, clinicHours, social } = contactConfig;

const contactItems = [
  { icon: RiMailLine,   label: "Email",        value: email,       href: `mailto:${email}` },
  { icon: RiPhoneLine,  label: "Phone",        value: phone,       href: `tel:${phone.replace(/\s/g, "")}` },
  { icon: RiMapPinLine, label: "Address",      value: address,     href: null },
  { icon: RiTimeLine,   label: "Clinic Hours", value: clinicHours, href: null },
];

const socials = [
  { icon: RiWhatsappLine,    label: "WhatsApp", href: social.whatsapp,  color: "hover:text-emerald-400" },
  { icon: RiTelegramLine,    label: "Telegram", href: social.telegram,  color: "hover:text-sky-400" },
  { icon: RiLinkedinBoxLine, label: "LinkedIn", href: social.linkedin,  color: "hover:text-blue-400" },
  { icon: RiInstagramLine,   label: "Instagram",href: social.instagram, color: "hover:text-pink-400" },
  { icon: RiTwitterXLine,    label: "X",        href: social.twitter,   color: "hover:text-white" },
].filter((s) => s.href);

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
      <AnimateIn>
        <div className="mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <RiContactsLine size={12} /> Get in Touch
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Contact Us</h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">We'd love to hear from you</p>
        </div>
      </AnimateIn>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-10 md:mb-12">
        {contactItems.map(({ icon: Icon, label, value, href }, i) => (
          <AnimateIn key={label} delay={i * 0.07}>
            <div className="bg-dark-3 rounded-2xl border border-border p-4 md:p-5 hover:border-primary/30 card-glow transition-all h-full">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon size={13} className="text-primary" />
                </div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
              </div>
              {href ? (
                <a href={href} className="text-white text-sm hover:text-primary transition-colors whitespace-pre-line break-all">
                  {value}
                </a>
              ) : (
                <p className="text-white text-sm whitespace-pre-line">{value}</p>
              )}
            </div>
          </AnimateIn>
        ))}
      </div>

      <AnimateIn delay={0.3}>
        <div className="flex items-center justify-center gap-4 sm:gap-5 flex-wrap">
          {socials.map(({ icon: Icon, label, href, color }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative flex flex-col items-center gap-0 w-12 h-12 sm:w-14 sm:h-14 text-gray-500 transition-all duration-300 ${color} overflow-hidden`}
            >
              <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-3">
                <Icon size={18} className="sm:text-[20px]" />
              </div>
              <span className="absolute bottom-0 inset-x-0 text-center text-[9px] sm:text-[10px] font-semibold translate-y-full group-hover:translate-y-0 transition-transform duration-300 pb-1.5 leading-none">
                {label.split(" ")[0]}
              </span>
            </a>
          ))}
        </div>
      </AnimateIn>
    </div>
  );
}

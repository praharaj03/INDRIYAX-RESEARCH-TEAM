import AnimateIn from "@/components/ui/AnimateIn";
import {
  RiMailLine,
  RiPhoneLine,
  RiMapPinLine,
  RiTimeLine,
  RiContactsLine,
} from "react-icons/ri";

const contactItems = [
  {
    icon: RiMailLine,
    label: "Email",
    value: "contact@indriyax.com",
    href: "mailto:contact@indriyax.com",
  },
  {
    icon: RiPhoneLine,
    label: "Phone",
    value: "+91 98765 43210",
    href: "tel:+919876543210",
  },
  {
    icon: RiMapPinLine,
    label: "Address",
    value: "123, Vision Street, Andheri West\nMumbai, Maharashtra – 400053",
    href: null,
  },
  {
    icon: RiTimeLine,
    label: "Clinic Hours",
    value: "Mon – Sat: 9:00 AM – 7:00 PM\nSunday: Closed",
    href: null,
  },
];

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <AnimateIn>
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <RiContactsLine /> Get in Touch
          </div>
          <h1 className="text-4xl font-bold text-white">Contact Us</h1>
          <p className="text-gray-500 mt-2">We'd love to hear from you</p>
        </div>
      </AnimateIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          {contactItems.map(({ icon: Icon, label, value, href }, i) => (
            <AnimateIn key={label} delay={i * 0.08}>
              <div className="bg-dark-3 rounded-2xl border border-border p-5 hover:border-primary/30 card-glow transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="text-primary" />
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {label}
                  </p>
                </div>
                {href ? (
                  <a
                    href={href}
                    className="text-white text-sm hover:text-primary transition-colors whitespace-pre-line"
                  >
                    {value}
                  </a>
                ) : (
                  <p className="text-white text-sm whitespace-pre-line">
                    {value}
                  </p>
                )}
              </div>
            </AnimateIn>
          ))}
        </div>

        <AnimateIn delay={0.2}>
          <div className="rounded-2xl border border-border overflow-hidden h-80 md:h-full min-h-[320px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609823277!2d72.74109995709657!3d19.08219783958221!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000"
              width="100%"
              height="100%"
              style={{
                border: 0,
                minHeight: "320px",
                filter: "invert(90%) hue-rotate(180deg)",
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Clinic Location"
            />
          </div>
        </AnimateIn>
      </div>
    </div>
  );
}

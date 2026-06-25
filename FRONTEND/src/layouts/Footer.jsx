import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Mail } from 'lucide-react';
export default function Footer() {
  return (
    <footer className="w-full bg-indriya-card dark:bg-indriya-darkCard border-t border-indriya-border dark:border-indriya-darkBorder pt-20 pb-10 transition-colors duration-300 z-20 relative">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        
        {/* Main Content & Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          
          {/* About & Branding Column */}
          <div className="lg:col-span-4">
             <Link to="/" className="flex items-center gap-2 mb-6">
                <span className="text-[22px] font-bold tracking-[-0.02em] text-indriya-text dark:text-indriya-darkText">
                  INDRIYA<span className="text-indriya-accent">X</span>
                </span>
              </Link>
              <p className="text-[16px] leading-[1.8] text-indriya-muted dark:text-indriya-darkMuted mb-8 max-w-sm">
                A premium editorial platform dedicated to eye health, ophthalmology, medical research, and healthcare awareness.
              </p>
              <div className="flex items-center gap-5 text-indriya-muted dark:text-indriya-darkMuted">
                <a href="#" className="hover:text-indriya-accent transition-colors"><Globe size={20} strokeWidth={1.5} /></a>
                <a href="#" className="hover:text-indriya-accent transition-colors"><Mail size={20} strokeWidth={1.5} /></a>
              </div>
          </div>

          {/* Links Column 1 */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="font-semibold text-indriya-text dark:text-indriya-darkText mb-6 tracking-widest text-[13px] uppercase">Platform</h4>
            <ul className="space-y-4">
              <li><Link to="/articles" className="text-indriya-muted dark:text-indriya-darkMuted hover:text-indriya-accent transition-colors text-[15px]">Articles</Link></li>
              <li><Link to="/research" className="text-indriya-muted dark:text-indriya-darkMuted hover:text-indriya-accent transition-colors text-[15px]">Research Highlights</Link></li>
              <li><Link to="/events" className="text-indriya-muted dark:text-indriya-darkMuted hover:text-indriya-accent transition-colors text-[15px]">Medical Events</Link></li>
              <li><Link to="/about" className="text-indriya-muted dark:text-indriya-darkMuted hover:text-indriya-accent transition-colors text-[15px]">Editorial Policy</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold text-indriya-text dark:text-indriya-darkText mb-6 tracking-widest text-[13px] uppercase">Legal</h4>
            <ul className="space-y-4">
              <li><Link to="#" className="text-indriya-muted dark:text-indriya-darkMuted hover:text-indriya-accent transition-colors text-[15px]">Privacy Policy</Link></li>
              <li><Link to="#" className="text-indriya-muted dark:text-indriya-darkMuted hover:text-indriya-accent transition-colors text-[15px]">Terms of Service</Link></li>
              <li><Link to="/contact" className="text-indriya-muted dark:text-indriya-darkMuted hover:text-indriya-accent transition-colors text-[15px]">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-3">
            <h4 className="font-semibold text-indriya-text dark:text-indriya-darkText mb-6 tracking-widest text-[13px] uppercase">Stay Updated</h4>
            <p className="text-indriya-muted dark:text-indriya-darkMuted text-[15px] leading-[1.6] mb-5">
              Stay updated with the latest breakthroughs in eye care and clinical trials.
            </p>
            <form className="flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); alert('Newsletter logic pending!'); }}>
              <input 
                type="email" 
                required
                placeholder="Email address" 
                className="w-full bg-indriya-bg dark:bg-indriya-darkBg border border-indriya-border dark:border-indriya-darkBorder px-4 py-3.5 rounded-xl text-[15px] focus:outline-none focus:border-indriya-accent transition-colors dark:text-indriya-darkText"
              />
              <button type="submit" className="w-full bg-indriya-text dark:bg-indriya-darkText text-white dark:text-black font-medium px-4 py-3.5 rounded-xl hover:scale-[0.98] transition-transform flex items-center justify-center gap-2">
                Subscribe <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-indriya-border dark:border-indriya-darkBorder pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-indriya-muted dark:text-indriya-darkMuted text-[14px]">
            © {new Date().getFullYear()} INDRIYAX. Advancing Vision Through Knowledge.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indriya-success"></span>
            <p className="text-indriya-muted dark:text-indriya-darkMuted text-[14px]">
              Medically reviewed editorial content.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
import React from "react";

const ACCENT = "#0C6E72";

/**
 * BrandLoader — the IndriyaX logo + wordmark pulsing in a soft blur,
 * always centered on the screen. Drop-in replacement for spinner blocks.
 *
 * Usage:
 *   if (isLoading) return <BrandLoader />;          // centered overlay
 *   <BrandLoader label="Loading event…" />          // with caption
 */
export default function BrandLoader({ label, className = "" }) {
  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-indriya-bg/80 dark:bg-indriya-darkBg/80 backdrop-blur-sm ${className}`}
      style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Logo + wordmark — exact navbar reference, blinking through a blur */}
        <div className="brand-loader-pulse flex items-center gap-2.5">
          <img
            src="/INDRIYAX_LOGO_EYE.jpeg"
            alt="INDRIYAX"
            className="object-contain rounded-md h-9 md:h-10 w-auto"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <span className="font-black tracking-[-0.03em] text-[22px] md:text-[26px]">
            <span style={{ color: ACCENT }}>INDRIYA</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-[#3fb3b8] to-[#0C6E72]">
              X
            </span>
          </span>
        </div>

        {/* Optional caption */}
        {label && (
          <p className="text-[12px] font-semibold tracking-[0.06em] uppercase text-indriya-muted dark:text-indriya-darkMuted brand-loader-fade">
            {label}
          </p>
        )}
      </div>

      {/* Scoped keyframes — blur + opacity blink */}
      <style>{`
        @keyframes brandLoaderPulse {
          0%, 100% {
            opacity: 0.35;
            filter: blur(3px);
            transform: scale(0.98);
          }
          50% {
            opacity: 1;
            filter: blur(0px);
            transform: scale(1);
          }
        }
        @keyframes brandLoaderFade {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        .brand-loader-pulse {
          animation: brandLoaderPulse 1.5s ease-in-out infinite;
        }
        .brand-loader-fade {
          animation: brandLoaderFade 1.5s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .brand-loader-pulse,
          .brand-loader-fade {
            animation: none;
            opacity: 1;
            filter: none;
          }
        }
      `}</style>
    </div>
  );
}
"use client";
import { RiSunLine, RiMoonLine } from "react-icons/ri";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all border-border hover:border-primary/40 ${
        theme === "dark"
          ? "text-gray-400 hover:text-primary bg-dark-4"
          : "text-gray-500 hover:text-primary bg-dark-3"
      } ${className}`}
    >
      {theme === "dark" ? <RiSunLine size={15} /> : <RiMoonLine size={15} />}
    </button>
  );
}

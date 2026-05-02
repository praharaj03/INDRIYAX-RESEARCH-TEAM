// Classname merger utility
// TODO: npm install clsx tailwind-merge  →  then use this
// import { clsx, type ClassValue } from "clsx";
// import { twMerge } from "tailwind-merge";
// export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}

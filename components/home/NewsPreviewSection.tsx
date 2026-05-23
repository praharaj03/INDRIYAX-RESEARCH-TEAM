import Link from "next/link";
import AnimateIn from "@/components/ui/AnimateIn";
import NewsCard from "@/components/cards/NewsCard";
import { RiArrowRightLine } from "react-icons/ri";
import type { News } from "@/types/news";

export default function NewsPreviewSection({ items }: { items: News[] }) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <AnimateIn>
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-1">Stay informed</p>
            <h2 className="text-3xl font-bold text-white">Medical News</h2>
          </div>
          <Link href="/news" className="group flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition-colors">
            View all <RiArrowRightLine className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </AnimateIn>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((n, i) => (
          <AnimateIn key={n.id} delay={i * 0.1}>
            <NewsCard item={n} />
          </AnimateIn>
        ))}
      </div>
    </section>
  );
}

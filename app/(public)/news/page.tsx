import { news } from "@/lib/data/index";
import NewsCard from "@/components/cards/NewsCard";
import AnimateIn from "@/components/ui/AnimateIn";
import { RiNewspaperLine } from "react-icons/ri";

export default function NewsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <AnimateIn>
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <RiNewspaperLine /> Latest Research
          </div>
          <h1 className="text-4xl font-bold text-white">Medical News</h1>
          <p className="text-gray-500 mt-2">
            Stay updated with the latest in optometry and eye care research
          </p>
        </div>
      </AnimateIn>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((n, i) => (
          <AnimateIn key={n.id} delay={i * 0.1}>
            <NewsCard item={n} />
          </AnimateIn>
        ))}
      </div>
    </div>
  );
}

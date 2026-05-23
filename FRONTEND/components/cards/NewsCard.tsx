import Image from "next/image";
import Link from "next/link";
import { RiArrowRightLine } from "react-icons/ri";
import type { News } from "@/types/news";

export default function NewsCard({ item }: { item: News }) {
  const image = item.coverImage || item.image || "";
  const href = item.slug ? `/news/${item.slug}` : (item.link ?? "#");
  const isExternal = !item.slug && !!item.link;

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="group block bg-dark-3 rounded-2xl overflow-hidden border border-border card-glow transition-all duration-300 hover:-translate-y-1"
    >
      {image && (
        <div className="relative h-44 w-full overflow-hidden">
          <Image src={image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-3/70 to-transparent" />
        </div>
      )}
      <div className="p-5">
        {item.tags && item.tags.length > 0 && (
          <div className="flex gap-1.5 mb-2 flex-wrap">
            {item.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">{tag}</span>
            ))}
          </div>
        )}
        <h3 className="font-semibold text-white text-sm leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {item.title}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2 mb-3">
          {item.description ?? item.content?.slice(0, 120)}
        </p>
        <div className="flex items-center gap-1 text-xs text-primary font-medium">
          Read more <RiArrowRightLine className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </a>
  );
}

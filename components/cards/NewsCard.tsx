import Image from "next/image";
import { RiExternalLinkLine } from "react-icons/ri";
import type { News } from "@/types/news";

export default function NewsCard({ item }: { item: News }) {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-dark-3 rounded-2xl overflow-hidden border border-border card-glow transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-3/70 to-transparent" />
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-white text-sm leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {item.title}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2 mb-3">{item.description}</p>
        <div className="flex items-center gap-1 text-xs text-primary font-medium">
          Read article <RiExternalLinkLine className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>
    </a>
  );
}

"use client";
import { useState, useEffect } from "react";
import type { News } from "@/types/news";
import Image from "next/image";
import Link from "next/link";
import {
  RiAddCircleLine, RiDeleteBinLine, RiEditLine,
  RiExternalLinkLine, RiNewspaperLine,
} from "react-icons/ri";
import { getNews, deletePost } from "@/services/newsService";

export default function AdminNewsPage() {
  const [items, setItems] = useState<News[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    getNews().then(setItems).catch(console.error);
  }, []);

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await deletePost(deleteId);
      setItems((prev) => prev.filter((n) => n.id !== deleteId));
    } catch (err) { console.error(err); }
    setDeleteId(null);
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">News Manager</h1>
          <p className="text-gray-500 text-sm mt-0.5">{items.length} articles</p>
        </div>
        <Link
          href="/admin/news/add"
          className="flex items-center gap-2 bg-primary text-dark text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-primary/80 transition-all shadow-lg shadow-primary/20"
        >
          <RiAddCircleLine size={16} /> Add News
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-dark-3 border border-border rounded-xl overflow-hidden flex flex-col group">
            {/* Image */}
            <div className="relative h-36 w-full overflow-hidden">
              <Image src={item.image ?? item.coverImage ?? ""} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-3/80 to-transparent" />
              <div className="absolute top-2 left-2">
                <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                  <RiNewspaperLine size={10} /> News
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col gap-3 flex-1">
              <div>
                <p className="text-white text-sm font-semibold leading-snug line-clamp-2">{item.title}</p>
                <p className="text-gray-600 text-xs mt-1 line-clamp-2">{item.description ?? item.content?.slice(0, 100)}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 mt-auto pt-2 border-t border-border">
                <Link
                  href={`/admin/news/${item.id}/edit`}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-primary transition-colors px-2 py-1.5 rounded-lg hover:bg-primary/10"
                >
                  <RiEditLine size={13} /> Edit
                </Link>
                <a
                  href={item.link ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto text-gray-600 hover:text-primary transition-colors"
                  title="View article"
                >
                  <RiExternalLinkLine size={14} />
                </a>
                <button
                  onClick={() => setDeleteId(item.id)}
                  className="text-gray-600 hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <RiDeleteBinLine size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-dark-3 border border-border rounded-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-white font-bold text-base mb-2">Delete Article?</h3>
            <p className="text-gray-500 text-sm mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={handleDelete} className="flex-1 bg-red-500/10 text-red-400 border border-red-500/20 font-semibold text-sm py-2.5 rounded-xl hover:bg-red-500/20 transition-colors">
                Delete
              </button>
              <button onClick={() => setDeleteId(null)} className="flex-1 bg-dark-4 text-gray-400 border border-border font-semibold text-sm py-2.5 rounded-xl hover:text-white transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

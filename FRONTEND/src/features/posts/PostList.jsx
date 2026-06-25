import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Calendar, User, Crown, ArrowUpRight } from 'lucide-react';
import { postsService } from './postsService';
import BrandLoader from '../../utils/BrandLoader';
import { getErrorMessage } from '../../utils/apiMessage';

const ACCENT = '#0C6E72';

/* ─── Author chip with initials fallback ─── */
function AuthorChip({ author, size = 24 }) {
  const [err, setErr] = useState(false);
  const name = author?.fullName || 'Anonymous';
  const initials = name.split(/\s+/).slice(0, 2).map(p => p[0]).join('').toUpperCase();
  const show = author?.imageUrl && !err;
  return (
    <div className="flex items-center gap-2">
      <div
        className="rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
        style={{ width: size, height: size, backgroundColor: show ? 'transparent' : 'rgba(12,110,114,0.12)' }}
      >
        {show ? (
          <img src={author.imageUrl} alt={name} className="w-full h-full object-cover" onError={() => setErr(true)} />
        ) : (
          <span className="font-bold" style={{ color: ACCENT, fontSize: size * 0.42 }}>{initials}</span>
        )}
      </div>
      <span className="text-[13px] font-semibold text-indriya-text dark:text-indriya-darkText truncate">{name}</span>
    </div>
  );
}

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await postsService.getAllPosts();
        const list = Array.isArray(data) ? data : [];
        // Only show published posts in the public list.
        // (The backend returns drafts to AUTHOR/ADMIN, but they shouldn't
        // appear in the public feed — drafts are managed from the dashboard.)
        setPosts(list.filter((p) => p.published !== false));
      } catch (error) {
        toast.error(getErrorMessage(error, 'Failed to load posts.'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (isLoading) return <BrandLoader label="Loading posts…" />;

  return (
    <div
      className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-in fade-in duration-500"
      style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
    >
      {/* ── Header ── */}
      <div className="mb-10">
        <p className="text-[11px] font-black tracking-[0.16em] uppercase mb-3" style={{ color: ACCENT }}>
          The Journal
        </p>
        <h1
          className="text-indriya-text dark:text-indriya-darkText tracking-[-0.03em] leading-[1.05] mb-3"
          style={{ fontFamily: "'DM Serif Display', 'Georgia', serif", fontSize: 'clamp(34px, 5vw, 56px)', fontWeight: 400 }}
        >
          Medical insights,<br />
          <span className="italic" style={{ color: ACCENT }}>evidence first.</span>
        </h1>
        <p className="text-[16px] text-indriya-muted dark:text-indriya-darkMuted leading-[1.7] max-w-[540px]">
          The latest research, clinical perspectives, and breakthroughs in vision science — from our expert authors.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="bg-indriya-card dark:bg-indriya-darkCard border border-indriya-border dark:border-indriya-darkBorder rounded-[24px] px-6 py-20 text-center">
          <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'rgba(12,110,114,0.08)' }}>
            <Calendar size={26} style={{ color: ACCENT }} />
          </div>
          <p className="text-[15px] font-bold text-indriya-text dark:text-indriya-darkText mb-1.5">No posts yet</p>
          <p className="text-[13px] text-indriya-muted dark:text-indriya-darkMuted">Check back soon for the latest medical insights.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/posts/${post.slug}`}
              className="group flex flex-col rounded-[20px] overflow-hidden border border-indriya-border dark:border-indriya-darkBorder bg-indriya-card dark:bg-indriya-darkCard transition-all duration-300 hover:-translate-y-1"
              style={{ boxShadow: '0 2px 14px rgba(0,0,0,0.05)' }}
            >
              {/* Cover */}
              <div className="relative h-48 overflow-hidden bg-indriya-secondary dark:bg-indriya-darkSecondary">
                {post.coverImage ? (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-[13px] font-medium text-indriya-muted dark:text-indriya-darkMuted">No image</span>
                  </div>
                )}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,12,14,0.3), transparent 55%)' }} />

                {/* Premium badge */}
                {post.isPremium && (
                  <span
                    className="absolute top-3 left-3 inline-flex items-center gap-1 text-[9px] font-black tracking-[0.1em] uppercase px-2.5 py-1 rounded-full text-white"
                    style={{ backgroundColor: 'rgba(217,119,6,0.95)' }}
                  >
                    <Crown size={10} /> Premium
                  </span>
                )}
                {/* Tags */}
                {post.tags && post.tags.length > 0 && !post.isPremium && (
                  <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                    {post.tags.slice(0, 2).map(tag => (
                      <span
                        key={tag}
                        className="text-[9px] font-black tracking-[0.08em] uppercase px-2.5 py-1 rounded-full bg-white/95 dark:bg-indriya-darkCard/95 backdrop-blur-sm"
                        style={{ color: ACCENT }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-5 flex flex-col flex-grow">
                <h3
                  className="text-[16px] font-bold text-indriya-text dark:text-indriya-darkText leading-snug mb-2 line-clamp-2 group-hover:text-[#0C6E72] dark:group-hover:text-[#3fb3b8] transition-colors"
                  style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400 }}
                >
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-[13px] text-indriya-muted dark:text-indriya-darkMuted leading-[1.7] line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>
                )}

                <div className="mt-auto pt-4 flex items-center justify-between border-t border-indriya-border dark:border-indriya-darkBorder">
                  <AuthorChip author={post.author} />
                  <div className="flex items-center gap-1 text-[11px] text-indriya-muted dark:text-indriya-darkMuted flex-shrink-0">
                    <Calendar size={12} />
                    <span>
                      {new Date(post.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
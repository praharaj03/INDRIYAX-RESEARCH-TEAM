import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { User, Calendar, ArrowLeft, Crown, Lock, Clock } from 'lucide-react';
import { postsService } from './postsService';
import { useAuth } from '../auth/AuthContext';
import CommentsSection from '../comments/CommentsSection';
import BrandLoader from '../../utils/BrandLoader';
import { getErrorMessage, getErrorStatus } from '../../utils/apiMessage';

const ACCENT = '#0C6E72';

/* Rough read-time from content length */
function readTime(content = '') {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export default function PostDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isInitializing } = useAuth();

  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [premiumLocked, setPremiumLocked] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // Wait until auth has finished restoring the session, so the request
    // carries the token. Without this, a logged-in user can race the fetch
    // ahead of the token and wrongly hit the premium 401 gate.
    if (isInitializing) return;

    let cancelled = false;
    const fetchPost = async () => {
      setIsLoading(true);
      setPremiumLocked(false);
      setNotFound(false);
      try {
        const postData = await postsService.getPostBySlug(slug);
        if (!cancelled) setPost(postData);
      } catch (error) {
        if (cancelled) return;
        const status = getErrorStatus(error);
        if (status === 401) {
          // 401 = backend saw no valid auth.
          // Only show the "premium, please log in" gate if the user really
          // is logged out. If a logged-in user gets a 401 here, the token
          // didn't reach the backend (expired/missing) — surface that instead
          // of falsely claiming the article is premium-locked.
          if (!user) {
            setPremiumLocked(true);
          } else {
            toast.error(getErrorMessage(error, 'Your session may have expired. Please sign in again.'));
            setNotFound(true);
          }
        } else if (status === 404) {
          setNotFound(true);
        } else {
          toast.error(getErrorMessage(error, 'Article could not be loaded.'));
          setNotFound(true);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchPost();
    return () => { cancelled = true; };
  }, [slug, user, isInitializing]);

  if (isLoading) return <BrandLoader label="Loading posts…" />;

  /* ── Premium gate (401) ── */
  if (premiumLocked) {
    return (
      <div
        className="w-full max-w-[640px] mx-auto px-4 sm:px-6 py-20 text-center animate-in fade-in duration-500"
        style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
      >
        <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: 'rgba(217,119,6,0.1)' }}>
          <Crown size={28} style={{ color: '#d97706' }} />
        </div>
        <h1
          className="text-indriya-text dark:text-indriya-darkText tracking-[-0.02em] mb-3"
          style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 400 }}
        >
          This is a premium article
        </h1>
        <p className="text-[15px] text-indriya-muted dark:text-indriya-darkMuted leading-[1.8] mb-8 max-w-[440px] mx-auto">
          Sign in to read the full article and unlock all premium content on IndriyaX.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 text-white text-[14px] font-bold px-7 py-3.5 rounded-full transition-all hover:scale-[0.98]"
            style={{ backgroundColor: ACCENT, boxShadow: '0 4px 16px rgba(12,110,114,0.25)' }}
          >
            <Lock size={15} /> Log in to read
          </button>
          <Link
            to="/posts"
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-indriya-muted dark:text-indriya-darkMuted hover:text-[#0C6E72] transition-colors"
          >
            <ArrowLeft size={14} /> Back to posts
          </Link>
        </div>
      </div>
    );
  }

  /* ── Not found (404) ── */
  if (notFound || !post) {
    return (
      <div
        className="w-full max-w-[640px] mx-auto px-4 sm:px-6 py-20 text-center animate-in fade-in duration-500"
        style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
      >
        <h1
          className="text-indriya-text dark:text-indriya-darkText mb-3"
          style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 400 }}
        >
          Article not found
        </h1>
        <p className="text-[15px] text-indriya-muted dark:text-indriya-darkMuted mb-8">
          This article may have been removed or is not yet published.
        </p>
        <Link
          to="/posts"
          className="inline-flex items-center gap-1.5 text-[14px] font-bold hover:underline"
          style={{ color: ACCENT }}
        >
          <ArrowLeft size={14} /> Back to all posts
        </Link>
      </div>
    );
  }

  return (
    <div
      className="w-full animate-in fade-in duration-500"
      style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
    >
      <article className="max-w-[760px] mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* Back */}
        <Link
          to="/posts"
          className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-indriya-muted dark:text-indriya-darkMuted hover:text-[#0C6E72] transition-colors mb-8 group"
        >
          <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
          All Posts
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 flex-wrap mb-5">
            {post.isPremium && (
              <span
                className="inline-flex items-center gap-1 text-[9px] font-black tracking-[0.12em] uppercase px-2.5 py-1 rounded-full text-white"
                style={{ backgroundColor: '#d97706' }}
              >
                <Crown size={10} /> Premium
              </span>
            )}
            {post.tags && post.tags.map(tag => (
              <span
                key={tag}
                className="text-[10px] font-black tracking-[0.1em] uppercase px-2.5 py-1 rounded-full"
                style={{ color: ACCENT, backgroundColor: 'rgba(12,110,114,0.08)' }}
              >
                {tag}
              </span>
            ))}
          </div>

          <h1
            className="text-indriya-text dark:text-indriya-darkText tracking-[-0.02em] leading-[1.1] mb-6"
            style={{ fontFamily: "'DM Serif Display', 'Georgia', serif", fontSize: 'clamp(30px, 5vw, 52px)', fontWeight: 400 }}
          >
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-[18px] text-indriya-muted dark:text-indriya-darkMuted leading-[1.7] mb-6">
              {post.excerpt}
            </p>
          )}

          {/* Byline */}
          <div className="flex flex-wrap items-center gap-4 py-5 border-y border-indriya-border dark:border-indriya-darkBorder">
            <div className="flex items-center gap-2.5">
              {post.author?.imageUrl ? (
                <img src={post.author.imageUrl} alt={post.author.fullName} className="w-9 h-9 rounded-full object-cover" />
              ) : (
                <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(12,110,114,0.12)' }}>
                  <User size={16} style={{ color: ACCENT }} />
                </div>
              )}
              <span className="text-[14px] font-bold text-indriya-text dark:text-indriya-darkText">
                {post.author?.fullName || 'Anonymous'}
              </span>
            </div>
            <span className="text-indriya-border dark:text-indriya-darkBorder">·</span>
            <div className="flex items-center gap-1.5 text-[13px] text-indriya-muted dark:text-indriya-darkMuted">
              <Calendar size={13} />
              <span>{new Date(post.createdAt).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <span className="text-indriya-border dark:text-indriya-darkBorder">·</span>
            <div className="flex items-center gap-1.5 text-[13px] text-indriya-muted dark:text-indriya-darkMuted">
              <Clock size={13} />
              <span>{readTime(post.content)} min read</span>
            </div>
          </div>
        </header>

        {/* Cover */}
        {post.coverImage && (
          <div className="mb-10 rounded-[20px] overflow-hidden border border-indriya-border dark:border-indriya-darkBorder">
            <img src={post.coverImage} alt={post.title} className="w-full h-auto object-cover max-h-[520px]" />
          </div>
        )}

        {/* Body */}
        <div
          className="text-[17px] text-indriya-text dark:text-indriya-darkText leading-[1.85] whitespace-pre-wrap mb-16"
          style={{ letterSpacing: '-0.003em' }}
        >
          {post.content}
        </div>

        {/* ── Comments (published posts only; component self-guards on 404) ── */}
        <div className="pt-10 border-t border-indriya-border dark:border-indriya-darkBorder">
          <CommentsSection postId={post.id} />
        </div>
      </article>
    </div>
  );
}
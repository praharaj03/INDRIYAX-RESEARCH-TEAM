import React, { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { MessageSquare, Send, Trash2, Pencil, Check, X, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { commentsService } from './commentsService';
import { useAuth } from '../auth/AuthContext';
import { getErrorMessage, getSuccessMessage, getErrorStatus } from '../../utils/apiMessage';

const ACCENT = '#0C6E72';
const MAX = 1000;

/* ─── Relative time formatter ─── */
function timeAgo(iso) {
  const then = new Date(iso).getTime();
  const diff = Math.max(0, Date.now() - then);
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
}

/* ─── Avatar with initials fallback ─── */
function Avatar({ url, name, size = 38 }) {
  const [err, setErr] = useState(false);
  const initials = (name || 'U').split(/\s+/).slice(0, 2).map(p => p[0]).join('').toUpperCase();
  const show = url && !err;
  return (
    <div
      className="rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
      style={{
        width: size, height: size,
        backgroundColor: show ? 'transparent' : 'rgba(12,110,114,0.12)',
      }}
    >
      {show ? (
        <img src={url} alt={name} className="w-full h-full object-cover" onError={() => setErr(true)} />
      ) : (
        <span className="font-bold" style={{ color: ACCENT, fontSize: size * 0.38 }}>{initials}</span>
      )}
    </div>
  );
}

/* ─── Single comment row ─── */
function CommentRow({ comment, canModify, onEdit, onDelete, busy }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(comment.content);

  const saveEdit = async () => {
    const trimmed = draft.trim();
    if (!trimmed) return toast.error('Comment cannot be empty.');
    if (trimmed.length > MAX) return toast.error('Comment is too long.');
    if (trimmed === comment.content) { setEditing(false); return; }
    const ok = await onEdit(comment.id, trimmed);
    if (ok) setEditing(false);
  };

  return (
    <div className="flex gap-3 group">
      <Avatar url={comment.user?.imageUrl} name={comment.user?.fullName} />
      <div className="flex-1 min-w-0">
        <div className="bg-indriya-secondary dark:bg-indriya-darkSecondary rounded-[16px] rounded-tl-[4px] px-4 py-3 border border-indriya-border dark:border-indriya-darkBorder">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[13px] font-bold text-indriya-text dark:text-indriya-darkText truncate">
                {comment.user?.fullName || 'Member'}
              </span>
              <span className="text-[11px] text-indriya-muted dark:text-indriya-darkMuted flex-shrink-0">
                · {timeAgo(comment.createdAt)}
              </span>
            </div>

            {/* Actions — only on own/admin comments */}
            {canModify && !editing && (
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button
                  onClick={() => { setDraft(comment.content); setEditing(true); }}
                  disabled={busy}
                  className="p-1.5 rounded-lg text-indriya-muted hover:text-[#0C6E72] hover:bg-black/5 dark:hover:bg-white/8 transition-colors disabled:opacity-50"
                  title="Edit"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => onDelete(comment.id)}
                  disabled={busy}
                  className="p-1.5 rounded-lg text-indriya-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-50"
                  title="Delete"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            )}
          </div>

          {editing ? (
            <div className="mt-2">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                maxLength={MAX}
                rows={3}
                autoFocus
                className="w-full px-3 py-2 bg-indriya-card dark:bg-indriya-darkCard border border-indriya-border dark:border-indriya-darkBorder rounded-[10px] text-[14px] text-indriya-text dark:text-white outline-none resize-none transition-colors"
                onFocus={(e) => (e.target.style.borderColor = ACCENT)}
                onBlur={(e) => (e.target.style.borderColor = '')}
              />
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={saveEdit}
                  disabled={busy}
                  className="inline-flex items-center gap-1.5 text-white text-[12px] font-bold px-3.5 py-1.5 rounded-full transition-all hover:scale-[0.97] disabled:opacity-60"
                  style={{ backgroundColor: ACCENT }}
                >
                  <Check size={13} /> Save
                </button>
                <button
                  onClick={() => { setEditing(false); setDraft(comment.content); }}
                  className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-indriya-muted dark:text-indriya-darkMuted hover:text-indriya-text dark:hover:text-indriya-darkText px-2.5 py-1.5 transition-colors"
                >
                  <X size={13} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-[14px] text-indriya-text dark:text-indriya-darkText leading-[1.7] whitespace-pre-wrap break-words">
              {comment.content}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   COMMENTS SECTION
   Drop into a post detail page:
     <CommentsSection postId={post.id} />
══════════════════════════════════════════ */
export default function CommentsSection({ postId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const taRef = useRef(null);

  const isAdmin = user?.role === 'ADMIN';

  // Best-effort ownership: read response has no user.id, only fullName.
  // The backend 403 is the real gate; this just decides whether to SHOW the controls.
  const canModify = (c) =>
    isAdmin || (!!user?.fullName && c.user?.fullName === user.fullName);

  useEffect(() => {
    if (!postId) return;
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      setUnavailable(false);
      try {
        const data = await commentsService.getCommentsForPost(postId);
        if (!cancelled) setComments(Array.isArray(data) ? data : []);
      } catch (err) {
        if (cancelled) return;
        // A 404 here means the post is a draft / not found — comments unavailable
        const status = getErrorStatus(err);
        if (status === 404) {
          setUnavailable(true);
        } else {
          toast.error(getErrorMessage(err, 'Failed to load comments.'));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [postId]);

  const autoGrow = (e) => {
    setContent(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px';
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!user) return;
    const trimmed = content.trim();
    if (!trimmed) return toast.error('Comment cannot be empty.');
    if (trimmed.length > MAX) return toast.error('Comment is too long (max 1000 characters).');

    setIsPosting(true);
    const t = toast.loading('Posting your comment…');
    try {
      const created = await commentsService.createComment({ postId, content: trimmed });
      // Optimistically prepend the returned comment (it includes the user object)
      if (created && created.id) {
        setComments((prev) => [created, ...prev]);
      } else {
        // Fallback: refetch if the shape was unexpected
        const fresh = await commentsService.getCommentsForPost(postId);
        setComments(Array.isArray(fresh) ? fresh : []);
      }
      setContent('');
      if (taRef.current) taRef.current.style.height = 'auto';
      toast.success(getSuccessMessage(created, 'Comment posted.'), { id: t });
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to post comment.'), { id: t });
    } finally {
      setIsPosting(false);
    }
  };

  const handleEdit = async (id, newContent) => {
    setBusyId(id);
    const prev = comments;
    // optimistic update
    setComments((cs) => cs.map((c) => (c.id === id ? { ...c, content: newContent } : c)));
    const t = toast.loading('Saving…');
    try {
      const updated = await commentsService.updateComment(id, newContent);
      if (updated && updated.content) {
        setComments((cs) => cs.map((c) => (c.id === id ? { ...c, ...updated } : c)));
      }
      toast.success(getSuccessMessage(updated, 'Comment updated.'), { id: t });
      return true;
    } catch (err) {
      setComments(prev); // rollback
      toast.error(getErrorMessage(err, 'Failed to update comment.'), { id: t });
      return false;
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this comment? This cannot be undone.')) return;
    setBusyId(id);
    const prev = comments;
    setComments((cs) => cs.filter((c) => c.id !== id)); // optimistic
    const t = toast.loading('Deleting…');
    try {
      const res = await commentsService.deleteComment(id);
      toast.success(getSuccessMessage(res, 'Comment deleted.'), { id: t });
    } catch (err) {
      setComments(prev); // rollback
      toast.error(getErrorMessage(err, 'Failed to delete comment.'), { id: t });
    } finally {
      setBusyId(null);
    }
  };

  /* ── Unavailable (draft / 404) ── */
  if (unavailable) return null;

  return (
    <section
      className="w-full"
      style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: 'rgba(12,110,114,0.1)' }}>
          <MessageSquare size={16} style={{ color: ACCENT }} />
        </div>
        <h2 className="text-[18px] font-bold text-indriya-text dark:text-indriya-darkText">
          Discussion
        </h2>
        {!isLoading && comments.length > 0 && (
          <span
            className="text-[11px] font-black px-2 py-0.5 rounded-full"
            style={{ backgroundColor: 'rgba(12,110,114,0.1)', color: ACCENT }}
          >
            {comments.length}
          </span>
        )}
      </div>

      {/* Composer */}
      {user ? (
        <form onSubmit={handlePost} className="mb-8">
          <div className="flex gap-3">
            <Avatar url={user.imageUrl} name={user.fullName} />
            <div className="flex-1">
              <textarea
                ref={taRef}
                value={content}
                onChange={autoGrow}
                maxLength={MAX}
                rows={2}
                placeholder="Share your thoughts…"
                disabled={isPosting}
                className="w-full px-4 py-3 bg-indriya-card dark:bg-indriya-darkCard border border-indriya-border dark:border-indriya-darkBorder rounded-[14px] text-[14px] text-indriya-text dark:text-white placeholder:text-indriya-muted/60 outline-none resize-none transition-colors disabled:opacity-60"
                style={{ minHeight: '52px' }}
                onFocus={(e) => (e.target.style.borderColor = ACCENT)}
                onBlur={(e) => (e.target.style.borderColor = '')}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-[11px] text-indriya-muted dark:text-indriya-darkMuted">
                  {content.length}/{MAX}
                </span>
                <button
                  type="submit"
                  disabled={isPosting || !content.trim()}
                  className="inline-flex items-center gap-2 text-white text-[13px] font-bold px-5 py-2.5 rounded-full transition-all hover:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: ACCENT, boxShadow: '0 4px 16px rgba(12,110,114,0.22)' }}
                >
                  {isPosting ? (
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : (
                    <><Send size={14} /> Post</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 flex items-center gap-3 p-4 rounded-[16px] bg-indriya-card dark:bg-indriya-darkCard border border-indriya-border dark:border-indriya-darkBorder">
          <div className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(12,110,114,0.08)' }}>
            <Lock size={15} style={{ color: ACCENT }} />
          </div>
          <p className="text-[13px] text-indriya-muted dark:text-indriya-darkMuted flex-1">
            <Link to="/login" className="font-bold hover:underline" style={{ color: ACCENT }}>Log in</Link>
            {' '}to join the discussion.
          </p>
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-[38px] h-[38px] rounded-full bg-indriya-secondary dark:bg-indriya-darkSecondary flex-shrink-0" />
              <div className="flex-1">
                <div className="h-3 w-32 rounded bg-indriya-secondary dark:bg-indriya-darkSecondary mb-2" />
                <div className="h-12 rounded-[16px] bg-indriya-secondary dark:bg-indriya-darkSecondary" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 px-6 rounded-[20px] bg-indriya-card dark:bg-indriya-darkCard border border-indriya-border dark:border-indriya-darkBorder">
          <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: 'rgba(12,110,114,0.08)' }}>
            <MessageSquare size={22} style={{ color: ACCENT }} />
          </div>
          <p className="text-[14px] font-bold text-indriya-text dark:text-indriya-darkText mb-1">
            No comments yet
          </p>
          <p className="text-[13px] text-indriya-muted dark:text-indriya-darkMuted">
            Be the first to share your thoughts on this article.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {comments.map((c) => (
            <CommentRow
              key={c.id}
              comment={c}
              canModify={canModify(c)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              busy={busyId === c.id}
            />
          ))}
        </div>
      )}
    </section>
  );
}
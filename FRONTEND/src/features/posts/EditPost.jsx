import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FileEdit, Sparkles, ArrowLeft, Crown } from 'lucide-react';
import { postsService } from './postsService';
import ImageUploader from '../uploads/ImageUploader';
import BrandLoader from '../../utils/BrandLoader';
import { getErrorMessage, getSuccessMessage } from '../../utils/apiMessage';

const ACCENT = '#d97706';        // amber — signals "editing"
const ACCENT_TINT = 'rgba(217,119,6,0.1)';

const inputClasses =
  "w-full px-4 py-3 bg-indriya-secondary dark:bg-indriya-darkSecondary border border-indriya-border dark:border-indriya-darkBorder rounded-[12px] text-[14px] text-indriya-text dark:text-white placeholder:text-indriya-muted/60 outline-none transition-colors";
const labelClasses =
  "text-[11px] font-black uppercase tracking-[0.08em] text-indriya-muted dark:text-indriya-darkMuted mb-2 block";

const focusProps = {
  onFocus: e => (e.target.style.borderColor = ACCENT),
  onBlur: e => (e.target.style.borderColor = ''),
};

export default function EditPost() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actualPostId, setActualPostId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    tags: '',
    published: true,
    isPremium: false,
  });
  const [coverImageUrl, setCoverImageUrl] = useState('');

  // Fetch existing data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await postsService.getPostBySlug(slug);
        setActualPostId(data.id);
        setFormData({
          title: data.title || '',
          excerpt: data.excerpt || '',
          content: data.content || '',
          tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
          published: data.published !== false, // backend field is `published`
          isPremium: !!data.isPremium,
        });
        setCoverImageUrl(data.coverImage || ''); // backend field is `coverImage`
      } catch (err) {
        toast.error(getErrorMessage(err, 'Failed to load post data.'));
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [slug, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      return toast.error('Title and content are required.');
    }
    if (formData.title.trim().length < 5) {
      return toast.error('Title must be at least 5 characters.');
    }
    if (formData.content.trim().length < 20) {
      return toast.error('Article content must be at least 20 characters.');
    }

    setIsSubmitting(true);
    const t = toast.loading('Updating post…');
    try {
      const processedTags = (formData.tags || '')
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);

      // Send ONLY known fields (backend rejects unknown ones with 400)
      const payload = {
        title: formData.title.trim(),
        content: formData.content,
        excerpt: formData.excerpt.trim(),
        published: formData.published,
        isPremium: formData.isPremium,
        tags: processedTags,
        coverImage: coverImageUrl || undefined,
      };

      const res = await postsService.updatePost(actualPostId, payload);
      toast.success(getSuccessMessage(res, 'Post updated successfully!'), { id: t });
      navigate('/dashboard');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to update post.'), { id: t });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <BrandLoader label="Loading post…" />;

  return (
    <div
      className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 animate-in fade-in duration-300"
      style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
    >
      {/* Header */}
      <button
        onClick={() => navigate('/dashboard')}
        className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-indriya-muted dark:text-indriya-darkMuted hover:text-amber-600 transition-colors mb-5 group"
      >
        <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to Dashboard
      </button>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0" style={{ backgroundColor: ACCENT_TINT }}>
          <FileEdit size={22} style={{ color: ACCENT }} />
        </div>
        <div>
          <p className="text-[11px] font-black tracking-[0.14em] uppercase text-indriya-muted dark:text-indriya-darkMuted mb-0.5">Editing</p>
          <h1
            className="text-indriya-text dark:text-indriya-darkText tracking-[-0.02em] line-clamp-1"
            style={{ fontFamily: "'DM Serif Display', 'Georgia', serif", fontSize: 'clamp(26px, 3vw, 34px)', fontWeight: 400 }}
          >
            {formData.title || 'Edit Post'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">

        {/* LEFT — content */}
        <div className="space-y-5 order-2 lg:order-1">
          <div className="bg-indriya-card dark:bg-indriya-darkCard border border-indriya-border dark:border-indriya-darkBorder rounded-[24px] p-6 sm:p-7">
            <div className="space-y-5">
              <div>
                <label className={labelClasses}>Article Title</label>
                <input required name="title" value={formData.title} onChange={handleChange} className={`${inputClasses} text-[16px] font-semibold`} {...focusProps} />
              </div>
              <div>
                <label className={labelClasses}>Excerpt <span className="text-indriya-muted/60 normal-case font-medium">(optional teaser)</span></label>
                <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} maxLength={500} className={`${inputClasses} resize-none min-h-[70px]`} placeholder="A short summary…" {...focusProps} />
              </div>
              <div>
                <label className={labelClasses}>Article Content</label>
                <textarea required name="content" value={formData.content} onChange={handleChange} className={`${inputClasses} resize-y min-h-[360px] leading-[1.8]`} placeholder="Write your article here…" {...focusProps} />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — settings */}
        <div className="space-y-5 order-1 lg:order-2 lg:sticky lg:top-28">
          <div className="bg-indriya-card dark:bg-indriya-darkCard border border-indriya-border dark:border-indriya-darkBorder rounded-[24px] p-6">
            <h3 className="text-[14px] font-bold text-indriya-text dark:text-indriya-darkText mb-4">Cover Image</h3>

            {/* Current cover preview */}
            {coverImageUrl ? (
              <div className="mb-4">
                <p className="text-[11px] font-black uppercase tracking-[0.08em] text-indriya-muted dark:text-indriya-darkMuted mb-2">
                  Current cover
                </p>
                <div className="relative rounded-[14px] overflow-hidden border border-indriya-border dark:border-indriya-darkBorder">
                  <img
                    src={coverImageUrl}
                    alt="Current cover"
                    className="w-full h-40 object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
              </div>
            ) : (
              <div className="mb-4 flex items-center justify-center h-28 rounded-[14px] border border-dashed border-indriya-border dark:border-indriya-darkBorder">
                <p className="text-[12px] text-indriya-muted dark:text-indriya-darkMuted">No cover image yet</p>
              </div>
            )}

            {/* Replace / upload new */}
            <ImageUploader
              label={coverImageUrl ? 'Replace cover image' : 'Upload cover image'}
              folder="posts"
              onUploadSuccess={(url) => setCoverImageUrl(url)}
              existingImage={coverImageUrl}
            />
          </div>

          <div className="bg-indriya-card dark:bg-indriya-darkCard border border-indriya-border dark:border-indriya-darkBorder rounded-[24px] p-6 space-y-5">
            <div>
              <label className={labelClasses}>Tags <span className="text-indriya-muted/60 normal-case font-medium">(comma separated)</span></label>
              <input name="tags" value={formData.tags} onChange={handleChange} className={inputClasses} placeholder="optometry, research" {...focusProps} />
            </div>

            {/* Premium toggle */}
            <label className="flex items-center justify-between p-3.5 rounded-[12px] bg-indriya-secondary dark:bg-indriya-darkSecondary border border-indriya-border dark:border-indriya-darkBorder cursor-pointer">
              <div className="flex items-center gap-2">
                <Crown size={15} style={{ color: '#d97706' }} />
                <div>
                  <p className="text-[13px] font-bold text-indriya-text dark:text-indriya-darkText">Premium</p>
                  <p className="text-[11px] text-indriya-muted dark:text-indriya-darkMuted">Body requires login</p>
                </div>
              </div>
              <span className="relative inline-block w-11 h-6 flex-shrink-0">
                <input type="checkbox" name="isPremium" checked={formData.isPremium} onChange={handleChange} className="peer sr-only" />
                <span className="absolute inset-0 rounded-full bg-gray-300 dark:bg-[#333] transition-colors" style={{ backgroundColor: formData.isPremium ? '#d97706' : undefined }} />
                <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform peer-checked:translate-x-5 shadow-sm" />
              </span>
            </label>

            {/* Published toggle */}
            <label className="flex items-center justify-between p-3.5 rounded-[12px] bg-indriya-secondary dark:bg-indriya-darkSecondary border border-indriya-border dark:border-indriya-darkBorder cursor-pointer">
              <div>
                <p className="text-[13px] font-bold text-indriya-text dark:text-indriya-darkText">Published</p>
                <p className="text-[11px] text-indriya-muted dark:text-indriya-darkMuted">{formData.published ? 'Live for everyone' : 'Saved as draft'}</p>
              </div>
              <span className="relative inline-block w-11 h-6 flex-shrink-0">
                <input type="checkbox" name="published" checked={formData.published} onChange={handleChange} className="peer sr-only" />
                <span className="absolute inset-0 rounded-full bg-gray-300 dark:bg-[#333] transition-colors" style={{ backgroundColor: formData.published ? '#0C6E72' : undefined }} />
                <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform peer-checked:translate-x-5 shadow-sm" />
              </span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-8 py-4 text-white font-bold text-[15px] rounded-[14px] transition-all hover:-translate-y-0.5 disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ backgroundColor: ACCENT, boxShadow: '0 8px 28px rgba(217,119,6,0.30)' }}
            >
              {isSubmitting
                ? <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                : <><Sparkles size={16} /> Save Changes</>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
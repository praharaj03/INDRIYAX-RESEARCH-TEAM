import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, X, Loader2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadService } from './uploadService';
import { getErrorMessage } from '../../utils/apiMessage';

const ACCENT = '#0C6E72';

/**
 * ImageUploader
 *
 * Props:
 *   - folder: storage folder ('events' | 'posts' | 'avatars' | 'misc')
 *   - label: field label
 *   - onUploadSuccess(url): called with the uploaded URL, or '' when removed
 *   - currentImageUrl / existingImage / currentImage: initial image to show
 *     (all three accepted for compatibility across pages)
 */
export default function ImageUploader({
  folder = 'misc',
  label = 'Upload Image',
  onUploadSuccess,
  currentImageUrl = '',
  existingImage = '',
  currentImage = '',
}) {
  const initial = currentImageUrl || existingImage || currentImage || '';
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(initial);
  const fileInputRef = useRef(null);

  // Keep preview in sync if the parent's initial image arrives/changes later
  // (e.g. EditPost/EditEvent loading existing data asynchronously).
  useEffect(() => {
    const incoming = currentImageUrl || existingImage || currentImage || '';
    if (incoming && incoming !== previewUrl) setPreviewUrl(incoming);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentImageUrl, existingImage, currentImage]);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Client-side guards mirroring the backend (instant feedback)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Maximum allowed size is 5 MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    const okType = /^image\/(jpeg|jpg|png|webp|gif)$/i.test(file.type);
    if (!okType) {
      toast.error('Unsupported file type. Allowed: JPG, JPEG, PNG, WEBP, GIF.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsUploading(true);
    const t = toast.loading('Uploading image…');
    try {
      const url = await uploadService.uploadImage(file, folder);
      if (!url) throw new Error('Upload did not return a URL.');
      setPreviewUrl(url);
      toast.success('Image uploaded successfully.', { id: t });
      onUploadSuccess?.(url);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Image upload failed. Please try again.'), { id: t });
      if (fileInputRef.current) fileInputRef.current.value = '';
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    onUploadSuccess?.(''); // parent clears its URL ('' -> treat as removed)
  };

  return (
    <div className="w-full" style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      {label && (
        <label className="block text-[11px] font-black uppercase tracking-[0.08em] text-indriya-muted dark:text-indriya-darkMuted mb-2">
          {label}
        </label>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        disabled={isUploading}
      />

      {previewUrl ? (
        /* Preview state */
        <div className="relative rounded-[14px] overflow-hidden border border-indriya-border dark:border-indriya-darkBorder group">
          <img src={previewUrl} alt="Preview" className="w-full h-44 object-cover" />
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="animate-spin text-white" size={28} />
            </div>
          )}
          {/* Hover actions */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] font-bold text-white transition-transform hover:scale-[0.97]"
              style={{ backgroundColor: ACCENT }}
              title="Replace image"
            >
              <RefreshCw size={13} /> Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={isUploading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] font-bold text-white bg-red-500 hover:bg-red-600 transition-transform hover:scale-[0.97]"
              title="Remove image"
            >
              <X size={13} /> Remove
            </button>
          </div>
        </div>
      ) : (
        /* Upload prompt state */
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full h-44 flex flex-col items-center justify-center border-2 border-dashed rounded-[14px] transition-all border-indriya-border dark:border-indriya-darkBorder hover:bg-indriya-secondary/60 dark:hover:bg-indriya-darkSecondary/60"
          style={{ cursor: isUploading ? 'wait' : 'pointer' }}
          onMouseEnter={(e) => { if (!isUploading) e.currentTarget.style.borderColor = ACCENT; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = ''; }}
        >
          {isUploading ? (
            <>
              <Loader2 className="animate-spin mb-3" size={30} style={{ color: ACCENT }} />
              <span className="text-[13px] font-semibold" style={{ color: ACCENT }}>Uploading…</span>
            </>
          ) : (
            <>
              <div className="p-3 rounded-full mb-3" style={{ backgroundColor: 'rgba(12,110,114,0.08)' }}>
                <UploadCloud size={26} style={{ color: ACCENT }} />
              </div>
              <span className="text-[13px] font-semibold text-indriya-text dark:text-indriya-darkText mb-1">
                Click to upload an image
              </span>
              <span className="text-[11px] text-indriya-muted dark:text-indriya-darkMuted">
                JPG, PNG, WEBP, GIF · up to 5 MB
              </span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
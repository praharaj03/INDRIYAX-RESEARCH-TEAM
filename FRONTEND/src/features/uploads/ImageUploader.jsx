import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadService } from './uploadService';

export default function ImageUploader({ 
  folder = 'general', 
  currentImageUrl = '', 
  onUploadSuccess, 
  label = 'Upload Image' 
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate size (5MB limit per your backend docs)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds the 5MB limit.');
      return;
    }

    setIsUploading(true);
    const loadingToast = toast.loading('Uploading image securely...');

    try {
      // Step 1: Execute the upload API call immediately
      const response = await uploadService.uploadImage(file, folder);
      
      // Extract the Supabase public URL from the response envelope
      const uploadedUrl = response.data.url;
      
      setPreviewUrl(uploadedUrl);
      toast.success('Image uploaded successfully!', { id: loadingToast });
      
      // Pass the URL up to the parent form (Step 2 preparation)
      if (onUploadSuccess) {
        onUploadSuccess(uploadedUrl);
      }
    } catch (error) {
      toast.error(error.message || 'Image upload failed. Please try again.', { id: loadingToast });
      // Reset input so the user can try again
      if (fileInputRef.current) fileInputRef.current.value = '';
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onUploadSuccess) onUploadSuccess(''); // Clear the URL in the parent form
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        {label}
      </label>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/jpeg, image/png, image/webp, image/gif"
        className="hidden"
        disabled={isUploading}
      />

      {previewUrl ? (
        /* Preview State */
        <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group">
          <img 
            src={previewUrl} 
            alt="Uploaded preview" 
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transform hover:scale-105 transition-all"
              title="Remove Image"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      ) : (
        /* Upload Prompt State */
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className={`w-full h-48 flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-all ${
            isUploading 
              ? 'border-medical-300 bg-medical-50 dark:bg-medical-900/10 cursor-wait' 
              : 'border-slate-300 dark:border-slate-700 hover:border-medical-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer'
          }`}
        >
          {isUploading ? (
            <>
              <Loader2 className="animate-spin text-medical-500 mb-3" size={32} />
              <span className="text-sm font-medium text-medical-600 dark:text-medical-400">
                Processing...
              </span>
            </>
          ) : (
            <>
              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full mb-3 text-slate-500 dark:text-slate-400">
                <UploadCloud size={28} />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Click to upload an image
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                JPG, PNG, WEBP up to 5MB
              </span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
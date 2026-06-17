import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { postsService } from './postsService';
import ImageUploader from '../uploads/ImageUploader';

export default function CreatePost() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '', // We will split this into an array before submitting
  });

  // State to hold the uploaded Supabase URL
  const [coverImageUrl, setCoverImageUrl] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      return toast.error('Title and content are required.');
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Publishing your article...');

    try {
      // Clean up tags: split by comma, trim whitespace, remove empty strings
      const processedTags = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const finalPayload = {
        title: formData.title,
        content: formData.content,
        tags: processedTags,
        coverImage: coverImageUrl || undefined, // Send URL if uploaded, otherwise undefined
      };

      await postsService.createPost(finalPayload);

      toast.success('Post published successfully!', { id: loadingToast });
      navigate('/dashboard'); // Or navigate to the public blog feed
    } catch (error) {
      toast.error(error.message || 'Failed to publish post.', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Write an Article</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Share your medical insights with the world.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        
        {/* Cover Image Uploader */}
        <div>
          <ImageUploader 
            label="Cover Image (Optional)" 
            folder="posts" 
            onUploadSuccess={(url) => setCoverImageUrl(url)} 
          />
        </div>

        {/* Post Metadata */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="title">
              Article Title
            </label>
            <input
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 text-lg font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-medical-500 dark:text-white transition-colors"
              placeholder="e.g., The Future of Telemedicine"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="tags">
              Tags (Comma separated)
            </label>
            <input
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-medical-500 dark:text-white transition-colors"
              placeholder="health, tech, startup"
            />
          </div>
        </div>

        {/* Post Content */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="content">
            Article Content
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows={12}
            value={formData.content}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-medical-500 dark:text-white transition-colors resize-y"
            placeholder="Write your article content here... (Markdown supported on backend)"
          />
        </div>

        {/* Actions */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-medical-500 hover:bg-medical-600 text-white font-bold rounded-lg shadow-lg shadow-medical-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Publishing...' : 'Publish Article'}
          </button>
        </div>
      </form>
    </div>
  );
}
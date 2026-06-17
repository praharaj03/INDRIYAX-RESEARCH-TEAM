import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { User, Calendar, MessageSquare } from 'lucide-react';
import { postsService } from './postsService';
import { commentsService } from '../comments/commentsService';
import { useAuth } from '../auth/AuthContext';

export default function PostDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCommenting, setIsCommenting] = useState(false);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const postData = await postsService.getPostBySlug(slug);
        setPost(postData);
        
        // Fetch comments using the newly retrieved post ID
        const commentsData = await commentsService.getCommentsForPost(postData.id);
        setComments(commentsData);
      } catch (error) {
        toast.error(error.message || 'Article could not be found.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostAndComments();
  }, [slug]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setIsCommenting(true);
    try {
      await commentsService.createComment({
        postId: post.id,
        content: newComment
      });
      
      toast.success('Comment posted!');
      setNewComment('');
      
      // Refresh comments to show the new one
      const updatedComments = await commentsService.getCommentsForPost(post.id);
      setComments(updatedComments);
    } catch (error) {
      toast.error(error.message || 'Failed to post comment.');
    } finally {
      setIsCommenting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-500"></div>
      </div>
    );
  }

  if (!post) return <div className="text-center py-20 text-xl font-semibold">Post not found.</div>;

  return (
    <article className="max-w-3xl mx-auto animate-in fade-in duration-500">
      
      {/* Article Header */}
      <header className="mb-10 text-center sm:text-left">
        {post.tags && post.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap justify-center sm:justify-start mb-4">
            {post.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-medical-50 dark:bg-medical-900/20 text-medical-600 dark:text-medical-400 text-sm font-semibold rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
          {post.title}
        </h1>
        
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-slate-600 dark:text-slate-400 border-y border-slate-200 dark:border-slate-800 py-4">
          <div className="flex items-center gap-2">
            {post.author?.imageUrl ? (
              <img src={post.author.imageUrl} alt={post.author.fullName} className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                <User size={16} />
              </div>
            )}
            <span className="font-semibold text-slate-900 dark:text-slate-200">{post.author?.fullName || 'Anonymous'}</span>
          </div>
          <span className="hidden sm:inline">•</span>
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>{new Date(post.createdAt).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="mb-10 rounded-2xl overflow-hidden shadow-md">
          <img src={post.coverImage} alt="Cover" className="w-full h-auto object-cover max-h-[500px]" />
        </div>
      )}

      {/* Article Body */}
      <div className="prose prose-lg dark:prose-invert prose-medical max-w-none mb-16 whitespace-pre-wrap">
        {post.content}
      </div>

      {/* Comments Section */}
      <section className="border-t border-slate-200 dark:border-slate-800 pt-10">
        <div className="flex items-center gap-2 mb-8">
          <MessageSquare className="text-medical-500" size={24} />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Discussion ({comments.length})</h2>
        </div>

        {/* Comment Input */}
        {user ? (
          <form onSubmit={handleCommentSubmit} className="mb-10 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <textarea
              required
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add to the discussion..."
              className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-medical-500 dark:text-white resize-y mb-3"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isCommenting}
                className="px-6 py-2 bg-medical-500 hover:bg-medical-600 text-white font-semibold rounded-lg shadow transition-all disabled:opacity-70"
              >
                {isCommenting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-10 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <p className="text-slate-600 dark:text-slate-400">Please sign in to join the discussion.</p>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <div className="flex-shrink-0">
                {comment.user?.imageUrl ? (
                  <img src={comment.user.imageUrl} alt="User" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    <User size={20} className="text-slate-500" />
                  </div>
                )}
              </div>
              <div className="flex-grow bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl rounded-tl-none">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-slate-900 dark:text-slate-200">
                    {comment.user?.fullName || 'Anonymous'}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(comment.createdAt).toLocaleDateString('en-IN')}
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </article>
  );
}
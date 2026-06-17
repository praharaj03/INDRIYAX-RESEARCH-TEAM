import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Calendar, User } from 'lucide-react';
import { postsService } from './postsService';

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await postsService.getAllPosts();
        setPosts(data); // Assuming backend returns the array directly in the data property
      } catch (error) {
        toast.error(error.message || 'Failed to load articles.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-500"></div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-20 animate-in fade-in">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">No articles published yet</h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Check back soon for the latest medical insights.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Medical Insights
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">
          Discover the latest research, tech trends, and clinical perspectives from our expert authors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link 
            to={`/posts/${post.slug}`} 
            key={post.id} 
            className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            {/* Cover Image */}
            <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              {post.coverImage ? (
                <img 
                  src={post.coverImage} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <span className="font-medium">No Image</span>
                </div>
              )}
              
              {/* Floating Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                  {post.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-xs font-semibold text-medical-600 dark:text-medical-400 rounded-full shadow-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Card Content */}
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-medical-500 transition-colors">
                {post.title}
              </h3>
              
              <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  {post.author?.imageUrl ? (
                    <img src={post.author.imageUrl} alt={post.author.fullName} className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                      <User size={12} className="text-slate-500 dark:text-slate-400" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {post.author?.fullName || 'Anonymous'}
                  </span>
                </div>
                
                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 space-x-1">
                  <Calendar size={14} />
                  <span>
                    {new Date(post.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LayoutDashboard, Calendar as CalendarIcon, FileText, Plus, Edit, Trash2, Eye, IndianRupee, Users } from 'lucide-react';
import { eventsService } from '../events/eventsService';
import { postsService } from '../posts/postsService';
import { dashboardService } from './dashboardService';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  // Data States
  const [stats, setStats] = useState({ totalRevenue: 0, totalParticipants: 0, activeEvents: 0 });
  const [events, setEvents] = useState([]);
  const [posts, setPosts] = useState([]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch all required dashboard data in parallel
      const [eventsData, postsData, statsData] = await Promise.all([
        eventsService.getAllEvents().catch(() => []),
        postsService.getAllPosts().catch(() => []),
        dashboardService.getOverallStats().catch(() => ({ totalRevenue: 0, totalParticipants: 0, activeEvents: 0 }))
      ]);

      setEvents(eventsData);
      setPosts(postsData);
      setStats(statsData);
    } catch (error) {
      toast.error('Failed to load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event? This cannot be undone.')) return;
    try {
      await eventsService.deleteEvent(id);
      toast.success('Event deleted.');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete event.');
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await postsService.deletePost(id);
      toast.success('Post deleted.');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete post.');
    }
  };

  if (isLoading) return <div className="flex h-[60vh] items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-500"></div></div>;

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Command Center</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your platform's content and financials.</p>
        </div>
        
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'overview' ? 'bg-white dark:bg-slate-800 shadow text-medical-500' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <LayoutDashboard size={16} /> Overview
          </button>
          <button 
            onClick={() => setActiveTab('events')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'events' ? 'bg-white dark:bg-slate-800 shadow text-medical-500' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <CalendarIcon size={16} /> Events
          </button>
          <button 
            onClick={() => setActiveTab('posts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'posts' ? 'bg-white dark:bg-slate-800 shadow text-medical-500' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <FileText size={16} /> Blog Posts
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-500 dark:text-slate-400 font-medium">Total Revenue</h3>
              <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg"><IndianRupee size={20}/></div>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">₹{new Intl.NumberFormat('en-IN').format(stats.totalRevenue)}</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-500 dark:text-slate-400 font-medium">Total Participants</h3>
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg"><Users size={20}/></div>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalParticipants}</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-500 dark:text-slate-400 font-medium">Active Events</h3>
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg"><CalendarIcon size={20}/></div>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.activeEvents}</p>
          </div>
        </div>
      )}

      {/* TAB 2: EVENTS MANAGER */}
      {activeTab === 'events' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Event Directory</h2>
            <Link to="/events/create" className="flex items-center gap-2 bg-medical-500 hover:bg-medical-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
              <Plus size={16} /> New Event
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4 font-semibold text-slate-600 dark:text-slate-400">Event Name</th>
                  <th className="p-4 font-semibold text-slate-600 dark:text-slate-400">Date</th>
                  <th className="p-4 font-semibold text-slate-600 dark:text-slate-400">Type</th>
                  <th className="p-4 font-semibold text-slate-600 dark:text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {events.length === 0 ? (
                  <tr><td colSpan="4" className="p-8 text-center text-slate-500">No events created yet.</td></tr>
                ) : events.map(event => (
                  <tr key={event.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-4 font-medium text-slate-900 dark:text-white">{event.title}</td>
                    <td className="p-4 text-slate-500">{new Date(event.date).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-semibold">{event.type}</span>
                    </td>
                    <td className="p-4 flex items-center justify-end gap-3">
                      {/* View Verifications (Admin Detail Route) */}
                      <Link to={`/dashboard/events/${event.id}`} className="text-blue-500 hover:text-blue-600" title="Manage Payments">
                        <Eye size={18} />
                      </Link>
                      <button onClick={() => toast('Edit feature coming next!')} className="text-slate-500 hover:text-medical-500" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDeleteEvent(event.id)} className="text-red-400 hover:text-red-600" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: POSTS MANAGER */}
      {activeTab === 'posts' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Blog Publications</h2>
            <Link to="/posts/create" className="flex items-center gap-2 bg-medical-500 hover:bg-medical-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
              <Plus size={16} /> Write Post
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4 font-semibold text-slate-600 dark:text-slate-400">Article Title</th>
                  <th className="p-4 font-semibold text-slate-600 dark:text-slate-400">Author</th>
                  <th className="p-4 font-semibold text-slate-600 dark:text-slate-400">Published</th>
                  <th className="p-4 font-semibold text-slate-600 dark:text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {posts.length === 0 ? (
                  <tr><td colSpan="4" className="p-8 text-center text-slate-500">No posts published yet.</td></tr>
                ) : posts.map(post => (
                  <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-4 font-medium text-slate-900 dark:text-white line-clamp-1">{post.title}</td>
                    <td className="p-4 text-slate-500">{post.author?.fullName || 'Admin'}</td>
                    <td className="p-4 text-slate-500">{new Date(post.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 flex items-center justify-end gap-3">
                      <Link to={`/posts/${post.slug}`} target="_blank" className="text-slate-500 hover:text-medical-500" title="View Live">
                        <Eye size={18} />
                      </Link>
                      <button onClick={() => toast('Edit feature coming next!')} className="text-slate-500 hover:text-medical-500" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDeletePost(post.id)} className="text-red-400 hover:text-red-600" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
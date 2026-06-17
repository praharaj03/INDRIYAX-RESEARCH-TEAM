import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Calendar, ShieldCheck, Video, ExternalLink, Clock, AlertTriangle } from 'lucide-react';
import { useAuth } from './AuthContext';
import { authService } from './authService';
import ImageUploader from '../uploads/ImageUploader';

export default function Profile() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Profile Update Form State
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.imageUrl || '');

  const fetchUserEnrollments = async () => {
    try {
      const data = await authService.getMyEnrollments();
      setEnrollments(data);
    } catch (error) {
      toast.error(error.message || 'Failed to sync event enrollments.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserEnrollments();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) return toast.error('Name cannot be empty.');

    setIsUpdating(true);
    const loadingToast = toast.loading('Updating your account profile...');

    try {
      await authService.updateProfile({ fullName, imageUrl: avatarUrl });
      toast.success('Account profile updated successfully!', { id: loadingToast });
      
      // Briefly reload to sync the global header context with the new name/avatar
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast.error(error.message || 'Profile update failed.', { id: loadingToast });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <div className="flex h-[60vh] items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-500"></div></div>;

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Account Management Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Account Settings</h3>
            
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div>
                <ImageUploader 
                  label="Profile Picture" 
                  folder="avatars" 
                  currentImageUrl={avatarUrl}
                  onUploadSuccess={(url) => setAvatarUrl(url)} 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input 
                  type="text" 
                  disabled 
                  value={user?.email} 
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 dark:text-slate-400 cursor-not-allowed text-sm" 
                />
                <p className="text-xs text-slate-400 mt-1">Managed securely via Supabase.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input 
                  required
                  type="text" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-medical-500 dark:text-white" 
                />
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full py-2 bg-medical-500 hover:bg-medical-600 text-white font-semibold rounded-lg shadow transition-all disabled:opacity-70"
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>

        {/* Enrollments Tracking Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm min-h-[400px]">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">My Event Passes</h3>

            {enrollments.length === 0 ? (
              <div className="text-center py-20 text-slate-500 dark:text-slate-400">
                You haven't registered for any medical workshops or events yet.
              </div>
            ) : (
              <div className="space-y-6">
                {enrollments.map((ticket) => (
                  <div key={ticket.id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-950/20">
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <img 
                        src={ticket.event.thumbnail || "https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&q=80&w=200"} 
                        alt="Event cover" 
                        className="w-20 h-20 rounded-lg object-cover bg-slate-100 dark:bg-slate-800"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white hover:text-medical-500 transition-colors">
                          {ticket.event.title}
                        </h4>
                        <p className="text-sm text-slate-500 mt-0.5">Speaker: {ticket.event.speaker}</p>
                        <div className="flex items-center gap-1 text-xs text-slate-400 mt-2">
                          <Calendar size={12} />
                          <span>{new Date(ticket.event.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>

                    {/* Verification Status Matrix */}
                    <div className="w-full sm:w-auto text-left sm:text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                      {ticket.status === 'PENDING' && (
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 text-xs font-bold rounded-md flex items-center gap-1">
                          <Clock size={14} /> PENDING REVIEW
                        </span>
                      )}
                      {ticket.status === 'REJECTED' && (
                        <span className="px-2.5 py-1 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 text-xs font-bold rounded-md flex items-center gap-1">
                          <AlertTriangle size={14} /> DISAPPROVED
                        </span>
                      )}
                      {ticket.status === 'APPROVED' && (
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 text-xs font-bold rounded-md flex items-center gap-1">
                          <ShieldCheck size={14} /> VERIFIED ACCESS
                        </span>
                      )}

                      {/* Expose Meeting Link Conditionally */}
                      {ticket.status === 'APPROVED' && ticket.event.meetingLink ? (
                        <a 
                          href={ticket.event.meetingLink} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="mt-1 inline-flex items-center gap-1 text-sm text-medical-500 font-bold hover:text-medical-600 transition-colors"
                        >
                          Join Live Session <ExternalLink size={14} />
                        </a>
                      ) : ticket.status === 'APPROVED' ? (
                        <span className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                          <Video size={12}/> Link active on event day
                        </span>
                      ) : null}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
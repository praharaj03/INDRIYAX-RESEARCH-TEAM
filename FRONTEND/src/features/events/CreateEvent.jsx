import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { eventsService } from './eventsService';
import ImageUploader from '../uploads/ImageUploader';

export default function CreateEvent() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    speaker: '',
    venue: '',
    type: 'OFFLINE',
    date: '',
    isFree: true,
    price: '',
    upiId: '',
    upiNumber: '',
  });

  // Independent state for our uploaded image URLs (Step 1 of the flow)
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (!thumbnailUrl) return toast.error('Please upload an event thumbnail.');
    if (!formData.isFree && (!formData.price || !qrCodeUrl || !formData.upiId)) {
      return toast.error('Paid events require a Price, UPI ID, and a QR Code.');
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Creating event...');

    try {
      // Step 2: Assemble the final payload mapping the uploaded URLs to the required keys
      const finalPayload = {
        ...formData,
        price: formData.isFree ? 0 : Number(formData.price),
        thumbnail: thumbnailUrl,
        qrCodeUrl: formData.isFree ? undefined : qrCodeUrl,
      };

      await eventsService.createEvent(finalPayload);
      
      toast.success('Event created successfully!', { id: loadingToast });
      navigate('/dashboard'); // Redirect admin back to dashboard on success
    } catch (error) {
      toast.error(error.message || 'Failed to create event.', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Create New Event</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Publish a new workshop or seminar to the platform.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        
        {/* Section 1: Basic Info */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">Basic Information</h3>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Event Title</label>
              <input required name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-medical-500 dark:text-white" placeholder="e.g., Advanced React Patterns" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <textarea required name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-medical-500 dark:text-white" placeholder="Detailed breakdown of the event..." />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Speaker Name</label>
              <input required name="speaker" value={formData.speaker} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-medical-500 dark:text-white" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date & Time</label>
              <input required type="datetime-local" name="date" value={formData.date} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-medical-500 dark:text-white" />
            </div>
          </div>
        </div>

        {/* Section 2: Logistics & Media */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">Logistics & Media</h3>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Event Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-medical-500 dark:text-white">
                <option value="OFFLINE">Offline (In-Person)</option>
                <option value="ONLINE">Online (Virtual)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Venue / Link</label>
              <input required name="venue" value={formData.venue} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-medical-500 dark:text-white" placeholder="Zoom Link or Building Address" />
            </div>

            <div className="sm:col-span-2">
              {/* Using our reusable component for the Event Thumbnail */}
              <ImageUploader 
                label="Event Thumbnail Cover" 
                folder="events" 
                onUploadSuccess={(url) => setThumbnailUrl(url)} 
              />
            </div>
          </div>
        </div>

        {/* Section 3: Financials */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Ticketing & Payment</h3>
            <label className="flex items-center space-x-3 cursor-pointer">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Is this a Free Event?</span>
              <input type="checkbox" name="isFree" checked={formData.isFree} onChange={handleChange} className="w-5 h-5 text-medical-500 rounded focus:ring-medical-500" />
            </label>
          </div>

          {!formData.isFree && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Ticket Price (₹)</label>
                <input type="number" min="1" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-medical-500 dark:text-white" placeholder="500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Receiving UPI ID</label>
                <input name="upiId" value={formData.upiId} onChange={handleChange} className="w-full px-4 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-medical-500 dark:text-white" placeholder="admin@ybl" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contact Number (Optional)</label>
                <input name="upiNumber" value={formData.upiNumber} onChange={handleChange} className="w-full px-4 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-medical-500 dark:text-white" placeholder="+91 98765 43210" />
              </div>

              <div className="sm:col-span-2">
                {/* Reusing the exact same component for the QR Code! */}
                <ImageUploader 
                  label="Upload Bank QR Code" 
                  folder="qrcodes" 
                  onUploadSuccess={(url) => setQrCodeUrl(url)} 
                />
              </div>
            </div>
          )}
        </div>

        <div className="pt-4">
          <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto px-8 py-3 bg-medical-500 hover:bg-medical-600 text-white font-bold rounded-lg shadow-lg shadow-medical-500/30 transition-all disabled:opacity-70">
            {isSubmitting ? 'Publishing Event...' : 'Publish Event'}
          </button>
        </div>
      </form>
    </div>
  );
}
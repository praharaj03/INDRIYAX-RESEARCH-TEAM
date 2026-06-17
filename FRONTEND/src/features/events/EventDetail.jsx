import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Calendar, MapPin, User, IndianRupee, Info } from 'lucide-react';
import { eventsService } from './eventsService';
import { paymentsService } from '../payments/paymentsService';
import { useAuth } from '../auth/AuthContext';
import ImageUploader from '../uploads/ImageUploader';

export default function EventDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Payment Form State
  const [utr, setUtr] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await eventsService.getEventBySlug(slug);
        setEvent(data);
      } catch (error) {
        toast.error('Event not found.');
        navigate('/events');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvent();
  }, [slug, navigate]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to enroll.');
      return navigate('/login');
    }

    if (!screenshotUrl || !utr) {
      return toast.error('Please provide both the UTR number and a payment screenshot.');
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Submitting verification request...');

    try {
      await paymentsService.submitPayment({
        eventId: event.id,
        amount: event.price,
        utr: utr,
        screenshotUrl: screenshotUrl,
      });

      toast.success('Payment submitted! Awaiting admin verification.', { id: loadingToast });
      navigate('/dashboard'); // Or navigate to their profile/enrollments page
    } catch (error) {
      toast.error(error.message || 'Payment submission failed.', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="flex h-[60vh] items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-500"></div></div>;
  if (!event) return null;

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Event Details */}
        <div className="lg:col-span-2 space-y-8">
          {event.thumbnail && (
            <img src={event.thumbnail} alt={event.title} className="w-full h-64 sm:h-96 object-cover rounded-2xl shadow-sm" />
          )}
          
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-medical-50 dark:bg-medical-900/20 text-medical-600 dark:text-medical-400 text-sm font-semibold rounded-full">
                {event.type}
              </span>
              {event.isFree ? (
                <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-sm font-semibold rounded-full">
                  Free Event
                </span>
              ) : (
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-full flex items-center">
                  <IndianRupee size={14} className="mr-1"/> {event.price}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-6">
              {event.title}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-start gap-3">
                <Calendar className="text-medical-500 mt-1" size={20}/>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Date & Time</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}<br/>
                    {new Date(event.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="text-medical-500 mt-1" size={20}/>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Venue</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{event.venue}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:col-span-2">
                <User className="text-medical-500 mt-1" size={20}/>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Speaker</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{event.speaker}</p>
                </div>
              </div>
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none whitespace-pre-wrap">
              <h3 className="text-xl font-bold mb-4">About this Event</h3>
              {event.description}
            </div>
          </div>
        </div>

        {/* Right Column: Ticketing & Payment Box */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl">
            
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Enroll Now</h3>
            
            {event.isFree ? (
              <div>
                <p className="text-slate-600 dark:text-slate-400 mb-6">Reserve your spot for free today.</p>
                <button 
                  onClick={() => toast.success('Free enrollment logic pending!')}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg shadow transition-all"
                >
                  Register for Free
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-xl flex items-start gap-3 text-sm">
                  <Info className="flex-shrink-0 mt-0.5" size={18} />
                  <p>Please scan the QR code to pay <strong>₹{event.price}</strong> using any UPI app, then submit your UTR number below.</p>
                </div>

                {/* QR Code Display */}
                <div className="border-2 border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center bg-white">
                  <img src={event.qrCodeUrl} alt="UPI QR Code" className="w-48 h-48 object-contain mb-4" />
                  <p className="font-mono text-sm font-semibold text-slate-800 bg-slate-100 px-3 py-1 rounded">
                    {event.upiId}
                  </p>
                </div>

                {/* Payment Form */}
                <form onSubmit={handlePaymentSubmit} className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">12-Digit UTR Number</label>
                    <input
                      required
                      type="text"
                      value={utr}
                      onChange={(e) => setUtr(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-medical-500 dark:text-white"
                      placeholder="e.g. 312345678901"
                    />
                  </div>

                  <div>
                    <ImageUploader 
                      label="Payment Screenshot" 
                      folder="payments" 
                      onUploadSuccess={(url) => setScreenshotUrl(url)} 
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !user}
                    className="w-full py-3 bg-medical-500 hover:bg-medical-600 text-white font-bold rounded-lg shadow-lg shadow-medical-500/30 transition-all disabled:opacity-70 mt-4"
                  >
                    {!user ? 'Login to Enroll' : isSubmitting ? 'Submitting...' : 'Submit Payment Info'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
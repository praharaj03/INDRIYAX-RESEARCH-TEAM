import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Video, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';
import { eventsService } from './eventsService';

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventsService.getAllEvents();
        setEvents(data);
      } catch (error) {
        toast.error('Failed to load upcoming events.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Upcoming Events
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">
          Join expert-led workshops and seminars to advance your medical career.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <div key={event.id} className="flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
            
            <div className="relative h-48 bg-slate-100 dark:bg-slate-800">
              {event.thumbnail ? (
                <img src={event.thumbnail} alt={event.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
              )}
              <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold shadow">
                {event.isFree ? (
                  <span className="text-emerald-600 dark:text-emerald-400">Free</span>
                ) : (
                  <span className="text-slate-900 dark:text-white flex items-center">
                    <IndianRupee size={14} className="mr-0.5"/> {event.price}
                  </span>
                )}
              </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
                {event.title}
              </h3>
              
              <div className="space-y-2 mb-6 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-medical-500" />
                  <span>{new Date(event.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  {event.type === 'ONLINE' ? <Video size={16} className="text-medical-500"/> : <MapPin size={16} className="text-medical-500"/>}
                  <span className="line-clamp-1">{event.venue}</span>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                <Link 
                  to={`/events/${event.slug}`} 
                  className="w-full block text-center py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-medical-500 hover:text-white dark:hover:bg-medical-500 text-slate-900 dark:text-white font-semibold rounded-lg transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
import apiClient from '../../api/client';

export const eventsService = {
  // NEW: Get all events
  getAllEvents: async () => {
    const response = await apiClient.get('/api/v1/events');
    return response.data;
  },

  // NEW: Get single event by slug
  getEventBySlug: async (slug) => {
    const response = await apiClient.get(`/api/v1/events/${slug}`);
    return response.data;
  },

  createEvent: async (eventData) => {
    const response = await apiClient.post('/api/v1/events', eventData);
    return response.data;
  },
  
  deleteEvent: async (id) => {
    const response = await apiClient.delete(`/api/v1/events/${id}`);
    return response.data;
  }
};
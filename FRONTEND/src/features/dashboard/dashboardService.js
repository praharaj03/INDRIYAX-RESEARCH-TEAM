import apiClient from '../../api/client';

export const dashboardService = {
  getOverallStats: async () => {
    const response = await apiClient.get('/api/v1/dashboard/overall');
    return response.data; 
  },

  // NEW: Get deep-dive stats for a specific event
  getEventAdminDetails: async (eventId) => {
    const response = await apiClient.get(`/api/v1/dashboard/events/${eventId}`);
    return response.data;
  }
};
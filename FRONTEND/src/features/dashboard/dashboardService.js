import apiClient from '../../api/client';

/**
 * Standard Response Envelope: { success, message?, data }.
 * unwrap() returns the inner `data` regardless of whether an axios
 * interceptor already peeled a layer.
 */
const unwrap = (res) => {
  if (res && res.data && typeof res.data === 'object' && 'success' in res.data) {
    return res.data.data;
  }
  if (res && typeof res === 'object' && 'success' in res && 'data' in res) {
    return res.data;
  }
  return res?.data ?? res;
};

export const dashboardService = {
  /**
   * Overall platform stats — GET /api/v1/dashboard/overall  (ADMIN)
   * Returns: { overview: {...}, engagementChart: [...] }
   * engagementChart is always exactly 6 entries, oldest -> newest.
   */
  getOverallStats: async () => {
    const response = await apiClient.get('/api/v1/dashboard/overall');
    return unwrap(response);
  },

  /**
   * Event-specific deep-dive — GET /api/v1/dashboard/events/:eventId  (ADMIN)
   * Returns: { eventInfo, stats, participants[], pendingRequests[] }
   */
  getEventAdminDetails: async (eventId) => {
    const response = await apiClient.get(`/api/v1/dashboard/events/${eventId}`);
    return unwrap(response);
  },
};
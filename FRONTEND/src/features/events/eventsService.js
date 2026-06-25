import apiClient from '../../api/client';

/**
 * Standard Response Envelope: { success, message?, data }.
 * `unwrap` returns the inner `data` payload regardless of whether an
 * axios interceptor has already peeled a layer.
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

export const eventsService = {
  /**
   * Get All Events — GET /api/v1/events
   * Public sees active only; admin sees all. Ordered by date ascending.
   */
  getAllEvents: async () => {
    const response = await apiClient.get('/api/v1/events');
    return unwrap(response);
  },

  /**
   * Get Event by Slug — GET /api/v1/events/:slug
   * Returns the FULL record incl. qrCodeUrl, upiId, upiNumber.
   */
  getEventBySlug: async (slug) => {
    const response = await apiClient.get(`/api/v1/events/${slug}`);
    return unwrap(response);
  },

  /**
   * Create Event — POST /api/v1/events  (ADMIN)
   */
  createEvent: async (eventData) => {
    const response = await apiClient.post('/api/v1/events', eventData);
    return unwrap(response);
  },

  /**
   * Update Event — PATCH /api/v1/events/:id  (ADMIN)
   */
  updateEvent: async (eventId, eventData) => {
    const response = await apiClient.patch(`/api/v1/events/${eventId}`, eventData);
    return unwrap(response);
  },

  /**
   * Delete Event — DELETE /api/v1/events/:id  (ADMIN)
   */
  deleteEvent: async (id) => {
    const response = await apiClient.delete(`/api/v1/events/${id}`);
    return unwrap(response);
  },
};
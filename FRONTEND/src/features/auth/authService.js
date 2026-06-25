import apiClient from '../../api/client';

/**
 * Every IndriyaX response follows the Standard Response Envelope:
 *   { success: true, message?: string, data: <payload> }
 *
 * `unwrap` safely returns the inner `data` payload whether or not an
 * axios interceptor has already peeled one layer:
 *   - raw axios response:        { data: { success, data: payload } }  -> payload
 *   - interceptor returns env:   { success, data: payload }            -> payload
 *   - interceptor returns data:  payload                               -> payload
 */
const unwrap = (res) => {
  // raw axios response object
  if (res && res.data && typeof res.data === 'object' && 'success' in res.data) {
    return res.data.data;
  }
  // already the envelope
  if (res && typeof res === 'object' && 'success' in res && 'data' in res) {
    return res.data;
  }
  // already unwrapped payload (or axios response without envelope)
  return res?.data ?? res;
};

export const authService = {
  /**
   * Get Current Profile
   * Route: GET /api/v1/auth/me
   * Returns: { id, email, fullName, imageUrl, role, createdAt }
   */
  getCurrentProfile: async () => {
    const response = await apiClient.get('/api/v1/auth/me');
    return unwrap(response);
  },

  /**
   * Update Profile
   * Route: PATCH /api/v1/auth/me
   * Body: { fullName?, imageUrl? } — at least one required.
   * Returns the full updated user object.
   */
  updateProfile: async (profileData) => {
    const response = await apiClient.patch('/api/v1/auth/me', profileData);
    return unwrap(response);
  },

  /**
   * Get User's Event Enrollments
   * Route: GET /api/v1/auth/my-enrollments
   * Returns: array of enrollments (newest first), each with nested `event`.
   * `event.meetingLink` is present ONLY when status === 'APPROVED'.
   */
  getMyEnrollments: async () => {
    const response = await apiClient.get('/api/v1/auth/my-enrollments');
    return unwrap(response);
  },
};
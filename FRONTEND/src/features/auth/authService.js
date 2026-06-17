import apiClient from '../../api/client';

export const authService = {
  /**
   * Get Current Profile
   * Route: GET /api/v1/auth/me
   */
  getCurrentProfile: async () => {
    const response = await apiClient.get('/api/v1/auth/me');
    return response.data; 
  },

  /**
   * Update Profile
   * Route: PATCH /api/v1/auth/me
   */
  updateProfile: async (profileData) => {
    const response = await apiClient.patch('/api/v1/auth/me', profileData);
    return response.data;
  },

  /**
   * Get User's Event Enrollments
   * Route: GET /api/v1/auth/my-enrollments
   */
  getMyEnrollments: async () => {
    const response = await apiClient.get('/api/v1/auth/my-enrollments');
    return response.data;
  }
};
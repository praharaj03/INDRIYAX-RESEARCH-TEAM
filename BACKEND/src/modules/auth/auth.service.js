import { authRepository } from './auth.repository.js';

export const authService = {
  updateProfile: async (userId, payload) => {
    // If you had business rules (e.g., "users can only change their name once every 30 days"), 
    // that logic would go here before calling the repository.
    return authRepository.updateUserById(userId, payload);
  },

  getMyEnrollments: async (userId) => {
    return authRepository.findEnrollmentsByUserId(userId);
  }
};
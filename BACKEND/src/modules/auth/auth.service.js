import { authRepository } from './auth.repository.js';

export const authService = {
  updateProfile: async (userId, payload) => {
    return authRepository.updateUserById(userId, payload);
  },

  getMyEnrollments: async (userId) => {
    return authRepository.findEnrollmentsByUserId(userId);
  }
};
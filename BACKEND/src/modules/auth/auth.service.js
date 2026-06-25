import { authRepository } from './auth.repository.js';
import { uploadService } from '../uploads/upload.service.js';

export const authService = {
  updateProfile: async (userId, payload) => {
    // We only need to think about cleanup when imageUrl is part of this update.
    const imageUrlIsChanging = payload.imageUrl !== undefined;

    // Capture the CURRENT photo BEFORE we overwrite it — otherwise we lose the
    // reference to the file that needs deleting.
    let previousImageUrl = null;
    if (imageUrlIsChanging) {
      const current = await authRepository.findUserImageUrl(userId);
      previousImageUrl = current?.imageUrl ?? null;
    }

    const updatedUser = await authRepository.updateUserById(userId, payload);

    // After a successful update, clean up the old file if it actually changed.
    // (Skip if the "new" url equals the old one — no-op replace.)
    if (
      imageUrlIsChanging &&
      previousImageUrl &&
      previousImageUrl !== updatedUser.imageUrl
    ) {
      // Fire-and-forget: do NOT await in a way that blocks the response, and
      // never let a cleanup failure surface to the user.
      uploadService.deleteImageByUrl(previousImageUrl).catch(() => {});
    }

    return updatedUser;
  },

  getMyEnrollments: async (userId) => {
    return authRepository.findEnrollmentsByUserId(userId);
  },
};
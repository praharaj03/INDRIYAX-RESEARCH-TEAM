import { getDb } from '../../config/prisma.config.js';

export const authRepository = {
  updateUserById: async (userId, data) => {
    const db = getDb(); return db.user.update({
      where: { id: userId },
      data: {
        fullName: data.fullName,
        imageUrl: data.imageUrl
      }
    });
  }
};
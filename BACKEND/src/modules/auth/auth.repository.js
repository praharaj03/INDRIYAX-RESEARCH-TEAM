import prisma from '../../config/prisma.config.js';

export const authRepository = {
  updateUserById: async (userId, data) => {
    return prisma.user.update({
      where: { id: userId },
      data: {
        fullName: data.fullName,
        imageUrl: data.imageUrl
      }
    });
  }
};
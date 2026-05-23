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
  },

  findEnrollmentsByUserId: async (userId) => {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        event: {
          select: {
            id: true,
            slug: true,
            title: true,
            thumbnail: true,
            date: true,
            venue: true,
            type: true,
            price: true,
            speaker: true,
            meetingLink: true,
          }
        }
      }
    });

    // Only expose meetingLink for APPROVED enrollments
    return enrollments.map((enrollment) => {
      const { meetingLink, ...eventWithoutLink } = enrollment.event;
      return {
        ...enrollment,
        event: enrollment.status === 'APPROVED'
          ? { ...eventWithoutLink, meetingLink }
          : eventWithoutLink,
      };
    });
  }
};
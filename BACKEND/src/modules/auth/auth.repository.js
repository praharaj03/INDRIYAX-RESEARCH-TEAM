import prisma from '../../config/prisma.config.js';

// Exactly the public profile contract from the /me docs.
const USER_PROFILE_SELECT = {
  id: true,
  email: true,
  fullName: true,
  imageUrl: true,
  role: true,
  createdAt: true,
};

export const authRepository = {
  updateUserById: async (userId, data) => {
    return prisma.user.update({
      where: { id: userId },
      data: {
        // undefined is ignored by Prisma — only provided fields change.
        fullName: data.fullName,
        imageUrl: data.imageUrl,
      },
      select: USER_PROFILE_SELECT,
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
          },
        },
      },
    });

    // Only expose meetingLink for APPROVED enrollments.
    return enrollments.map((enrollment) => {
      const { meetingLink, ...eventWithoutLink } = enrollment.event;
      return {
        ...enrollment,
        event:
          enrollment.status === 'APPROVED'
            ? { ...eventWithoutLink, meetingLink }
            : eventWithoutLink,
      };
    });
  },
};
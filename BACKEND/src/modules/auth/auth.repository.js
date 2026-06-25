import prisma from '../../config/prisma.config.js';

const USER_PROFILE_SELECT = {
  id: true,
  email: true,
  fullName: true,
  imageUrl: true,
  role: true,
  createdAt: true,
};

export const authRepository = {
  // Lean read used to capture the old photo before an update overwrites it.
  findUserImageUrl: async (userId) => {
    return prisma.user.findUnique({
      where: { id: userId },
      select: { imageUrl: true },
    });
  },

  updateUserById: async (userId, data) => {
    // Absent key = unchanged; explicit null = cleared. (See the remove-photo
    // feature: imageUrl absent vs imageUrl: null.)
    const updateData = {};
    if (data.fullName !== undefined) updateData.fullName = data.fullName;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;

    return prisma.user.update({
      where: { id: userId },
      data: updateData,
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
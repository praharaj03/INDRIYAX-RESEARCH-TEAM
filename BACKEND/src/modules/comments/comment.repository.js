import prisma from '../../config/prisma.config.js';

export const commentRepository = {
  create: async (data) => {
    return prisma.comment.create({ 
      data,
      include: {
        user: { select: { fullName: true, imageUrl: true } } // Return user data immediately upon creation
      }
    });
  },

  findByPostId: async (postId) => {
    return prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'desc' }, // Newest comments first
      include: {
        user: { select: { fullName: true, imageUrl: true } }
      }
    });
  },

  findById: async (id) => {
    return prisma.comment.findUnique({ where: { id } });
  },

  update: async (id, content) => {
    return prisma.comment.update({
      where: { id },
      data: { content },
      include: {
        user: { select: { fullName: true, imageUrl: true } }
      }
    });
  },

  delete: async (id) => {
    return prisma.comment.delete({
      where: { id }
    });
  }
};
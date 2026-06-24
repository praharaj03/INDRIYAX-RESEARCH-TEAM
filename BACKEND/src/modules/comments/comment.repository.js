import prisma from '../../config/prisma.config.js';

// Public-facing author fields embedded in a comment.
const COMMENT_USER_SELECT = { fullName: true, imageUrl: true };

// Shape returned to clients (matches the documented comment response).
const COMMENT_PUBLIC_SELECT = {
  id: true,
  content: true,
  createdAt: true,
  user: { select: COMMENT_USER_SELECT },
};

export const commentRepository = {
  create: async (data) => {
    return prisma.comment.create({
      data,
      select: COMMENT_PUBLIC_SELECT,
    });
  },

  findByPostId: async (postId) => {
    return prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'desc' },
      select: COMMENT_PUBLIC_SELECT,
    });
  },

  // Lean select — only what the ownership/moderation checks need.
  findById: async (id) => {
    return prisma.comment.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });
  },

  update: async (id, content) => {
    return prisma.comment.update({
      where: { id },
      data: { content },
      select: COMMENT_PUBLIC_SELECT,
    });
  },

  delete: async (id) => {
    return prisma.comment.delete({ where: { id } });
  },
};
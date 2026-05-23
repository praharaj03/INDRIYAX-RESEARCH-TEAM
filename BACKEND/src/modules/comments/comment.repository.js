import { getDb } from '../../config/prisma.config.js';

export const commentRepository = {
  create: async (data) => {
    const db = getDb(); return db.comment.create({ 
      data,
      include: {
        user: { select: { fullName: true, imageUrl: true } } // Return user data immediately upon creation
      }
    });
  },

  findByPostId: async (postId) => {
    const db = getDb(); return db.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'desc' }, // Newest comments first
      include: {
        user: { select: { fullName: true, imageUrl: true } }
      }
    });
  },

  findById: async (id) => {
    const db = getDb(); return db.comment.findUnique({ where: { id } });
  },

  update: async (id, content) => {
    const db = getDb(); return db.comment.update({
      where: { id },
      data: { content },
      include: {
        user: { select: { fullName: true, imageUrl: true } }
      }
    });
  },

  delete: async (id) => {
    const db = getDb(); return db.comment.delete({
      where: { id }
    });
  }
};
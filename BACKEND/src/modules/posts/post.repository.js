import { getDb } from '../../config/prisma.config.js';

export const postRepository = {
  create: async (data) => {
    const db = getDb(); return db.post.create({ data });
  },

  findAll: async (filters = {}) => {
    const db = getDb(); return db.post.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' }, // Newest posts first
      include: {
        author: { select: { fullName: true, imageUrl: true } }
      }
    });
  },

  findBySlug: async (slug) => {
    const db = getDb(); return db.post.findUnique({
      where: { slug },
      include: {
        author: { select: { fullName: true, imageUrl: true, role: true } }
      }
    });
  },

  findById: async (id) => {
    const db = getDb(); return db.post.findUnique({ where: { id } });
  },

  update: async (id, data) => {
    const db = getDb(); return db.post.update({
      where: { id },
      data
    });
  },

  delete: async (id) => {
    const db = getDb(); return db.post.delete({
      where: { id }
    });
  }
};
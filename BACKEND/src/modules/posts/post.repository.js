import prisma from '../../config/prisma.config.js';

export const postRepository = {
  create: async (data) => {
    return prisma.post.create({ data });
  },

  findAll: async (filters = {}) => {
    return prisma.post.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' }, // Newest posts first
      include: {
        author: { select: { fullName: true, imageUrl: true } }
      }
    });
  },

  findBySlug: async (slug) => {
    return prisma.post.findUnique({
      where: { slug },
      include: {
        author: { select: { fullName: true, imageUrl: true, role: true } }
      }
    });
  },

  findById: async (id) => {
    return prisma.post.findUnique({ where: { id } });
  },

  update: async (id, data) => {
    return prisma.post.update({
      where: { id },
      data
    });
  },

  delete: async (id) => {
    return prisma.post.delete({
      where: { id }
    });
  }
};
import { getDb } from '../../config/prisma.config.js';

export const eventRepository = {
  create: async (data) => {
    const prisma = getDb();
    return prisma.event.create({ data });
  },

  findAll: async (filters = {}) => {
    const prisma = getDb();
    return prisma.event.findMany({
      where: filters,
      orderBy: { date: 'asc' }
    });
  },

  findBySlug: async (slug) => {
    const prisma = getDb();
    return prisma.event.findUnique({
      where: { slug },
      include: {}
    });
  },

  findById: async (id) => {
    const prisma = getDb();
    return prisma.event.findUnique({ where: { id } });
  },

  update: async (id, data) => {
    const prisma = getDb();
    return prisma.event.update({
      where: { id },
      data
    });
  },

  delete: async (id) => {
    const prisma = getDb();
    return prisma.event.delete({
      where: { id }
    });
  }
};

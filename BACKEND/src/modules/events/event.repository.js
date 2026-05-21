import prisma from '../../config/prisma.config.js';

export const eventRepository = {
  create: async (data) => {
    return prisma.event.create({ data });
  },

  findAll: async (filters = {}) => {
    // Allows us to fetch all events, or just active ones
    return prisma.event.findMany({
      where: filters,
      orderBy: { date: 'asc' }
    });
  },

  findBySlug: async (slug) => {
    return prisma.event.findUnique({
      where: { slug },
      include: {
        // Optionally include basic enrollment counts or similar if needed later
      }
    });
  },

  findById: async (id) => {
    return prisma.event.findUnique({ where: { id } });
  },

  update: async (id, data) => {
    return prisma.event.update({
      where: { id },
      data
    });
  },

  delete: async (id) => {
    return prisma.event.delete({
      where: { id }
    });
  }
};
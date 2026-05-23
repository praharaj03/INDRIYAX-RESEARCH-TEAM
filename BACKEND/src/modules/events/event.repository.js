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
    // Delete in order to respect FK constraints:
    // payments reference event (Restrict), enrollments reference event (Cascade)
    return prisma.$transaction(async (tx) => {
      // 1. Delete payments for this event first (Restrict constraint)
      await tx.payment.deleteMany({ where: { eventId: id } });
      // 2. Enrollments cascade automatically, but delete explicitly to be safe
      await tx.enrollment.deleteMany({ where: { eventId: id } });
      // 3. Now delete the event
      return tx.event.delete({ where: { id } });
    });
  }
};
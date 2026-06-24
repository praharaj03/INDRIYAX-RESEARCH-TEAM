import prisma from '../../config/prisma.config.js';

// Fields safe to return on the PUBLIC list endpoint. Deliberately omits payment
// internals (upiId, upiNumber, qrCodeUrl) and meetingLink — those should not be
// broadcast in a bulk listing. Adjust to match your Event model + UI needs.
const EVENT_LIST_SELECT = {
  id: true,
  slug: true,
  title: true,
  description: true,
  speaker: true,
  thumbnail: true,
  venue: true,
  type: true,
  date: true,
  isActive: true,
  isFree: true,
  price: true,
  createdAt: true,
};

export const eventRepository = {
  create: async (data) => {
    return prisma.event.create({ data });
  },

  findAll: async (filters = {}) => {
    return prisma.event.findMany({
      where: filters,
      orderBy: { date: 'asc' },
      select: EVENT_LIST_SELECT,
    });
  },

  // Single-event view returns the full record (controller/route already gates
  // who can act on it; payment fields like qrCodeUrl/upiId are needed here so a
  // user can actually pay). If you want to hide UPI details until enrollment,
  // tell me and I'll split this like the enrollment/meetingLink logic.
  findBySlug: async (slug) => {
    return prisma.event.findUnique({
      where: { slug },
    });
  },

  findById: async (id) => {
    return prisma.event.findUnique({ where: { id } });
  },

  update: async (id, data) => {
    return prisma.event.update({
      where: { id },
      data,
    });
  },

  delete: async (id) => {
    return prisma.event.delete({
      where: { id },
    });
  },
};
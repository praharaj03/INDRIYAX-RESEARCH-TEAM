import prisma from '../../config/prisma.config.js';

export const dashboardRepository = {
  // 1. High-level totals. All SUCCESS/APPROVED-scoped, run concurrently.
  getTotals: async () => {
    const [totalUsers, totalEvents, totalEnrollments, earningsAgg] =
      await Promise.all([
        prisma.user.count(),
        prisma.event.count(),
        prisma.enrollment.count({ where: { status: 'APPROVED' } }),
        prisma.payment.aggregate({
          _sum: { amount: true },
          where: { status: 'SUCCESS' },
        }),
      ]);

    return {
      users: totalUsers,
      events: totalEvents,
      enrollments: totalEnrollments,
      earnings: earningsAgg._sum.amount || 0,
    };
  },

  // 2. Raw rows for monthly engagement — APPROVED enrollments in the window.
  // No raw SQL: Prisma honors schema mapping and there is zero injection
  // surface. We pull the createdAt timestamps and bucket them in JS (see the
  // service), which lets us zero-fill months with no enrollments so the chart
  // has no gaps.
  getApprovedEnrollmentsSince: async (sinceDate) => {
    return prisma.enrollment.findMany({
      where: {
        status: 'APPROVED',
        createdAt: { gte: sinceDate },
      },
      select: { createdAt: true },
    });
  },

  // 3. Single-event info + revenue + status breakdown.
  getEventDetailsWithStats: async (eventId) => {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        title: true,
        isFree: true,
        price: true,
        date: true,
        isActive: true,
      },
    });

    if (!event) return null;

    const [earningsAgg, statusCounts] = await Promise.all([
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { eventId, status: 'SUCCESS' },
      }),
      prisma.enrollment.groupBy({
        by: ['status'],
        where: { eventId },
        _count: { id: true },
      }),
    ]);

    return { event, earningsAgg, statusCounts };
  },

  // 4. Approved participants for an event.
  getEventParticipants: async (eventId) => {
    return prisma.enrollment.findMany({
      where: { eventId, status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, fullName: true, email: true, imageUrl: true } },
      },
    });
  },

  // 5. Pending payments awaiting review for an event, oldest first.
  getPendingPaymentsForEvent: async (eventId) => {
    return prisma.payment.findMany({
      where: { eventId, status: 'PENDING' },
      orderBy: { createdAt: 'asc' },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
      },
    });
  },
};
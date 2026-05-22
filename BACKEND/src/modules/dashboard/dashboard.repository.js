import prisma from '../../config/prisma.config.js';

export const dashboardRepository = {
  // 1. Get high-level totals
  getTotals: async () => {
    const [totalUsers, totalEvents, totalEnrollments, earningsAgg] = await Promise.all([
      prisma.user.count(),
      prisma.event.count(),
      prisma.enrollment.count({ where: { status: 'APPROVED' } }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'SUCCESS' }
      })
    ]);

    return {
      users: totalUsers,
      events: totalEvents,
      enrollments: totalEnrollments,
      earnings: earningsAgg._sum.amount || 0
    };
  },

  // 2. Get Month-wise engagement (Last 6 months using PostgreSQL raw query for speed)
  getMonthlyEngagement: async () => {
    // PostgreSQL specific query to group enrollments by month
    return prisma.$queryRaw`
      SELECT 
        TO_CHAR("createdAt", 'Mon YYYY') as month,
        CAST(COUNT(id) AS INTEGER) as count
      FROM "Enrollment"
      WHERE "status" = 'APPROVED' 
        AND "createdAt" >= NOW() - INTERVAL '6 months'
      GROUP BY TO_CHAR("createdAt", 'Mon YYYY'), DATE_TRUNC('month', "createdAt")
      ORDER BY DATE_TRUNC('month', "createdAt") ASC;
    `;
  },

  // 3. Get Specific Event Stats
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
      }
    });

    if (!event) return null;

    const [earningsAgg, statusCounts] = await Promise.all([
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { eventId, status: 'SUCCESS' }
      }),
      prisma.enrollment.groupBy({
        by: ['status'],
        where: { eventId },
        _count: { id: true }
      })
    ]);

    return { event, earningsAgg, statusCounts };
  },

  // 4. Get Participants for an Event
  getEventParticipants: async (eventId) => {
    return prisma.enrollment.findMany({
      where: { eventId, status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, fullName: true, email: true, imageUrl: true }
        }
      }
    });
  }
};
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
  },

  // 5. Get Analytics Data
  getAnalytics: async () => {
    const now = new Date();
    
    const [
      upcomingEvents,
      pastEvents,
      totalPosts,
      totalUsers,
      uniqueSpeakers,
      enrollmentsByEvent,
      recentEnrollments
    ] = await Promise.all([
      // Upcoming events count
      prisma.event.count({
        where: { date: { gte: now }, isActive: true }
      }),
      
      // Past events count
      prisma.event.count({
        where: { date: { lt: now } }
      }),
      
      // Total posts/news count
      prisma.post.count(),
      
      // Total users
      prisma.user.count(),
      
      // Unique speakers (distinct)
      prisma.event.findMany({
        select: { speaker: true },
        distinct: ['speaker']
      }),
      
      // Enrollments grouped by event
      prisma.enrollment.groupBy({
        by: ['eventId', 'status'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } }
      }),
      
      // Recent enrollments with user and event details
      prisma.enrollment.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, fullName: true, email: true, imageUrl: true }
          },
          event: {
            select: { id: true, title: true, date: true, price: true }
          }
        }
      })
    ]);

    // Get event details for enrollment breakdown
    const eventIds = [...new Set(enrollmentsByEvent.map(e => e.eventId))];
    const events = await prisma.event.findMany({
      where: { id: { in: eventIds } },
      select: { id: true, title: true, date: true, price: true }
    });

    // Format enrollments by event
    const eventEnrollments = events.map(event => {
      const enrollments = enrollmentsByEvent.filter(e => e.eventId === event.id);
      const approved = enrollments.find(e => e.status === 'APPROVED')?._count.id || 0;
      const pending = enrollments.find(e => e.status === 'PENDING')?._count.id || 0;
      const rejected = enrollments.find(e => e.status === 'REJECTED')?._count.id || 0;
      
      return {
        event,
        approved,
        pending,
        rejected,
        total: approved + pending + rejected
      };
    }).sort((a, b) => b.total - a.total);

    return {
      metrics: {
        upcomingEvents,
        pastEvents,
        totalPosts,
        totalUsers,
        uniqueSpeakers: uniqueSpeakers.length
      },
      eventEnrollments,
      recentEnrollments
    };
  }
};
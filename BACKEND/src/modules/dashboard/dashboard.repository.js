import { getDb } from '../../config/prisma.config.js';

export const dashboardRepository = {
  // 1. Get high-level totals
  getTotals: async () => {
    const db = getDb();
    const [totalUsers, totalEvents, totalEnrollments, totalEarnings] = await Promise.all([
      db.user.findMany({}).then(r => r.length),
      db.event.findMany({}).then(r => r.length),
      db.enrollment.findMany({ where: { status: 'APPROVED' } }).then(r => r.length),
      db.payment.findMany({ where: { status: 'SUCCESS' } }).then(payments => 
        payments.reduce((sum, p) => sum + (p.amount || 0), 0)
      ),
    ]);

    return {
      users: totalUsers,
      events: totalEvents,
      enrollments: totalEnrollments,
      earnings: totalEarnings
    };
  },

  // 2. Get Month-wise engagement (simplified for Supabase REST compatibility)
  getMonthlyEngagement: async () => {
    const db = getDb();
    try {
      const enrollments = await db.enrollment.findMany({
        where: { status: 'APPROVED' }
      });
      
      // Group by month manually
      const monthMap = {};
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      enrollments.forEach(e => {
        const date = new Date(e.createdAt);
        if (date >= sixMonthsAgo) {
          const key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          monthMap[key] = (monthMap[key] || 0) + 1;
        }
      });
      
      return Object.entries(monthMap).map(([month, count]) => ({ month, count }));
    } catch {
      return [];
    }
  },

  // 3. Get Specific Event Stats
  getEventDetailsWithStats: async (eventId) => {
    const db = getDb();
    const event = await db.event.findUnique({
      where: { id: eventId }
    });

    if (!event) return null;

    const payments = await db.payment.findMany({ where: { eventId, status: 'SUCCESS' } });
    const enrollments = await db.enrollment.findMany({ where: { eventId } });

    const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const statusCounts = [
      { status: 'APPROVED', _count: { id: enrollments.filter(e => e.status === 'APPROVED').length } },
      { status: 'PENDING', _count: { id: enrollments.filter(e => e.status === 'PENDING').length } },
      { status: 'REJECTED', _count: { id: enrollments.filter(e => e.status === 'REJECTED').length } },
    ];

    return { 
      event: { id: event.id, title: event.title, price: event.price, date: event.date, isActive: event.isActive },
      earningsAgg: { _sum: { amount: totalRevenue } }, 
      statusCounts 
    };
  },

  // 4. Get Participants for an Event
  getEventParticipants: async (eventId) => {
    const db = getDb();
    return db.enrollment.findMany({
      where: { eventId, status: 'APPROVED' },
      include: {
        user: true
      }
    });
  },

  // 5. Get Analytics Data
  getAnalytics: async () => {
    const db = getDb();
    const now = new Date();
    
    const [allEvents, allPosts, allUsers, allEnrollments] = await Promise.all([
      db.event.findMany({}),
      db.post.findMany({}),
      db.user.findMany({}),
      db.enrollment.findMany({}),
    ]);

    const upcomingEvents = allEvents.filter(e => new Date(e.date) >= now && e.isActive).length;
    const pastEvents = allEvents.filter(e => new Date(e.date) < now).length;
    const totalPosts = allPosts.length;
    const totalUsers = allUsers.length;
    
    // Unique speakers
    const speakers = new Set(allEvents.map(e => e.speaker));
    const uniqueSpeakers = speakers.size;

    // Enrollments grouped by event
    const enrollmentMap = {};
    allEnrollments.forEach(e => {
      if (!enrollmentMap[e.eventId]) {
        enrollmentMap[e.eventId] = { APPROVED: 0, PENDING: 0, REJECTED: 0 };
      }
      enrollmentMap[e.eventId][e.status] = (enrollmentMap[e.eventId][e.status] || 0) + 1;
    });

    // Format enrollments by event
    const eventEnrollments = Object.entries(enrollmentMap).map(([eventId, counts]) => {
      const event = allEvents.find(e => e.id === eventId);
      if (!event) return null;
      return {
        event: { id: event.id, title: event.title, date: event.date, price: event.price },
        approved: counts.APPROVED || 0,
        pending: counts.PENDING || 0,
        rejected: counts.REJECTED || 0,
        total: (counts.APPROVED || 0) + (counts.PENDING || 0) + (counts.REJECTED || 0),
      };
    }).filter(Boolean).sort((a, b) => b.total - a.total);

    return {
      metrics: {
        upcomingEvents,
        pastEvents,
        totalPosts,
        totalUsers,
        uniqueSpeakers
      },
      eventEnrollments
    };
  }
};

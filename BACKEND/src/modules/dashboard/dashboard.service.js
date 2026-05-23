import { dashboardRepository } from './dashboard.repository.js';
import { NotFoundException } from '../../shared/exceptions/index.js';

export const dashboardService = {
  getOverallStats: async () => {
    const totals = await dashboardRepository.getTotals();
    const monthlyData = await dashboardRepository.getMonthlyEngagement();

    return {
      overview: {
        totalEarnings: totals.earnings,
        totalEventsConducted: totals.events,
        totalUsers: totals.users,
        totalSuccessfulEnrollments: totals.enrollments
      },
      // Formatted perfectly for a frontend line/bar chart
      engagementChart: monthlyData.map(item => ({
        month: item.month,
        enrollments: item.count
      }))
    };
  },

  getAnalytics: async () => {
    return await dashboardRepository.getAnalytics();
  },

  getEventSpecificStats: async (eventId) => {
    const data = await dashboardRepository.getEventDetailsWithStats(eventId);
    if (!data) {
      throw new NotFoundException('Event not found');
    }

    const participants = await dashboardRepository.getEventParticipants(eventId);

    // Format the group by data into a clean object
    const enrollmentsByStatus = { APPROVED: 0, PENDING: 0, REJECTED: 0 };
    data.statusCounts.forEach(item => {
      enrollmentsByStatus[item.status] = item._count.id;
    });

    return {
      eventInfo: data.event,
      stats: {
        totalRevenue: data.earningsAgg._sum.amount || 0,
        approvedParticipants: enrollmentsByStatus.APPROVED,
        pendingVerifications: enrollmentsByStatus.PENDING,
        rejectedRequests: enrollmentsByStatus.REJECTED
      },
      participants: participants.map(p => ({
        enrollmentId: p.id,
        enrolledAt: p.createdAt,
        user: p.user
      }))
    };
  }
};
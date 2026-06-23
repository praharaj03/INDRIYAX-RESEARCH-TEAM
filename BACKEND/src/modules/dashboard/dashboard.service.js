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

  getEventSpecificStats: async (eventId) => {
    const data = await dashboardRepository.getEventDetailsWithStats(eventId);
    if (!data) {
      throw new NotFoundException('Event not found');
    }

    // Fetch BOTH Approved Participants AND Pending Payments concurrently
    const [participants, pendingPayments] = await Promise.all([
      dashboardRepository.getEventParticipants(eventId),
      dashboardRepository.getPendingPaymentsForEvent(eventId) // <-- The new repo call
    ]);

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
      })),
      // NEW: Map the pending payments to perfectly match the frontend table variables
      pendingRequests: pendingPayments.map(payment => ({
        paymentId: payment.id,
        utr: payment.utr,
        screenshotUrl: payment.screenshotUrl,
        user: payment.user
      }))
    };
  }
};
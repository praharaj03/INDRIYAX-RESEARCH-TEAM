import { dashboardRepository } from './dashboard.repository.js';
import { NotFoundException } from '../../shared/exceptions/index.js';

// Build a continuous list of the last `months` calendar months (oldest→newest),
// each initialized to 0, then fill in actual counts. Guarantees no gaps and a
// stable chronological order regardless of which months had activity.
const buildMonthlyEngagement = (rows, months = 6) => {
  const now = new Date();
  const buckets = [];
  const indexByKey = new Map();

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const label = d.toLocaleString('en-US', { month: 'short', year: 'numeric' }); // "Jan 2026"
    indexByKey.set(key, buckets.length);
    buckets.push({ month: label, enrollments: 0 });
  }

  for (const row of rows) {
    const d = new Date(row.createdAt);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const idx = indexByKey.get(key);
    if (idx !== undefined) buckets[idx].enrollments += 1;
  }

  return buckets;
};

export const dashboardService = {
  getOverallStats: async () => {
    const now = new Date();
    const since = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [totals, rows] = await Promise.all([
      dashboardRepository.getTotals(),
      dashboardRepository.getApprovedEnrollmentsSince(since),
    ]);

    return {
      overview: {
        totalEarnings: totals.earnings,
        totalEventsConducted: totals.events,
        totalUsers: totals.users,
        totalSuccessfulEnrollments: totals.enrollments,
      },
      engagementChart: buildMonthlyEngagement(rows, 6),
    };
  },

  getEventSpecificStats: async (eventId) => {
    const data = await dashboardRepository.getEventDetailsWithStats(eventId);
    if (!data) {
      throw new NotFoundException('Event not found');
    }

    const [participants, pendingPayments] = await Promise.all([
      dashboardRepository.getEventParticipants(eventId),
      dashboardRepository.getPendingPaymentsForEvent(eventId),
    ]);

    const enrollmentsByStatus = { APPROVED: 0, PENDING: 0, REJECTED: 0 };
    for (const item of data.statusCounts) {
      enrollmentsByStatus[item.status] = item._count.id;
    }

    return {
      eventInfo: data.event,
      stats: {
        totalRevenue: data.earningsAgg._sum.amount || 0,
        approvedParticipants: enrollmentsByStatus.APPROVED,
        pendingVerifications: enrollmentsByStatus.PENDING,
        rejectedRequests: enrollmentsByStatus.REJECTED,
      },
      participants: participants.map((p) => ({
        enrollmentId: p.id,
        // Approval time: the last status change to APPROVED. `updatedAt` equals
        // the approval moment as long as approved enrollments aren't mutated
        // again afterward (true today). If post-approval edits are ever added,
        // introduce a dedicated `approvedAt` column instead.
        enrolledAt: p.updatedAt,
        user: p.user,
      })),
      pendingRequests: pendingPayments.map((payment) => ({
        paymentId: payment.id,
        utr: payment.utr,
        screenshotUrl: payment.screenshotUrl,
        amount: payment.amount,
        submittedAt: payment.createdAt,
        user: payment.user,
      })),
    };
  },
};
import { catchAsync } from '../../shared/utils/catchAsync.js';
import { BadRequestException } from '../../shared/exceptions/index.js';
import { dashboardService } from './dashboard.service.js';

/**
 * @desc    Get overall platform statistics for admin dashboard
 * @route   GET /api/v1/dashboard/overall
 * @access  Private (Admin only)
 */
export const getOverallDashboard = catchAsync(async (req, res, next) => {
  const stats = await dashboardService.getOverallStats();
  res.status(200).json({
    success: true,
    data: stats,
  });
});

/**
 * @desc    Get detailed statistics and participants for a specific event
 * @route   GET /api/v1/dashboard/events/:eventId
 * @access  Private (Admin only)
 */
export const getEventDashboard = catchAsync(async (req, res, next) => {
  const { eventId } = req.params;

  // Guard the id format before querying. CUIDs start with 'c' and are ~25 chars;
  // a quick shape check turns a malformed id into a clean 400 instead of a
  // Prisma error. (Other modules do this via a Zod params schema.)
  if (typeof eventId !== 'string' || !/^c[a-z0-9]{20,}$/i.test(eventId)) {
    throw new BadRequestException('Invalid event ID format.');
  }

  const eventStats = await dashboardService.getEventSpecificStats(eventId);
  res.status(200).json({
    success: true,
    data: eventStats,
  });
});
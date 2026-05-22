import { catchAsync } from '../../shared/utils/catchAsync.js';
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
    data: stats
  });
});

/**
 * @desc    Get detailed statistics and participants for a specific event
 * @route   GET /api/v1/dashboard/events/:eventId
 * @access  Private (Admin only)
 */
export const getEventDashboard = catchAsync(async (req, res, next) => {
  const eventStats = await dashboardService.getEventSpecificStats(req.params.eventId);
  
  res.status(200).json({
    success: true,
    data: eventStats
  });
});
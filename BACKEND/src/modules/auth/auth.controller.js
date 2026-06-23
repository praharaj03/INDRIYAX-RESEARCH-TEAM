import { catchAsync } from '../../shared/utils/catchAsync.js';
import { authService } from './auth.service.js';

/**
 * @desc    Get current logged in user profile
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
export const getMe = catchAsync(async (req, res, next) => {
  // Read-only from the request object populated by auth middleware
  res.status(200).json({
    success: true,
    data: req.user
  });
});

/**
 * @desc    Update current logged in user profile
 * @route   PATCH /api/v1/auth/me
 * @access  Private
 */
export const updateMe = catchAsync(async (req, res, next) => {
  // Delegate to service
  const updatedUser = await authService.updateProfile(req.user.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: updatedUser
  });
});

/**
 * @desc    Get current user's event enrollments
 * @route   GET /api/v1/auth/my-enrollments
 * @access  Private
 */
export const getMyEnrollments = catchAsync(async (req, res, next) => {
  const enrollments = await authService.getMyEnrollments(req.user.id);
  
  res.status(200).json({
    success: true,
    data: enrollments
  });
});
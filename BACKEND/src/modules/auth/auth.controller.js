import { catchAsync } from '../../shared/utils/catchAsync.js';
import { authService } from './auth.service.js';

export const getMe = catchAsync(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: req.user
  });
});

export const getMyEnrollments = catchAsync(async (req, res, next) => {
  const enrollments = await authService.getMyEnrollments(req.user.id);
  res.status(200).json({
    success: true,
    data: enrollments
  });
});

export const updateMe = catchAsync(async (req, res, next) => {
  const updatedUser = await authService.updateProfile(req.user.id, req.body);
  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: updatedUser
  });
});
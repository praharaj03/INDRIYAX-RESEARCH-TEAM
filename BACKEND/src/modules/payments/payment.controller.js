import { catchAsync } from '../../shared/utils/catchAsync.js';
import { paymentService } from './payment.service.js';

/**
 * @desc    Get all payments (admin only)
 * @route   GET /api/v1/payments
 * @access  Private (Admins only)
 */
export const getAllPayments = catchAsync(async (req, res, next) => {
  const payments = await paymentService.getAllPayments();

  res.status(200).json({
    success: true,
    data: payments
  });
});

/**
 * @desc    Submit manual payment & enroll in event
 * @route   POST /api/v1/payments
 * @access  Private (Logged in users only)
 */
export const createPayment = catchAsync(async (req, res, next) => {
  const result = await paymentService.processNewPayment(req.user.id, req.body);

  res.status(201).json({
    success: true,
    message: 'Payment submitted successfully. Your enrollment is pending admin verification.',
    data: result
  });
});

/**
 * @desc    Admin reviews and updates a pending payment
 * @route   PATCH /api/v1/payments/:id/review
 * @access  Private (Admins only)
 */
export const reviewPayment = catchAsync(async (req, res, next) => {
  const result = await paymentService.reviewPendingPayment(
    req.params.id, 
    req.user.id, 
    req.body
  );

  res.status(200).json({
    success: true,
    message: `Payment has been marked as ${req.body.status}. Enrollment is now ${result.enrollment.status}.`,
    data: result
  });
});
import { Router } from 'express';
import { createPayment, reviewPayment, getAllPayments } from './payment.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createPaymentSchema, reviewPaymentSchema } from './payment.validator.js';
import { protect, restrictTo } from '../../middlewares/auth.middleware.js';

const router = Router();

// POST /api/v1/payments (Users submitting payments)
router.post(
  '/', 
  protect, 
  validate(createPaymentSchema), 
  createPayment
);

// GET /api/v1/payments (Admins viewing all payments)
router.get(
  '/',
  protect,
  restrictTo('ADMIN'),
  getAllPayments
);

// PATCH /api/v1/payments/:id/review (Admins verifying payments)
router.patch(
  '/:id/review',
  protect,
  restrictTo('ADMIN'),
  validate(reviewPaymentSchema),
  reviewPayment
);

export default router;
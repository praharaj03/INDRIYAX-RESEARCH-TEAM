import { Router } from 'express';
import { createPayment, reviewPayment } from './payment.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createPaymentSchema, reviewPaymentSchema } from './payment.validator.js';
import { protect, restrictTo } from '../../middlewares/auth.middleware.js';

const router = Router();

// POST /api/v1/payments (Users submitting payments)
// 1. Protect: User must be logged in
// 2. Validate: Request body must match our Zod schema
// 3. Controller: Executes the business logic
router.post(
  '/', 
  protect, 
  validate(createPaymentSchema), 
  createPayment
);

// PATCH /api/v1/payments/:id/review (Admins verifying payments)
router.patch(
  '/:id/review',
  protect,
  restrictTo('ADMIN'), // MUST be an admin
  validate(reviewPaymentSchema),
  reviewPayment
);

export default router;
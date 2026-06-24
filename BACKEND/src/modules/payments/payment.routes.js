import { Router } from 'express';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import { createPayment, reviewPayment } from './payment.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createPaymentSchema, reviewPaymentSchema } from './payment.validator.js';
import { protect, restrictTo } from '../../middlewares/auth.middleware.js';

const router = Router();

// Tight limiter on payment submission — this endpoint creates financial records,
// so it should not be callable in a hot loop. Keyed per-user, falling back to a
// normalized IP for anything unauthenticated.
// 429 comes back in the standard envelope so the frontend can show a clear msg.
const submitPaymentLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10, // 10 submissions/min/user is generous for a human paying once.
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  // express-rate-limit v8: a custom keyGenerator that uses the IP MUST pass it
  // through ipKeyGenerator() so IPv6 addresses are reduced to their subnet
  // (otherwise an IPv6 user could rotate addresses to bypass the limit).
  keyGenerator: (req) => req.user?.id || ipKeyGenerator(req.ip),
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      status: 'fail',
      message: 'Too many payment attempts. Please wait a moment and try again.',
    });
  },
});

// POST /api/v1/payments (Users submitting payments)
router.post(
  '/',
  protect,
  submitPaymentLimiter,
  validate(createPaymentSchema),
  createPayment
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
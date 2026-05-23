import { Router } from 'express';
import { getMe, updateMe, getMyEnrollments } from './auth.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { updateProfileSchema } from './auth.validator.js';

const router = Router();

// GET /api/v1/auth/me (Fetch profile)
router.get('/me', protect, getMe);

// GET /api/v1/auth/my-enrollments (Fetch user's event enrollments)
router.get('/my-enrollments', protect, getMyEnrollments);

// PATCH /api/v1/auth/me (Update profile)
router.patch('/me', protect, validate(updateProfileSchema), updateMe);

export default router;
import { Router } from 'express';
import { getMe, updateMe } from './auth.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { updateProfileSchema } from './auth.validator.js';

const router = Router();

// GET /api/v1/auth/me (Fetch profile)
router.get('/me', protect, getMe);

// PATCH /api/v1/auth/me (Update profile)
router.patch('/me', protect, validate(updateProfileSchema), updateMe);

export default router;
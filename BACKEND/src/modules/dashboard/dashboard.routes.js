import { Router } from 'express';
import { getOverallDashboard, getEventDashboard } from './dashboard.controller.js';
import { protect, restrictTo } from '../../middlewares/auth.middleware.js';

const router = Router();

// ADMIN DASHBOARD ROUTES

router.use(protect, restrictTo('ADMIN'));

// GET /api/v1/dashboard/overall
router.get('/overall', getOverallDashboard);

// GET /api/v1/dashboard/events/:eventId
router.get('/events/:eventId', getEventDashboard);

export default router;
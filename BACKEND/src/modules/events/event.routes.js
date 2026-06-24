import { Router } from 'express';
import {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
} from './event.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createEventSchema, updateEventSchema } from './event.validator.js';
import { protect, restrictTo } from '../../middlewares/auth.middleware.js';
import { softAuth } from '../../middlewares/softAuth.middleware.js';

const router = Router();

// PUBLIC ROUTES
// softAuth = optional auth: attaches req.user IF a valid token is present, but
// never blocks. Lets admins see inactive events here while anonymous users still
// get the public (active-only) list.

// GET /api/v1/events (Public list; admins additionally see inactive events)
router.get('/', softAuth, getEvents);

// GET /api/v1/events/:slug (Public - single event by slug)
router.get('/:slug', getEvent);

// ADMIN ROUTES
// protect + restrictTo('ADMIN') apply to everything below.
router.use(protect, restrictTo('ADMIN'));

// POST /api/v1/events (Create)
router.post('/', validate(createEventSchema), createEvent);

// PATCH /api/v1/events/:id (Update)
router.patch('/:id', validate(updateEventSchema), updateEvent);

// DELETE /api/v1/events/:id (Delete)
router.delete('/:id', deleteEvent);

export default router;
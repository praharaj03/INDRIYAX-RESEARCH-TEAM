import { Router } from 'express';
import { 
  createEvent, 
  getEvents, 
  getEvent,
  getEventById,
  updateEvent, 
  deleteEvent 
} from './event.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createEventSchema, updateEventSchema } from './event.validator.js';
import { protect, restrictTo } from '../../middlewares/auth.middleware.js';

const router = Router();

// Optional auth middleware — attaches req.user if a valid token is present,
// but does NOT reject unauthenticated requests.
const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return next();
  // Delegate to protect but swallow auth errors so public access still works
  protect(req, res, (err) => {
    if (err) return next(); // ignore auth errors, continue as anonymous
    next();
  });
};

// PUBLIC ROUTES

// GET /api/v1/events (Public - Lists active events; Admins see all events)
router.get('/', optionalAuth, getEvents);

// GET /api/v1/events/:slug (Public - Get a single event by its slug)
// Uses optionalAuth so meetingLink can be conditionally included for APPROVED enrollees
router.get('/:slug', optionalAuth, getEvent);


// ADMIN ROUTES

// Apply protect and restrictTo('ADMIN') to all routes below this line
router.use(protect, restrictTo('ADMIN'));

// GET /api/v1/events/id/:id (Admins only - Get event by ID for edit page)
router.get('/id/:id', getEventById);

// POST /api/v1/events (Admins only - Create a new event)
router.post('/', validate(createEventSchema), createEvent);

// PATCH /api/v1/events/:id (Admins only - Update an existing event)
router.patch('/:id', validate(updateEventSchema), updateEvent);

// DELETE /api/v1/events/:id (Admins only - Delete an event)
router.delete('/:id', deleteEvent);

export default router;

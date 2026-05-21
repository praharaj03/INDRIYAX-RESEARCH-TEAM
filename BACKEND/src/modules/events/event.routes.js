import { Router } from 'express';
import { 
  createEvent, 
  getEvents, 
  getEvent, 
  updateEvent, 
  deleteEvent 
} from './event.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createEventSchema, updateEventSchema } from './event.validator.js';
import { protect, restrictTo } from '../../middlewares/auth.middleware.js';

const router = Router();

// PUBLIC ROUTES

// GET /api/v1/events (Public - Lists active events; Admins see all events)
router.get('/', getEvents);

// GET /api/v1/events/:slug (Public - Get a single event by its slug)
router.get('/:slug', getEvent);


// ADMIN ROUTES

// Apply protect and restrictTo('ADMIN') to all routes below this line
router.use(protect, restrictTo('ADMIN'));

// POST /api/v1/events (Admins only - Create a new event)
router.post('/', validate(createEventSchema), createEvent);

// PATCH /api/v1/events/:id (Admins only - Update an existing event)
router.patch('/:id', validate(updateEventSchema), updateEvent);

// DELETE /api/v1/events/:id (Admins only - Delete an event)
router.delete('/:id', deleteEvent);

export default router;
import { catchAsync } from '../../shared/utils/catchAsync.js';
import { eventService } from './event.service.js';
import prisma from '../../config/prisma.config.js';

/**
 * @desc    Create a new event
 * @route   POST /api/v1/events
 * @access  Private (Admin only)
 */
export const createEvent = catchAsync(async (req, res, next) => {
  console.log('📥 CREATE EVENT - Request Body:', JSON.stringify(req.body, null, 2));
  console.log('📥 CREATE EVENT - User:', req.user?.email || 'No user');
  
  const event = await eventService.createEvent(req.body);
  
  console.log('✅ CREATE EVENT - Event Created:', event.id, event.title);
  
  res.status(201).json({
    success: true,
    message: 'Event created successfully',
    data: event
  });
});

/**
 * @desc    Get all events (Admins see all, public sees active only)
 * @route   GET /api/v1/events
 * @access  Public
 */
export const getEvents = catchAsync(async (req, res, next) => {
  // Check if user is logged in and is an admin
  const isAdmin = req.user && req.user.role === 'ADMIN';
  const events = await eventService.getAllEvents(isAdmin);

  // Strip meetingLink from all events in the list view — it's only revealed
  // on the detail page to users with an APPROVED enrollment.
  const sanitized = isAdmin
    ? events
    : events.map(({ meetingLink, ...rest }) => rest);
  
  res.status(200).json({
    success: true,
    data: sanitized
  });
});

/**
 * @desc    Get a single event by slug
 * @route   GET /api/v1/events/:slug
 * @access  Public — meetingLink only returned to APPROVED enrollees
 */
export const getEvent = catchAsync(async (req, res, next) => {
  const event = await eventService.getEventBySlug(req.params.slug);

  // Admins always get the full event including meetingLink
  if (req.user && req.user.role === 'ADMIN') {
    return res.status(200).json({ success: true, data: event });
  }

  // Check if the requesting user has an APPROVED enrollment for this event
  let hasApprovedEnrollment = false;
  if (req.user) {
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_eventId: { userId: req.user.id, eventId: event.id } }
    });
    hasApprovedEnrollment = enrollment?.status === 'APPROVED';
  }

  // Strip meetingLink if the user is not an approved enrollee
  const { meetingLink, ...publicEvent } = event;
  const data = hasApprovedEnrollment ? event : publicEvent;

  res.status(200).json({ success: true, data });
});

/**
 * @desc    Get a single event by ID (admin use)
 * @route   GET /api/v1/events/id/:id
 * @access  Private (Admin only)
 */
export const getEventById = catchAsync(async (req, res, next) => {
  const event = await eventService.getEventById(req.params.id);
  res.status(200).json({
    success: true,
    data: event
  });
});

/**
 * @desc    Update an event by ID
 * @route   PATCH /api/v1/events/:id
 * @access  Private (Admin only)
 */
export const updateEvent = catchAsync(async (req, res, next) => {
  const event = await eventService.updateEvent(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: 'Event updated successfully',
    data: event
  });
});

/**
 * @desc    Delete an event by ID
 * @route   DELETE /api/v1/events/:id
 * @access  Private (Admin only)
 */
export const deleteEvent = catchAsync(async (req, res, next) => {
  await eventService.deleteEvent(req.params.id);
  res.status(200).json({
    success: true,
    message: 'Event deleted successfully'
  });
});
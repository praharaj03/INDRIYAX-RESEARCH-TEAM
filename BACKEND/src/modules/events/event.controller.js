import { catchAsync } from '../../shared/utils/catchAsync.js';
import { eventService } from './event.service.js';

/**
 * @desc    Create a new event
 * @route   POST /api/v1/events
 * @access  Private (Admin only)
 */
export const createEvent = catchAsync(async (req, res, next) => {
  const event = await eventService.createEvent(req.body);
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
  
  res.status(200).json({
    success: true,
    data: events
  });
});

/**
 * @desc    Get a single event by slug
 * @route   GET /api/v1/events/:slug
 * @access  Public
 */
export const getEvent = catchAsync(async (req, res, next) => {
  const event = await eventService.getEventBySlug(req.params.slug);
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
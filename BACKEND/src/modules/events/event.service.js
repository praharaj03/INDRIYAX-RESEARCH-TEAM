import { eventRepository } from './event.repository.js';
import { NotFoundException, ConflictException } from '../../shared/exceptions/index.js';

// Helper to generate a URL-friendly slug (e.g., "My Event" -> "my-event-x8f9a")
const generateSlug = (title) => {
  const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${baseSlug}-${randomSuffix}`;
};

export const eventService = {
  createEvent: async (payload) => {
    const slug = generateSlug(payload.title);
    
    // Ensure slug uniqueness just in case
    const existingEvent = await eventRepository.findBySlug(slug);
    if (existingEvent) {
      throw new ConflictException('An event with this generated slug already exists. Please modify the title slightly.');
    }

    return eventRepository.create({ ...payload, slug });
  },

  getAllEvents: async (isAdmin) => {
    // Regular users only see active events. Admins see everything.
    const filters = isAdmin ? {} : { isActive: true };
    return eventRepository.findAll(filters);
  },

  getEventBySlug: async (slug) => {
    const event = await eventRepository.findBySlug(slug);
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  },

  updateEvent: async (id, payload) => {
    const event = await eventRepository.findById(id);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // If title changes, we don't necessarily change the slug so SEO/links don't break,
    // but you could add logic here to update the slug if desired.
    return eventRepository.update(id, payload);
  },

  deleteEvent: async (id) => {
    const event = await eventRepository.findById(id);
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return eventRepository.delete(id);
  }
};
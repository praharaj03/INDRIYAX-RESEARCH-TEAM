import { Prisma } from '@prisma/client';
import { eventRepository } from './event.repository.js';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '../../shared/exceptions/index.js';

const generateSlug = (title) => {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${baseSlug}-${randomSuffix}`;
};

// Single source of truth for the paid-event invariant, applied to the MERGED
// state (existing row + incoming patch) so it can't be bypassed on update.
const assertPaidEventComplete = (state) => {
  if (state.isFree === false) {
    const ok =
      state.price != null && state.price > 0 && !!state.qrCodeUrl && !!state.upiId;
    if (!ok) {
      throw new BadRequestException(
        'Paid events require a price greater than 0, a QR code image URL, and a UPI ID.'
      );
    }
  }
};

export const eventService = {
  createEvent: async (payload) => {
    const slug = generateSlug(payload.title);
    try {
      return await eventRepository.create({ ...payload, slug });
    } catch (err) {
      // Unique-constraint clash on slug (extremely rare): let the DB be the
      // arbiter instead of a check-then-insert race.
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new ConflictException(
          'Could not generate a unique slug for this event. Please try again.'
        );
      }
      throw err;
    }
  },

  getAllEvents: async (isAdmin) => {
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
    const existing = await eventRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Event not found');
    }

    // Enforce the paid-event rule against the RESULTING event, not just the
    // patch. Example caught here: existing event is free with no UPI, patch
    // flips isFree:false only → schema passes, but this rejects it.
    assertPaidEventComplete({ ...existing, ...payload });

    return eventRepository.update(id, payload);
  },

  deleteEvent: async (id) => {
    const existing = await eventRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Event not found');
    }
    return eventRepository.delete(id);
  },
};
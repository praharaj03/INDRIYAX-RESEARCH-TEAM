import { z } from 'zod';
import { EventType } from '@prisma/client';

// Shared conditional rule: a paid event must carry price>0 + qrCodeUrl + upiId.
// On CREATE all fields are present, so this fully validates. On UPDATE it only
// catches requests that include isFree:false alongside the other fields; the
// "isFree:false sent alone" case needs the existing DB row and is enforced in
// the service layer.
const paidEventRefinement = (data) => {
  if (data.isFree === false) {
    return data.price != null && data.price > 0 && !!data.qrCodeUrl && !!data.upiId;
  }
  return true;
};
const paidEventRefinementOptions = {
  message:
    'Paid events require a price greater than 0, a QR code image URL, and a UPI ID.',
  path: ['isFree'], // lets the frontend highlight the billing section
};

export const createEventSchema = z.object({
  body: z
    .object({
      title: z.string().trim().min(3, 'Title must be at least 3 characters'),
      description: z
        .string()
        .trim()
        .min(10, 'Description must be at least 10 characters'),
      speaker: z.string().trim().min(2, 'Speaker name is required'),
      thumbnail: z.string().url('Valid thumbnail URL is required'),
      venue: z.string().trim().min(2, 'Venue is required'),
      type: z.nativeEnum(EventType, {
        errorMap: () => ({ message: 'Invalid event type' }),
      }),
      date: z.string().datetime('Must be a valid ISO-8601 date string'),
      restricted: z.boolean().default(false),
      isActive: z.boolean().default(true),
      meetingLink: z.string().url('Valid meeting URL is required').optional().nullable(),

      // Payment fields
      isFree: z.boolean().default(true),
      price: z.number().min(0, 'Price cannot be negative').default(0),
      qrCodeUrl: z.string().url('Valid QR code URL is required').optional().nullable(),
      upiId: z.string().trim().optional().nullable(),
      upiNumber: z.string().trim().optional().nullable(),
    })
    .strict()
    .refine(paidEventRefinement, paidEventRefinementOptions),
});

export const updateEventSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid Event ID format'),
  }),
  body: z
    .object({
      title: z.string().trim().min(3).optional(),
      description: z.string().trim().min(10).optional(),
      speaker: z.string().trim().min(2).optional(),
      thumbnail: z.string().url().optional(),
      venue: z.string().trim().min(2).optional(),
      type: z.nativeEnum(EventType).optional(),
      date: z.string().datetime().optional(),
      restricted: z.boolean().optional(),
      isActive: z.boolean().optional(),
      summary: z.string().trim().optional(),
      recordingLink: z.string().url().optional(),
      meetingLink: z.string().url().optional().nullable(),

      // Payment fields
      isFree: z.boolean().optional(),
      price: z.number().min(0).optional(),
      qrCodeUrl: z.string().url().optional().nullable(),
      upiId: z.string().trim().optional().nullable(),
      upiNumber: z.string().trim().optional().nullable(),
    })
    .strict()
    // Catches the case where isFree:false is sent together with the payment
    // fields in one request. The merge-against-existing-event check lives in
    // the service (a stateless schema can't see the current DB row).
    .refine(paidEventRefinement, paidEventRefinementOptions),
});
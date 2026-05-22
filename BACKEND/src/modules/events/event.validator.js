import { z } from 'zod';
import { EventType } from '@prisma/client';

export const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    speaker: z.string().min(2, "Speaker name is required"),
    thumbnail: z.string().url("Valid thumbnail URL is required"),
    venue: z.string().min(2, "Venue is required"),
    type: z.nativeEnum(EventType, {
      errorMap: () => ({ message: "Type must be ONLINE, OFFLINE, or HYBRID" })
    }),
    date: z.string().datetime("Must be a valid ISO-8601 date string"),
    restricted: z.boolean().default(false),
    isActive: z.boolean().default(true),

    // --- NEW PAYMENT FIELDS ---
    isFree: z.boolean().default(true),
    price: z.number().min(0, "Price cannot be negative").default(0),
    qrCodeUrl: z.string().url("Valid QR code URL is required").optional().nullable(),
    upiId: z.string().optional().nullable(),
    upiNumber: z.string().optional().nullable(),
  }).refine((data) => {
    // CONDITIONAL VALIDATION: If the event is NOT free, enforce payment details
    if (!data.isFree) {
      // Must have a price > 0, a QR code, and a UPI ID
      return data.price > 0 && !!data.qrCodeUrl && !!data.upiId;
    }
    return true; // If it's free, it passes validation automatically
  }, {
    message: "Paid events require a price greater than 0, a QR Code image URL, and a UPI ID.",
    path: ["isFree"] // The error will be thrown here so the frontend can easily highlight the billing section
  })
});

export const updateEventSchema = z.object({
  params: z.object({
    id: z.string().cuid("Invalid Event ID format")
  }),
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    speaker: z.string().min(2).optional(),
    thumbnail: z.string().url().optional(),
    venue: z.string().min(2).optional(),
    type: z.nativeEnum(EventType).optional(),
    date: z.string().datetime().optional(),
    restricted: z.boolean().optional(),
    isActive: z.boolean().optional(),
    summary: z.string().optional(),
    recordingLink: z.string().url().optional(),
    
    // --- NEW PAYMENT FIELDS ---
    isFree: z.boolean().optional(),
    price: z.number().min(0).optional(),
    qrCodeUrl: z.string().url().optional().nullable(),
    upiId: z.string().optional().nullable(),
    upiNumber: z.string().optional().nullable(),
  })
});
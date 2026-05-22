import { z } from 'zod';
import pkg from '@prisma/client'

const { EventType } = pkg

export const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),

    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),

    speaker: z
      .string()
      .min(2, "Speaker name is required"),

    thumbnail: z
      .string()
      .url("Valid thumbnail URL is required"),

    venue: z
      .string()
      .min(2, "Venue is required"),

    type: z.nativeEnum(EventType, {
      errorMap: () => ({
        message: "Type must be ONLINE, OFFLINE, or HYBRID"
      })
    }),

    price: z
      .number()
      .min(0, "Price cannot be negative")
      .default(0),

    date: z
      .string()
      .datetime("Must be a valid ISO-8601 date string"),

    restricted: z
      .boolean()
      .default(false),

    isActive: z
      .boolean()
      .default(true)
  })
});

export const updateEventSchema = z.object({
  params: z.object({
    id: z.string().cuid("Invalid Event ID format")
  }),

  body: z.object({
    title: z.string().min(3).optional(),

    description: z
      .string()
      .min(10)
      .optional(),

    speaker: z
      .string()
      .min(2)
      .optional(),

    thumbnail: z
      .string()
      .url()
      .optional(),

    venue: z
      .string()
      .min(2)
      .optional(),

    type: z
      .nativeEnum(EventType)
      .optional(),

    price: z
      .number()
      .min(0)
      .optional(),

    date: z
      .string()
      .datetime()
      .optional(),

    restricted: z
      .boolean()
      .optional(),

    isActive: z
      .boolean()
      .optional(),

    summary: z
      .string()
      .optional(),

    recordingLink: z
      .string()
      .url()
      .optional()
  })
});
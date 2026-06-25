import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z
    .object({
      fullName: z
        .string()
        .trim()
        .min(2, 'Full name must be at least 2 characters')
        .max(100, 'Full name must be at most 100 characters')
        .optional(),
      imageUrl: z
        .string()
        .trim()
        .url('Invalid image URL format')
        .max(2048, 'Image URL is too long')
        .refine((val) => /^https?:\/\//i.test(val), 'Image URL must use http:// or https://')
        .nullable() // allow null = "remove my photo"
        .optional(), // absent = "keep my current photo"
    })
    .strict()
    .refine((data) => data.fullName !== undefined || data.imageUrl !== undefined, {
      message: 'Provide at least one field to update (fullName or imageUrl)',
    }),
});
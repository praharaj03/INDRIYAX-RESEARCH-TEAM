import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters").optional(),
    imageUrl: z.string().url("Invalid image URL format").optional()
    // Notice we do NOT include email or role here. 
    // They are physically impossible to update via this endpoint.
  })
});
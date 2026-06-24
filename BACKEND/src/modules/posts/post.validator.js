import { z } from 'zod';

// Reusable tag rule: trimmed, non-empty, bounded count and length.
const tagsSchema = z
  .array(z.string().trim().min(1).max(40))
  .max(20, 'A post can have at most 20 tags')
  .transform((tags) => [...new Set(tags.filter(Boolean))]); // dedupe + drop empties

export const createPostSchema = z.object({
  body: z
    .object({
      title: z
        .string()
        .trim()
        .min(5, 'Title must be at least 5 characters')
        .max(200, 'Title must be at most 200 characters'),
      content: z.string().min(20, 'Content must be at least 20 characters'),
      excerpt: z.string().trim().max(500, 'Excerpt is too long').optional(),
      coverImage: z.string().url('Valid cover image URL is required').optional(),
      published: z.boolean().default(false),
      isPremium: z.boolean().default(false),
      tags: tagsSchema.default([]),
    })
    .strict(), // reject authorId/slug/id or any other injected field
});

export const updatePostSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid Post ID format'),
  }),
  body: z
    .object({
      title: z.string().trim().min(5).max(200).optional(),
      content: z.string().min(20).optional(),
      excerpt: z.string().trim().max(500).optional(),
      coverImage: z.string().url().optional(),
      published: z.boolean().optional(),
      isPremium: z.boolean().optional(),
      tags: tagsSchema.optional(),
    })
    .strict()
    .refine((b) => Object.keys(b).length > 0, {
      message: 'Provide at least one field to update.',
    }),
});
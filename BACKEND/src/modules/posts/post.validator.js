import { z } from 'zod';

export const createPostSchema = z.object({
  body: z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    content: z.string().min(20, "Content must be at least 20 characters"),
    excerpt: z.string().optional(),
    coverImage: z.string().url("Valid cover image URL is required").optional(),
    published: z.boolean().default(false),
    isPremium: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const updatePostSchema = z.object({
  params: z.object({
    id: z.string().cuid("Invalid Post ID format")
  }),
  body: z.object({
    title: z.string().min(5).optional(),
    content: z.string().min(20).optional(),
    excerpt: z.string().optional(),
    coverImage: z.string().url().optional(),
    published: z.boolean().optional(),
    isPremium: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
  }),
  query: z.object({}).optional(),
});
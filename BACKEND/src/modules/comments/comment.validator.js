import { z } from 'zod';

export const createCommentSchema = z.object({
  body: z
    .object({
      postId: z.string().cuid('Invalid Post ID'),
      content: z
        .string()
        .trim()
        .min(1, 'Comment cannot be empty')
        .max(1000, 'Comment is too long'),
    })
    .strict(), // block injected userId/id or any extra field
});

export const updateCommentSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid Comment ID format'),
  }),
  body: z
    .object({
      content: z
        .string()
        .trim()
        .min(1, 'Comment cannot be empty')
        .max(1000, 'Comment is too long'),
    })
    .strict(),
});
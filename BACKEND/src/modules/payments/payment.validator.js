import { z } from 'zod';

export const createPaymentSchema = z.object({
  body: z
    .object({
      eventId: z.string().cuid('Invalid Event ID format'),

      amount: z.number().positive('Amount must be greater than 0'),

      utr: z
        .string()
        .trim()
        .min(12, 'UTR/Transaction ID must be at least 12 characters long')
        .max(22, 'UTR code is too long')
        .regex(/^[a-zA-Z0-9]+$/, 'UTR can only contain letters and numbers')
        // Normalize case so the same reference can't be submitted twice as if
        // it were two different UTRs. Uniqueness is enforced in the DB.
        .transform((v) => v.toUpperCase()),

      // Required: the screenshot is the admin's primary evidence in a manual
      // verification flow (and payments_docs.md lists it as required).
      screenshotUrl: z.string().url('Invalid screenshot URL format'),
    })
    .strict(),
});

export const reviewPaymentSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid payment identifier format'),
  }),
  body: z
    .object({
      status: z.enum(['SUCCESS', 'REJECTED'], {
        errorMap: () => ({ message: 'Status must be either SUCCESS or REJECTED' }),
      }),
      rejectionReason: z
        .string()
        .trim()
        .min(5, 'Please provide a reason for rejection')
        .max(500, 'Rejection reason is too long')
        .optional(),
    })
    .strict()
    .refine((data) => data.status !== 'REJECTED' || !!data.rejectionReason, {
      message: 'Rejection reason is required if payment is rejected',
      path: ['rejectionReason'],
    }),
});
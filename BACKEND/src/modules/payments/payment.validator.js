import { z } from 'zod';

export const createPaymentSchema = z.object({
  body: z.object({
    // We now expect an eventId instead of a subscription plan
    eventId: z.string().cuid("Invalid Event ID format"),
    
    amount: z.number().min(0, "Amount cannot be negative"),
    
    utr: z.string()
      .min(6, "UTR/Transaction ID must be at least 6 characters long")
      .max(30, "UTR code is too long")
      .regex(/^[a-zA-Z0-9-]+$/, "UTR can only contain letters, numbers, and hyphens"),
      
    screenshotUrl: z.string().url("Invalid screenshot URL format").optional(),
  })
});

export const reviewPaymentSchema = z.object({
  params: z.object({
    id: z.string().cuid("Invalid payment identifier format")
  }),
  body: z.object({
    status: z.enum(["SUCCESS", "REJECTED"], {
      errorMap: () => ({ message: "Status must be either SUCCESS or REJECTED" })
    }),
    rejectionReason: z.string().min(5, "Please provide a reason for rejection").optional()
  }).refine(data => data.status !== "REJECTED" || !!data.rejectionReason, {
    // If the admin rejects the payment, they MUST provide a reason
    message: "Rejection reason is required if payment is rejected",
    path: ["rejectionReason"] 
  })
});
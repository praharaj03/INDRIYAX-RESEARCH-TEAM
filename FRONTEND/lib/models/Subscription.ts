// TODO (Backend Dev): Implement Subscription Mongoose model
//
// A Subscription links a User to a paid plan, granting access to restricted events.
//
// Fields:
//   userId       - ref to User._id (the subscriber)
//   plan         - subscription tier: "monthly" | "annual"
//   status       - "active" | "expired" | "cancelled"
//   startDate    - Date when subscription began
//   endDate      - Date when subscription expires
//   paymentId    - ref to Payment._id (last successful payment)
//   createdAt    - auto timestamp
//   updatedAt    - auto timestamp
//
// Logic notes:
//   - On payment success (webhook), create/renew a Subscription document
//   - On expiry, set status = "expired" (can use a cron job or check on-demand)
//   - Middleware / API route should check:
//       1. Is the event restricted? (event.restricted === true)
//       2. Does the requesting user have an active Subscription? (status === "active" && endDate > now)
//       3. If not → return 403 or redirect to /subscribe page
//
// import { Schema, model, models } from "mongoose";
//
// const SubscriptionSchema = new Schema(
//   {
//     userId:    { type: Schema.Types.ObjectId, ref: "User", required: true },
//     plan:      { type: String, enum: ["monthly", "annual"], required: true },
//     status:    { type: String, enum: ["active", "expired", "cancelled"], default: "active" },
//     startDate: { type: Date, required: true },
//     endDate:   { type: Date, required: true },
//     paymentId: { type: Schema.Types.ObjectId, ref: "Payment" },
//   },
//   { timestamps: true }
// );
//
// export const SubscriptionModel =
//   models.Subscription || model("Subscription", SubscriptionSchema);

export {};

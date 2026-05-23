// TODO (Backend Dev): Implement subscription business logic
//
// This service is the single source of truth for checking subscription status.
// Import and call these functions from:
//   - app/api/events/[slug]/route.ts  (public event detail — gate restricted content)
//   - middleware.ts                   (optional: redirect non-subscribers at route level)
//   - app/(public)/events/[slug]/page.tsx (server component — pass isSubscribed prop)
//
// ─── FUNCTIONS TO IMPLEMENT ───────────────────────────────────────────────────
//
// hasActiveSubscription(userId: string): Promise<boolean>
//   - Connect DB, query SubscriptionModel
//   - Return true if a doc exists with userId, status="active", endDate > new Date()
//
// getSubscription(userId: string): Promise<Subscription | null>
//   - Return the full subscription document for a user
//
// createSubscription(userId, plan, paymentId): Promise<Subscription>
//   - Called after successful payment
//   - Set startDate = now, endDate = now + 30 days (monthly) or +365 days (annual)
//   - Set status = "active"
//
// cancelSubscription(userId: string): Promise<void>
//   - Set status = "cancelled"
//
// ─── USAGE EXAMPLE ────────────────────────────────────────────────────────────
//
// In a server component or API route:
//   const session = await getServerSession();          // get logged-in user
//   const canView = await hasActiveSubscription(session.user.id);
//   if (event.restricted && !canView) {
//     return redirect("/subscribe");                   // or return 403
//   }
//
// ─── SUBSCRIPTION PLANS (suggested) ──────────────────────────────────────────
//
//   monthly  → ₹199/month  → access to all restricted events for 30 days
//   annual   → ₹1499/year  → access to all restricted events for 365 days
//
// ─────────────────────────────────────────────────────────────────────────────

export {};

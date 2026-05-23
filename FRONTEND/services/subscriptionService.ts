import { apiFetch, getToken } from "@/lib/api";

/**
 * Subscription/Enrollment service
 * 
 * In the connector branch architecture, "subscriptions" map to event enrollments.
 * The backend handles enrollments via /api/v1/payments (payment submission → admin review → enrollment).
 * 
 * This service provides helper functions for checking enrollment status.
 */

export async function getMyEnrollments() {
  const token = getToken();
  if (!token) return [];
  try {
    const data = await apiFetch("/api/v1/payments/my", {}, token);
    return data.data ?? [];
  } catch {
    return [];
  }
}

export async function isEnrolledInEvent(eventId: string): Promise<boolean> {
  const token = getToken();
  if (!token) return false;
  try {
    const data = await apiFetch("/api/v1/payments/my", {}, token);
    const payments = data.data ?? [];
    return payments.some(
      (p: { eventId: string; status: string }) => 
        p.eventId === eventId && p.status === "SUCCESS"
    );
  } catch {
    return false;
  }
}

export async function hasActiveSubscription(): Promise<boolean> {
  const token = getToken();
  if (!token) return false;
  try {
    const enrollments = await getMyEnrollments();
    return enrollments.length > 0;
  } catch {
    return false;
  }
}

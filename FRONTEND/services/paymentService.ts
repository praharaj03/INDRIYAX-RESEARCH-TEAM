import { apiFetch, getToken } from "@/lib/api";

export async function submitPayment(payload: {
  eventId: string;
  amount: number;
  utr: string;
  screenshotUrl: string;
}) {
  const token = getToken();
  const data = await apiFetch("/api/v1/payments", {
    method: "POST",
    body: JSON.stringify(payload),
  }, token ?? undefined);
  return data.data;
}

export async function reviewPayment(id: string, status: "SUCCESS" | "REJECTED", rejectionReason?: string) {
  const token = getToken();
  const data = await apiFetch(`/api/v1/payments/${id}/review`, {
    method: "PATCH",
    body: JSON.stringify({ status, ...(rejectionReason ? { rejectionReason } : {}) }),
  }, token ?? undefined);
  return data.data;
}

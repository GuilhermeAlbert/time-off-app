import { ManagerDecision } from "../../../api/hcm/enums/manager-decision";

async function hcmFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  const json = (await res.json()) as { data?: T; error?: { message: string } };
  if (!res.ok) {
    throw new Error(json.error?.message ?? "Request failed");
  }
  return json.data as T;
}

export async function getPendingRequests() {
  return hcmFetch("/api/hcm/requests");
}

export async function approveRequest(requestId: string) {
  return hcmFetch(`/api/hcm/requests/${requestId}/decision`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ decision: ManagerDecision.Approve }),
  });
}

export async function denyRequest(requestId: string) {
  return hcmFetch(`/api/hcm/requests/${requestId}/decision`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ decision: ManagerDecision.Deny }),
  });
}

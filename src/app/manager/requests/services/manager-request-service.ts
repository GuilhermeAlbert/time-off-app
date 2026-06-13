import { ManagerDecision } from "../../../api/hcm/enums/manager-decision";
import type { TimeOffBalance as HcmTimeOffBalance } from "../../../api/hcm/types/time-off-balance";
import type { TimeOffRequest as HcmTimeOffRequest } from "../../../api/hcm/types/time-off-request";

async function hcmFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  const json = (await res.json()) as { data?: T; error?: { message: string } };
  if (!res.ok) {
    throw new Error(json.error?.message ?? "Request failed");
  }
  return json.data as T;
}

export async function getPendingRequests(): Promise<{
  requests: HcmTimeOffRequest[];
}> {
  return hcmFetch<{ requests: HcmTimeOffRequest[] }>("/api/hcm/requests");
}

export async function getBalances(): Promise<{
  balances: HcmTimeOffBalance[];
  lastSyncedAt: string;
  source: string;
}> {
  return hcmFetch<{
    balances: HcmTimeOffBalance[];
    lastSyncedAt: string;
    source: string;
  }>("/api/hcm/balances");
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

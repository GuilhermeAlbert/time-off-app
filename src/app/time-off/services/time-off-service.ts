import type { HcmSimulationMode } from "../../api/hcm/enums/hcm-simulation-mode";

async function hcmFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  const json = (await res.json()) as { data?: T; error?: { message: string } };
  if (!res.ok) {
    throw new Error(json.error?.message ?? "Request failed");
  }
  return json.data as T;
}

export type SubmitTimeOffRequestInput = {
  employeeId: string;
  locationId: string;
  startDate: string;
  endDate: string;
  daysRequested: number;
  notes?: string;
  simulationMode?: HcmSimulationMode;
};

export type AnniversaryBonusInput = {
  employeeId?: string;
};

export async function getBalances() {
  return hcmFetch("/api/hcm/balances");
}

export async function getBalance(balanceId: string) {
  return hcmFetch(`/api/hcm/balances/${balanceId}`);
}

export async function submitTimeOffRequest(input: SubmitTimeOffRequestInput) {
  return hcmFetch("/api/hcm/requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export async function triggerAnniversaryBonus(input?: AnniversaryBonusInput) {
  return hcmFetch("/api/hcm/simulations/anniversary-bonus", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input ?? {}),
  });
}

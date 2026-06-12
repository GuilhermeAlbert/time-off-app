import type { ManagerPendingRequest } from "../types/manager-pending-request";

export const pendingRequests: ManagerPendingRequest[] = [
  {
    id: "request-001",
    employeeName: "Example Employee",
    location: "New York",
    requestedDays: 3,
    startDate: "2026-07-01",
    endDate: "2026-07-03",
    availableBalance: 18,
    pendingBalance: 0,
  },
];

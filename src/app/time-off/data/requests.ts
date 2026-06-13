import { RequestStatus } from "../enums/request-status";
import type { TimeOffRequest } from "../types/time-off-request";

export const requests: TimeOffRequest[] = [
  {
    id: "request-001",
    startDate: "2026-05-01",
    location: "New York",
    requestedDays: 3,
    status: RequestStatus.Confirmed,
  },
];

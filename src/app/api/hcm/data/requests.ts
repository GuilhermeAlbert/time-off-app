import type { TimeOffRequest } from "../types/time-off-request";

export const initialTimeOffRequests: TimeOffRequest[] = [];

export const timeOffRequests: TimeOffRequest[] = initialTimeOffRequests.map(
  (request) => ({ ...request }),
);

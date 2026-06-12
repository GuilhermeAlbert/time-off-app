import { ManagerDecision } from "../enums/manager-decision";
import { RequestStatus } from "../enums/request-status";

export type TimeOffRequest = {
  id: string;
  employeeId: string;
  balanceId: string;
  locationId: string;
  status: RequestStatus;
  requestedDays: number;
  startDate: string;
  endDate: string;
  version: number;
  reason?: string;
  decision?: ManagerDecision;
  managerId?: string;
  note?: string;
  createdAt: string;
  decidedAt?: string;
};

import { RequestStatus } from "../enums/request-status";

export type TimeOffRequest = {
  id: string;
  startDate: string;
  location: string;
  requestedDays: number;
  status: RequestStatus;
};

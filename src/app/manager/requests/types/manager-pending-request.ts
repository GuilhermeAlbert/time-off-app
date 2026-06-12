export type ManagerPendingRequest = {
  id: string;
  employeeName: string;
  location: string;
  requestedDays: number;
  startDate: string;
  endDate: string;
  availableBalance: number;
  pendingBalance: number;
};

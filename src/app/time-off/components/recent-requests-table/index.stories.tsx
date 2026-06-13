import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { RequestStatus } from "../../enums/request-status";
import { RecentRequestsTable } from "./index";

const meta: Meta<typeof RecentRequestsTable> = {
  title: "Time Off/RecentRequestsTable",
  component: RecentRequestsTable,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: { requests: [] },
};

export const Pending: Story = {
  args: {
    requests: [
      {
        id: "req-001",
        startDate: "2026-08-04",
        location: "New York",
        requestedDays: 3,
        status: RequestStatus.Pending,
      },
    ],
  },
};

export const Confirmed: Story = {
  args: {
    requests: [
      {
        id: "req-002",
        startDate: "2026-07-14",
        location: "London",
        requestedDays: 5,
        status: RequestStatus.Confirmed,
      },
    ],
  },
};

export const Rejected: Story = {
  args: {
    requests: [
      {
        id: "req-003",
        startDate: "2026-06-23",
        location: "Remote",
        requestedDays: 2,
        status: RequestStatus.Rejected,
      },
    ],
  },
};

export const NeedsReconciliation: Story = {
  args: {
    requests: [
      {
        id: "req-004",
        startDate: "2026-05-12",
        location: "New York",
        requestedDays: 4,
        status: RequestStatus.NeedsReconciliation,
      },
    ],
  },
};

export const MixedStatuses: Story = {
  args: {
    requests: [
      {
        id: "req-005",
        startDate: "2026-08-04",
        location: "New York",
        requestedDays: 3,
        status: RequestStatus.Pending,
      },
      {
        id: "req-006",
        startDate: "2026-07-14",
        location: "London",
        requestedDays: 5,
        status: RequestStatus.Confirmed,
      },
      {
        id: "req-007",
        startDate: "2026-06-23",
        location: "Remote",
        requestedDays: 2,
        status: RequestStatus.Rejected,
      },
      {
        id: "req-008",
        startDate: "2026-05-12",
        location: "New York",
        requestedDays: 4,
        status: RequestStatus.NeedsReconciliation,
      },
    ],
  },
};

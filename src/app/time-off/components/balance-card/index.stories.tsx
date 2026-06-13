import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SyncStatus } from "../../enums/sync-status";
import { BalanceCard } from "./index";

const meta: Meta<typeof BalanceCard> = {
  title: "Time Off/BalanceCard",
  component: BalanceCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const newYorkBase = {
  id: "balance-new-york-employee-example-001",
  locationId: "new-york",
  location: "New York",
  availableDays: 18,
  pendingDays: 0,
};

export const Fresh: Story = {
  args: {
    balance: {
      ...newYorkBase,
      syncStatus: SyncStatus.Fresh,
    },
  },
};

export const Refreshing: Story = {
  args: {
    balance: {
      ...newYorkBase,
      pendingDays: 3,
      syncStatus: SyncStatus.Refreshing,
    },
  },
};

export const Stale: Story = {
  args: {
    balance: {
      ...newYorkBase,
      syncStatus: SyncStatus.Stale,
    },
  },
};

export const BalanceRefreshed: Story = {
  name: "Balance Refreshed Mid-Session",
  args: {
    balance: {
      id: "balance-new-york-employee-example-001",
      locationId: "new-york",
      location: "New York",
      availableDays: 23,
      pendingDays: 3,
      syncStatus: SyncStatus.Stale,
    },
  },
};

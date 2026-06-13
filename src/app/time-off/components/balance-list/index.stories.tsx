import type { Decorator, Meta, StoryObj } from "@storybook/nextjs-vite";

import { BalanceList } from "./index";

const meta: Meta<typeof BalanceList> = {
  title: "Time Off/BalanceList",
  component: BalanceList,
};

export default meta;
type Story = StoryObj<typeof meta>;

function withFetch(response: unknown): Decorator[] {
  return [
    (Story) => {
      window.fetch = () =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(response),
        } as Response);
      return <Story />;
    },
  ];
}

const freshBalancesResponse = {
  data: {
    balances: [
      {
        id: "balance-new-york-employee-example-001",
        locationId: "new-york",
        availableDays: 18,
        pendingDays: 0,
        syncStatus: "fresh",
      },
      {
        id: "balance-london-employee-example-001",
        locationId: "london",
        availableDays: 12,
        pendingDays: 0,
        syncStatus: "fresh",
      },
      {
        id: "balance-remote-employee-example-001",
        locationId: "remote",
        availableDays: 22,
        pendingDays: 0,
        syncStatus: "fresh",
      },
    ],
    lastSyncedAt: "2026-06-13T09:00:00.000Z",
    source: "hcm",
  },
};

export const Loading: Story = {
  decorators: [
    (Story) => {
      window.fetch = () => new Promise<never>(() => {});
      return <Story />;
    },
  ],
};

export const Empty: Story = {
  decorators: withFetch({
    data: {
      balances: [],
      lastSyncedAt: "2026-06-13T09:00:00.000Z",
      source: "hcm",
    },
  }),
};

export const Fresh: Story = {
  decorators: withFetch(freshBalancesResponse),
};

export const Refreshing: Story = {
  decorators: withFetch({
    data: {
      balances: [
        {
          id: "balance-new-york-employee-example-001",
          locationId: "new-york",
          availableDays: 18,
          pendingDays: 3,
          syncStatus: "refreshing",
        },
      ],
      lastSyncedAt: "2026-06-13T09:00:00.000Z",
      source: "hcm",
    },
  }),
};

export const Stale: Story = {
  decorators: withFetch({
    data: {
      balances: [
        {
          id: "balance-new-york-employee-example-001",
          locationId: "new-york",
          availableDays: 21,
          pendingDays: 3,
          syncStatus: "stale",
        },
      ],
      lastSyncedAt: "2026-06-12T09:00:00.000Z",
      source: "hcm",
    },
  }),
};

export const BalanceRefreshed: Story = {
  name: "Balance Refreshed Mid-Session",
  decorators: withFetch({
    data: {
      balances: [
        {
          id: "balance-new-york-employee-example-001",
          locationId: "new-york",
          availableDays: 23,
          pendingDays: 3,
          syncStatus: "stale",
        },
      ],
      lastSyncedAt: "2026-06-13T09:15:00.000Z",
      source: "hcm",
    },
  }),
};

export const ErrorState: Story = {
  name: "Error",
  decorators: [
    (Story) => {
      window.fetch = () =>
        Promise.resolve({
          ok: false,
          status: 503,
          json: () =>
            Promise.resolve({
              error: { message: "HCM is temporarily unavailable" },
            }),
        } as Response);
      return <Story />;
    },
  ],
};

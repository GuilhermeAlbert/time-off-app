import type { Decorator, Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fireEvent, fn, userEvent, waitFor, within } from "storybook/test";

import { SyncStatus } from "../../enums/sync-status";
import type { TimeOffBalance } from "../../types/time-off-balance";
import { RequestSection } from "../request-section";
import { RequestForm } from "./index";

const meta: Meta<typeof RequestForm> = {
  title: "Time Off/RequestForm",
  component: RequestForm,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockBalances: TimeOffBalance[] = [
  {
    id: "balance-new-york",
    locationId: "new-york",
    location: "New York",
    availableDays: 18,
    pendingDays: 0,
    syncStatus: SyncStatus.Fresh,
  },
  {
    id: "balance-london",
    locationId: "london",
    location: "London",
    availableDays: 12,
    pendingDays: 0,
    syncStatus: SyncStatus.Fresh,
  },
  {
    id: "balance-remote",
    locationId: "remote",
    location: "Remote",
    availableDays: 22,
    pendingDays: 0,
    syncStatus: SyncStatus.Fresh,
  },
];

const mockBalancesApiResponse = {
  data: {
    balances: [
      {
        id: "balance-new-york",
        locationId: "new-york",
        availableDays: 18,
        pendingDays: 0,
        syncStatus: "fresh",
      },
      {
        id: "balance-london",
        locationId: "london",
        availableDays: 12,
        pendingDays: 0,
        syncStatus: "fresh",
      },
      {
        id: "balance-remote",
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

async function fillAndSubmit(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  await userEvent.selectOptions(canvas.getByLabelText(/location/i), "new-york");
  fireEvent.change(canvas.getByLabelText(/start date/i), {
    target: { value: "2026-08-01" },
  });
  fireEvent.change(canvas.getByLabelText(/end date/i), {
    target: { value: "2026-08-05" },
  });
  fireEvent.change(canvas.getByLabelText(/days requested/i), {
    target: { value: "3", valueAsNumber: 3 },
  });
  await userEvent.click(
    canvas.getByRole("button", { name: /submit request/i }),
  );
}

function withSubmitFetch(
  submitResponse: () => Promise<Response>,
  balanceResponse?: () => Promise<Response>,
): Decorator[] {
  return [
    (Story) => {
      window.fetch = ((url: unknown) => {
        const urlStr = String(url);
        if (urlStr.includes("/api/hcm/balances/")) {
          return (
            balanceResponse?.() ??
            Promise.resolve({
              ok: true,
              status: 200,
              json: () => Promise.resolve({ data: {} }),
            } as Response)
          );
        }
        if (urlStr.includes("/api/hcm/balances")) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve(mockBalancesApiResponse),
          } as Response);
        }
        return submitResponse();
      }) as typeof fetch;
      return <Story />;
    },
  ];
}

// ── Pure form stories ─────────────────────────────────────────────────────────

export const Empty: Story = {
  args: {
    onSubmit: fn(),
    balances: mockBalances,
    isLoadingBalances: false,
  },
};

export const ValidationError: Story = {
  args: {
    onSubmit: fn(),
    balances: mockBalances,
    isLoadingBalances: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: /submit request/i }),
    );
    await waitFor(() => {
      expect(canvas.getByText(/select a location/i)).toBeInTheDocument();
    });
  },
};

// ── RequestSection stories (hook-driven states) ───────────────────────────────

export const Submitting: Story = {
  render: () => <RequestSection />,
  decorators: withSubmitFetch(() => new Promise<never>(() => {})),
  play: async ({ canvasElement }) => {
    await fillAndSubmit(canvasElement);
    const canvas = within(canvasElement);
    await waitFor(() => canvas.getByText(/pending requests/i));
  },
};

export const OptimisticPending: Story = {
  render: () => <RequestSection />,
  decorators: withSubmitFetch(() =>
    Promise.resolve({
      ok: true,
      status: 201,
      json: () =>
        Promise.resolve({
          data: {
            request: { id: "req-001", status: "pending" },
            balance: { id: "bal-001" },
          },
        }),
    } as Response),
  ),
  play: async ({ canvasElement }) => {
    await fillAndSubmit(canvasElement);
    const canvas = within(canvasElement);
    await waitFor(() => {
      expect(canvas.getByText(/pending requests/i)).toBeInTheDocument();
      expect(canvas.getByText("Pending")).toBeInTheDocument();
      expect(canvas.queryByText(/approved/i)).not.toBeInTheDocument();
    });
  },
};

export const HcmRejected: Story = {
  render: () => <RequestSection />,
  decorators: withSubmitFetch(() =>
    Promise.resolve({
      ok: false,
      status: 409,
      json: () =>
        Promise.resolve({ error: { message: "Insufficient balance" } }),
    } as Response),
  ),
  play: async ({ canvasElement }) => {
    await fillAndSubmit(canvasElement);
    const canvas = within(canvasElement);
    await waitFor(() => canvas.getByText(/submission failed/i));
  },
};

export const HcmSilentlyWrong: Story = {
  render: () => <RequestSection />,
  decorators: withSubmitFetch(() =>
    Promise.resolve({
      ok: true,
      status: 201,
      json: () =>
        Promise.resolve({
          data: {
            request: { id: "req-002", status: "pending" },
            balance: { id: "bal-002" },
            reconciliationHint: "silent-wrong-balance-not-reserved",
          },
        }),
    } as Response),
  ),
  play: async ({ canvasElement }) => {
    await fillAndSubmit(canvasElement);
    const canvas = within(canvasElement);
    await waitFor(() => canvas.getByText(/balance may not reflect/i));
  },
};

export const OptimisticRolledBack: Story = {
  render: () => <RequestSection />,
  decorators: withSubmitFetch(() =>
    Promise.resolve({
      ok: false,
      status: 500,
      json: () =>
        Promise.resolve({ error: { message: "HCM unavailable" } }),
    } as Response),
  ),
  play: async ({ canvasElement }) => {
    await fillAndSubmit(canvasElement);
    const canvas = within(canvasElement);
    await waitFor(() => canvas.getByText(/submission failed/i));
  },
};

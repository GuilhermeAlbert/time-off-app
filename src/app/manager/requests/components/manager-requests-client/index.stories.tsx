import type { Decorator, Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

import { ManagerRequestCard } from "../manager-request-card";
import { ManagerRequestList } from "../manager-request-list";
import { ManagerRequestsClient } from "./index";

const meta: Meta<typeof ManagerRequestsClient> = {
  title: "Manager/ManagerReview",
  component: ManagerRequestsClient,
};

export default meta;
type Story = StoryObj<typeof meta>;

// ── Shared mock data ──────────────────────────────────────────────────────────

const mockRequest = {
  id: "req-001",
  employeeId: "employee-example-001",
  balanceId: "balance-001",
  locationId: "new-york",
  status: "pending",
  requestedDays: 3,
  startDate: "2026-08-04",
  endDate: "2026-08-06",
  version: 1,
  createdAt: "2026-07-01T09:00:00.000Z",
};

const mockBalance = {
  id: "balance-001",
  employeeId: "employee-example-001",
  locationId: "new-york",
  availableDays: 18,
  pendingDays: 0,
  version: 1,
  syncStatus: "fresh",
  lastSyncedAt: "2026-07-01T08:00:00.000Z",
};

const enrichedRequest = {
  id: "req-001",
  employeeName: "employee-example-001",
  location: "new-york",
  requestedDays: 3,
  startDate: "2026-08-04",
  endDate: "2026-08-06",
  availableBalance: 18,
  pendingBalance: 0,
};

function successResponse(data: unknown): Promise<Response> {
  return Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({ data }),
  } as Response);
}

function errorResponse(message: string, status = 409): Promise<Response> {
  return Promise.resolve({
    ok: false,
    status,
    json: () => Promise.resolve({ error: { message } }),
  } as Response);
}

function withManagerFetch(
  decisionResponse: () => Promise<Response>,
): Decorator[] {
  return [
    (Story) => {
      window.fetch = ((url: unknown) => {
        const urlStr = String(url);
        if (urlStr.includes("/decision")) {
          return decisionResponse();
        }
        if (urlStr === "/api/hcm/requests") {
          return successResponse({ requests: [mockRequest] });
        }
        if (urlStr === "/api/hcm/balances") {
          return successResponse({
            balances: [mockBalance],
            lastSyncedAt: "2026-07-01T08:00:00.000Z",
            source: "hcm",
          });
        }
        return Promise.reject(new Error(`Unexpected URL: ${urlStr}`));
      }) as typeof fetch;
      return <Story />;
    },
  ];
}

// ── Pure component stories ────────────────────────────────────────────────────

export const NoPendingRequests: Story = {
  render: () => <ManagerRequestList requests={[]} />,
};

export const PendingRequestWithValidBalance: Story = {
  render: () => (
    <ManagerRequestCard
      request={enrichedRequest}
      onApprove={fn()}
      onDeny={fn()}
    />
  ),
};

// ── Client stories (fetch-driven states) ─────────────────────────────────────

export const Approving: Story = {
  decorators: withManagerFetch(() => new Promise<never>(() => {})),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => canvas.getByRole("button", { name: /approve/i }));
    await userEvent.click(canvas.getByRole("button", { name: /approve/i }));
  },
};

export const Denied: Story = {
  decorators: withManagerFetch(() => successResponse({ decision: "denied" })),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => canvas.getByRole("button", { name: /deny/i }));
    await userEvent.click(canvas.getByRole("button", { name: /deny/i }));
    await waitFor(() => canvas.getByText(/no pending requests/i));
  },
};

export const Approved: Story = {
  decorators: withManagerFetch(() =>
    successResponse({ decision: "approved" }),
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => canvas.getByRole("button", { name: /approve/i }));
    await userEvent.click(canvas.getByRole("button", { name: /approve/i }));
    await waitFor(() => canvas.getByText(/no pending requests/i));
  },
};

export const ConflictAtDecisionTime: Story = {
  decorators: withManagerFetch(() =>
    errorResponse("Insufficient balance", 409),
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => canvas.getByRole("button", { name: /approve/i }));
    await userEvent.click(canvas.getByRole("button", { name: /approve/i }));
    await waitFor(() => {
      expect(canvas.getByText(/insufficient balance/i)).toBeInTheDocument();
    });
  },
};

export const BalanceChangedBeforeApproval: Story = {
  decorators: withManagerFetch(() =>
    errorResponse("Balance changed before approval", 409),
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => canvas.getByRole("button", { name: /approve/i }));
    await userEvent.click(canvas.getByRole("button", { name: /approve/i }));
    await waitFor(() => canvas.getByText(/balance changed before approval/i));
  },
};

export const ErrorState: Story = {
  name: "Error",
  decorators: [
    (Story) => {
      window.fetch = (() =>
        errorResponse("HCM is temporarily unavailable", 503)) as typeof fetch;
      return <Story />;
    },
  ],
};

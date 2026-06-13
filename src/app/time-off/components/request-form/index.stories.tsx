import type { Decorator, Meta, StoryObj } from "@storybook/nextjs-vite";
import { fireEvent, fn, userEvent, waitFor, within } from "storybook/test";

import { RequestSection } from "../request-section";
import { RequestForm } from "./index";

const meta: Meta<typeof RequestForm> = {
  title: "Time Off/RequestForm",
  component: RequestForm,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

async function fillAndSubmit(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  await userEvent.type(canvas.getByLabelText(/location/i), "New York");
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
        return submitResponse();
      }) as typeof fetch;
      return <Story />;
    },
  ];
}

// ── Pure form stories ─────────────────────────────────────────────────────────

export const Empty: Story = {
  args: { onSubmit: fn() },
};

export const ValidationError: Story = {
  args: { onSubmit: fn() },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: /submit request/i }),
    );
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
    await waitFor(() => canvas.getByText(/pending requests/i));
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

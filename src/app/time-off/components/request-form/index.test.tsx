// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(cleanup);

import { SyncStatus } from "../../enums/sync-status";
import type { TimeOffBalance } from "../../types/time-off-balance";
import { RequestForm } from "./index";

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const dayAfterTomorrow = new Date(today);
dayAfterTomorrow.setDate(today.getDate() + 2);

function fmt(d: Date): string {
  return d.toISOString().slice(0, 10);
}

const tomorrowStr = fmt(tomorrow);
const dayAfterTomorrowStr = fmt(dayAfterTomorrow);

const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const yesterdayStr = fmt(yesterday);

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
    pendingDays: 2,
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

function renderForm(
  balances = mockBalances,
  isLoadingBalances = false,
  onSubmit = vi.fn(),
) {
  render(
    <RequestForm
      balances={balances}
      isLoadingBalances={isLoadingBalances}
      onSubmit={onSubmit}
    />,
  );
}

describe("RequestForm — location select", () => {
  it("renders a select element for location, not a text input", () => {
    renderForm();
    const locationField = screen.getByLabelText(/location/i);
    expect(locationField.tagName).toBe("SELECT");
  });

  it("renders all available balance locations as options", () => {
    renderForm();
    expect(screen.getByRole("option", { name: "New York" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "London" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Remote" })).toBeInTheDocument();
  });

  it("does not render a free-text input for location", () => {
    renderForm();
    const inputs = screen.queryAllByRole("textbox");
    const locationInput = inputs.find((el) =>
      el.getAttribute("id")?.toLowerCase().includes("location"),
    );
    expect(locationInput).toBeUndefined();
  });

  it("disables the select when balances are loading", () => {
    renderForm([], true);
    expect(screen.getByLabelText(/location/i)).toBeDisabled();
  });

  it("disables submit when no balances are available", () => {
    renderForm([]);
    expect(screen.getByRole("button", { name: /submit request/i })).toBeDisabled();
  });
});

describe("RequestForm — location option values are locationIds", () => {
  it("select option values match locationIds, not display labels", () => {
    renderForm();
    const nyOption = screen.getByRole("option", { name: "New York" }) as HTMLOptionElement;
    expect(nyOption.value).toBe("new-york");

    const londonOption = screen.getByRole("option", { name: "London" }) as HTMLOptionElement;
    expect(londonOption.value).toBe("london");

    const remoteOption = screen.getByRole("option", { name: "Remote" }) as HTMLOptionElement;
    expect(remoteOption.value).toBe("remote");
  });
});

describe("RequestForm — balance info display", () => {
  it("shows available and pending days when a location is selected", async () => {
    renderForm();
    fireEvent.change(screen.getByLabelText(/location/i), {
      target: { value: "london" },
    });
    await waitFor(() => {
      expect(screen.getByText(/available/i)).toBeInTheDocument();
      expect(screen.getByText(/pending/i)).toBeInTheDocument();
    });
  });

  it("shows stale warning when selected balance is stale", async () => {
    const staleBalances: TimeOffBalance[] = [
      {
        id: "b1",
        locationId: "new-york",
        location: "New York",
        availableDays: 10,
        pendingDays: 0,
        syncStatus: SyncStatus.Stale,
      },
    ];
    renderForm(staleBalances);
    fireEvent.change(screen.getByLabelText(/location/i), {
      target: { value: "new-york" },
    });
    await waitFor(() => {
      expect(screen.getByText(/stale/i)).toBeInTheDocument();
    });
  });
});

describe("RequestForm — date validations", () => {
  it("rejects a past start date", async () => {
    renderForm();
    fireEvent.change(screen.getByLabelText(/location/i), {
      target: { value: "new-york" },
    });
    fireEvent.change(screen.getByLabelText(/start date/i), {
      target: { value: yesterdayStr },
    });
    fireEvent.change(screen.getByLabelText(/end date/i), {
      target: { value: tomorrowStr },
    });
    fireEvent.change(screen.getByLabelText(/days requested/i), {
      target: { value: "1" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit request/i }));
    await waitFor(() => {
      expect(
        screen.getByText(/start date cannot be in the past/i),
      ).toBeInTheDocument();
    });
  });

  it("rejects a past end date", async () => {
    renderForm();
    fireEvent.change(screen.getByLabelText(/location/i), {
      target: { value: "new-york" },
    });
    fireEvent.change(screen.getByLabelText(/start date/i), {
      target: { value: tomorrowStr },
    });
    fireEvent.change(screen.getByLabelText(/end date/i), {
      target: { value: yesterdayStr },
    });
    fireEvent.change(screen.getByLabelText(/days requested/i), {
      target: { value: "1" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit request/i }));
    await waitFor(() => {
      expect(
        screen.getByText(/end date cannot be in the past/i),
      ).toBeInTheDocument();
    });
  });

  it("rejects end date before start date", async () => {
    renderForm();
    fireEvent.change(screen.getByLabelText(/location/i), {
      target: { value: "new-york" },
    });
    fireEvent.change(screen.getByLabelText(/start date/i), {
      target: { value: dayAfterTomorrowStr },
    });
    fireEvent.change(screen.getByLabelText(/end date/i), {
      target: { value: tomorrowStr },
    });
    fireEvent.change(screen.getByLabelText(/days requested/i), {
      target: { value: "1" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit request/i }));
    await waitFor(() => {
      expect(
        screen.getByText(/end date cannot be before start date/i),
      ).toBeInTheDocument();
    });
  });
});

describe("RequestForm — days requested validations", () => {
  it("shows error when days requested is zero", async () => {
    renderForm();
    fireEvent.change(screen.getByLabelText(/location/i), {
      target: { value: "new-york" },
    });
    fireEvent.change(screen.getByLabelText(/start date/i), {
      target: { value: tomorrowStr },
    });
    fireEvent.change(screen.getByLabelText(/end date/i), {
      target: { value: dayAfterTomorrowStr },
    });
    fireEvent.change(screen.getByLabelText(/days requested/i), {
      target: { value: "0" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit request/i }));
    await waitFor(() => {
      expect(
        screen.getByText(/requested days must be greater than zero/i),
      ).toBeInTheDocument();
    });
  });

  it("shows balance exceeded message when days exceed available balance", async () => {
    renderForm();
    fireEvent.change(screen.getByLabelText(/location/i), {
      target: { value: "new-york" },
    });
    fireEvent.change(screen.getByLabelText(/days requested/i), {
      target: { value: "99" },
    });
    await waitFor(() => {
      expect(
        screen.getByText(/requested days exceed available balance/i),
      ).toBeInTheDocument();
    });
  });

  it("disables submit when days exceed available balance", async () => {
    renderForm();
    fireEvent.change(screen.getByLabelText(/location/i), {
      target: { value: "new-york" },
    });
    fireEvent.change(screen.getByLabelText(/days requested/i), {
      target: { value: "99" },
    });
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /submit request/i }),
      ).toBeDisabled();
    });
  });
});

describe("RequestForm — valid submission", () => {
  it("calls submit handler with locationId, not the display label", async () => {
    const onSubmit = vi.fn();
    renderForm(mockBalances, false, onSubmit);

    fireEvent.change(screen.getByLabelText(/location/i), {
      target: { value: "new-york" },
    });
    fireEvent.change(screen.getByLabelText(/start date/i), {
      target: { value: tomorrowStr },
    });
    fireEvent.change(screen.getByLabelText(/end date/i), {
      target: { value: dayAfterTomorrowStr },
    });
    fireEvent.change(screen.getByLabelText(/days requested/i), {
      target: { value: "3" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit request/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          locationId: "new-york",
          daysRequested: 3,
        }),
        expect.anything(),
      );
    });
  });

  it("shows required validation error when location is not selected", async () => {
    renderForm();
    fireEvent.click(screen.getByRole("button", { name: /submit request/i }));
    await waitFor(() => {
      expect(screen.getByText(/select a location/i)).toBeInTheDocument();
    });
  });
});

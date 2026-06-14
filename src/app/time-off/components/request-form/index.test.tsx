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
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);

// start and end that produce 20 days (> 18 available for New York)
const farFuture = new Date(today);
farFuture.setDate(today.getDate() + 1);
const farFutureEnd = new Date(today);
farFutureEnd.setDate(today.getDate() + 20);

function fmt(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const tomorrowStr = fmt(tomorrow);
const dayAfterTomorrowStr = fmt(dayAfterTomorrow);
const yesterdayStr = fmt(yesterday);
const farFutureStr = fmt(farFuture);
const farFutureEndStr = fmt(farFutureEnd);

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

describe("RequestForm — days requested computed from dates", () => {
  it("shows computed days when both dates are selected", async () => {
    renderForm();
    fireEvent.change(screen.getByLabelText(/start date/i), {
      target: { value: tomorrowStr },
    });
    fireEvent.change(screen.getByLabelText(/end date/i), {
      target: { value: dayAfterTomorrowStr },
    });
    await waitFor(() => {
      expect(screen.getByText(/2 days/i)).toBeInTheDocument();
    });
  });

  it("shows placeholder text when no dates are selected", () => {
    renderForm();
    expect(screen.getByText(/select dates above/i)).toBeInTheDocument();
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

  it("shows refreshing badge when selected balance is refreshing", async () => {
    const refreshingBalances: TimeOffBalance[] = [
      {
        id: "b1",
        locationId: "new-york",
        location: "New York",
        availableDays: 18,
        pendingDays: 0,
        syncStatus: SyncStatus.Refreshing,
      },
    ];
    renderForm(refreshingBalances);
    fireEvent.change(screen.getByLabelText(/location/i), {
      target: { value: "new-york" },
    });
    await waitFor(() => {
      expect(screen.getAllByText(/refreshing/i).length).toBeGreaterThanOrEqual(1);
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
    fireEvent.click(screen.getByRole("button", { name: /submit request/i }));
    await waitFor(() => {
      expect(
        screen.getByText(/end date cannot be before start date/i),
      ).toBeInTheDocument();
    });
  });
});

describe("RequestForm — balance exceeded (computed from dates)", () => {
  it("shows balance exceeded message when computed days exceed available balance", async () => {
    // farFuture → farFutureEnd = 20 days > 18 available for New York
    renderForm();
    fireEvent.change(screen.getByLabelText(/location/i), {
      target: { value: "new-york" },
    });
    fireEvent.change(screen.getByLabelText(/start date/i), {
      target: { value: farFutureStr },
    });
    fireEvent.change(screen.getByLabelText(/end date/i), {
      target: { value: farFutureEndStr },
    });
    await waitFor(() => {
      expect(
        screen.getByText(/requested days exceed available balance/i),
      ).toBeInTheDocument();
    });
  });

  it("disables submit when computed days exceed available balance", async () => {
    renderForm();
    fireEvent.change(screen.getByLabelText(/location/i), {
      target: { value: "new-york" },
    });
    fireEvent.change(screen.getByLabelText(/start date/i), {
      target: { value: farFutureStr },
    });
    fireEvent.change(screen.getByLabelText(/end date/i), {
      target: { value: farFutureEndStr },
    });
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /submit request/i }),
      ).toBeDisabled();
    });
  });
});

describe("RequestForm — valid submission", () => {
  it("calls submit handler with locationId and computed daysRequested", async () => {
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
    fireEvent.click(screen.getByRole("button", { name: /submit request/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          locationId: "new-york",
          daysRequested: 2,
        }),
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

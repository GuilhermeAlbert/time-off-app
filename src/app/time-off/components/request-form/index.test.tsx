// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(cleanup);

import { RequestForm } from "./index";

describe("RequestForm", () => {
  it("renders all fields", () => {
    render(<RequestForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/days requested/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
  });

  it('renders submit button with "Submit Request"', () => {
    render(<RequestForm onSubmit={vi.fn()} />);
    expect(
      screen.getByRole("button", { name: /submit request/i }),
    ).toBeInTheDocument();
  });

  it("shows required validation errors when submitted empty", async () => {
    render(<RequestForm onSubmit={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /submit request/i }));
    await waitFor(() => {
      expect(screen.getByText(/location is required/i)).toBeInTheDocument();
    });
  });

  it("shows error when days requested is zero", async () => {
    render(<RequestForm onSubmit={vi.fn()} />);
    fireEvent.change(screen.getByLabelText(/location/i), {
      target: { value: "New York" },
    });
    fireEvent.change(screen.getByLabelText(/start date/i), {
      target: { value: "2026-07-01" },
    });
    fireEvent.change(screen.getByLabelText(/end date/i), {
      target: { value: "2026-07-05" },
    });
    fireEvent.change(screen.getByLabelText(/days requested/i), {
      target: { value: "0" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit request/i }));
    await waitFor(() => {
      expect(
        screen.getByText(/must be greater than zero/i),
      ).toBeInTheDocument();
    });
  });

  it("calls submit handler with valid values", async () => {
    const onSubmit = vi.fn();
    render(<RequestForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/location/i), {
      target: { value: "New York" },
    });
    fireEvent.change(screen.getByLabelText(/start date/i), {
      target: { value: "2026-07-01" },
    });
    fireEvent.change(screen.getByLabelText(/end date/i), {
      target: { value: "2026-07-05" },
    });
    fireEvent.change(screen.getByLabelText(/days requested/i), {
      target: { value: "5" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit request/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          location: "New York",
          daysRequested: 5,
        }),
        expect.anything(),
      );
    });
  });
});

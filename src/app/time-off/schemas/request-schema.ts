import { z } from "zod";

function todayLocalMidnight(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function parseLocalDate(value: string): Date {
  return new Date(value + "T00:00:00");
}

export const requestSchema = z
  .object({
    locationId: z.string().min(1, "Select a location"),
    startDate: z
      .string()
      .min(1, "Start date is required")
      .refine(
        (val) => parseLocalDate(val) >= todayLocalMidnight(),
        "Start date cannot be in the past",
      ),
    endDate: z
      .string()
      .min(1, "End date is required")
      .refine(
        (val) => parseLocalDate(val) >= todayLocalMidnight(),
        "End date cannot be in the past",
      ),
    daysRequested: z
      .number({ error: "Days requested is required" })
      .gt(0, "Requested days must be greater than zero"),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return parseLocalDate(data.endDate) >= parseLocalDate(data.startDate);
    },
    {
      message: "End date cannot be before start date",
      path: ["endDate"],
    },
  );

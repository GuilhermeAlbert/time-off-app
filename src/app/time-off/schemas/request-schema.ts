import { z } from "zod";

export const requestSchema = z.object({
  location: z.string().min(1, "Location is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  daysRequested: z
    .number({ error: "Days requested is required" })
    .gt(0, "Must be greater than zero"),
  notes: z.string().optional(),
});

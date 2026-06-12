"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { requestSchema } from "../../schemas/request-schema";
import type { TimeOffRequestFormValues } from "../../types/time-off-request-form-values";

type Props = {
  onSubmit: (values: TimeOffRequestFormValues) => void;
};

export function RequestForm({ onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TimeOffRequestFormValues>({
    resolver: zodResolver(requestSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="location">Location</label>
        <input id="location" {...register("location")} />
        {errors.location && <span>{errors.location.message}</span>}
      </div>

      <div>
        <label htmlFor="startDate">Start date</label>
        <input id="startDate" type="date" {...register("startDate")} />
        {errors.startDate && <span>{errors.startDate.message}</span>}
      </div>

      <div>
        <label htmlFor="endDate">End date</label>
        <input id="endDate" type="date" {...register("endDate")} />
        {errors.endDate && <span>{errors.endDate.message}</span>}
      </div>

      <div>
        <label htmlFor="daysRequested">Days requested</label>
        <input
          id="daysRequested"
          type="number"
          {...register("daysRequested", { valueAsNumber: true })}
        />
        {errors.daysRequested && <span>{errors.daysRequested.message}</span>}
      </div>

      <div>
        <label htmlFor="notes">Notes</label>
        <textarea id="notes" {...register("notes")} />
      </div>

      <button type="submit">Submit Request</button>
    </form>
  );
}

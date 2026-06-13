"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { requestSchema } from "../../schemas/request-schema";
import type { TimeOffRequestFormValues } from "../../types/time-off-request-form-values";

type Props = {
  onSubmit: (values: TimeOffRequestFormValues) => void;
};

const inputClass =
  "block w-full rounded-lg border border-[#F6F0E9] bg-white px-3 py-2 text-sm text-[#1C1A18] placeholder:text-zinc-400 focus:border-[#904209] focus:outline-none focus:ring-1 focus:ring-[#904209]";

const labelClass = "mb-1.5 block text-xs font-medium text-zinc-600";

export function RequestForm({ onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TimeOffRequestFormValues>({
    resolver: zodResolver(requestSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="location" className={labelClass}>
          Location
        </label>
        <input
          id="location"
          {...register("location")}
          className={inputClass}
          placeholder="e.g. New York"
        />
        {errors.location && (
          <p className="mt-1 text-xs text-red-500">{errors.location.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="startDate" className={labelClass}>
            Start date
          </label>
          <input
            id="startDate"
            type="date"
            {...register("startDate")}
            className={inputClass}
          />
          {errors.startDate && (
            <p className="mt-1 text-xs text-red-500">
              {errors.startDate.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="endDate" className={labelClass}>
            End date
          </label>
          <input
            id="endDate"
            type="date"
            {...register("endDate")}
            className={inputClass}
          />
          {errors.endDate && (
            <p className="mt-1 text-xs text-red-500">
              {errors.endDate.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="daysRequested" className={labelClass}>
          Days requested
        </label>
        <input
          id="daysRequested"
          type="number"
          {...register("daysRequested", { valueAsNumber: true })}
          className={inputClass}
          placeholder="3"
          min="1"
        />
        {errors.daysRequested && (
          <p className="mt-1 text-xs text-red-500">
            {errors.daysRequested.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="notes" className={labelClass}>
          Notes <span className="font-normal text-zinc-400">(optional)</span>
        </label>
        <textarea
          id="notes"
          {...register("notes")}
          rows={3}
          className="block w-full resize-none rounded-lg border border-[#F6F0E9] bg-white px-3 py-2 text-sm text-[#1C1A18] placeholder:text-zinc-400 focus:border-[#904209] focus:outline-none focus:ring-1 focus:ring-[#904209]"
          placeholder="Any additional context…"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-[#904209] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#7A3607] focus:outline-none focus:ring-2 focus:ring-[#904209] focus:ring-offset-2"
      >
        Submit Request
      </button>
    </form>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { SyncStatus } from "../../enums/sync-status";
import { requestSchema } from "../../schemas/request-schema";
import type { TimeOffBalance } from "../../types/time-off-balance";
import type { TimeOffRequestFormValues } from "../../types/time-off-request-form-values";

type Props = {
  balances: TimeOffBalance[];
  isLoadingBalances: boolean;
  onSubmit: (values: TimeOffRequestFormValues) => void;
};

const inputClass =
  "block w-full rounded-lg border border-[#F6F0E9] bg-white px-3 py-2 text-sm text-[#1C1A18] placeholder:text-zinc-400 focus:border-[#904209] focus:outline-none focus:ring-1 focus:ring-[#904209]";

const labelClass = "mb-1.5 block text-xs font-medium text-zinc-600";

export function RequestForm({ balances, isLoadingBalances, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TimeOffRequestFormValues>({
    resolver: zodResolver(requestSchema),
  });

  const selectedLocationId = useWatch({ control, name: "locationId" });
  const daysRequested = useWatch({ control, name: "daysRequested" });

  const selectedBalance = balances.find((b) => b.locationId === selectedLocationId);
  const balanceExceeded =
    selectedBalance !== undefined &&
    typeof daysRequested === "number" &&
    daysRequested > 0 &&
    daysRequested > selectedBalance.availableDays;

  const isStale = selectedBalance?.syncStatus === SyncStatus.Stale;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label htmlFor="locationId" className={labelClass}>
          Location
        </label>
        <select
          id="locationId"
          {...register("locationId")}
          className={inputClass}
          disabled={isLoadingBalances || balances.length === 0}
        >
          <option value="">
            {isLoadingBalances ? "Loading locations…" : "Select a location"}
          </option>
          {balances.map((b) => (
            <option key={b.locationId} value={b.locationId}>
              {b.location}
            </option>
          ))}
        </select>
        {errors.locationId && (
          <p className="mt-1 text-xs text-red-500">{errors.locationId.message}</p>
        )}

        {selectedBalance && (
          <div className="mt-2 rounded-md border border-[#F6F0E9] bg-[#FEFBF5] px-3 py-2 text-xs text-zinc-600">
            <span>
              Available: <strong>{selectedBalance.availableDays}</strong> day
              {selectedBalance.availableDays !== 1 ? "s" : ""}
            </span>
            {selectedBalance.pendingDays > 0 && (
              <span className="ml-3">
                Pending: <strong>{selectedBalance.pendingDays}</strong> day
                {selectedBalance.pendingDays !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        )}

        {isStale && (
          <p className="mt-1 text-xs text-amber-600">
            Balance is stale. HCM will re-check before accepting this request.
          </p>
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
        {balanceExceeded && !errors.daysRequested && (
          <p className="mt-1 text-xs text-red-500">
            Requested days exceed available balance for this location
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
        disabled={balanceExceeded || (balances.length === 0 && !isLoadingBalances)}
        className="w-full rounded-lg bg-[#904209] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#7A3607] focus:outline-none focus:ring-2 focus:ring-[#904209] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Submit Request
      </button>
    </form>
  );
}

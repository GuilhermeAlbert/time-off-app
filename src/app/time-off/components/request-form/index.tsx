"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { SyncStatus } from "../../enums/sync-status";
import { requestSchema } from "../../schemas/request-schema";
import type { TimeOffBalance } from "../../types/time-off-balance";
import type { TimeOffRequestFormValues } from "../../types/time-off-request-form-values";
import { SyncStatusBadge } from "../sync-status-badge";

type Props = {
  balances: TimeOffBalance[];
  isLoadingBalances: boolean;
  onSubmit: (values: TimeOffRequestFormValues) => void;
};

const inputClass =
  "block w-full rounded-lg border border-[#F6F0E9] bg-white px-3 py-2 text-sm text-[#1C1A18] placeholder:text-zinc-400 focus:border-[#904209] focus:outline-none focus:ring-1 focus:ring-[#904209]";

const labelClass = "mb-1.5 block text-xs font-medium text-zinc-600";

function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function computeDays(startDate: string, endDate: string): number | null {
  if (!startDate || !endDate) return null;
  const start = new Date(startDate + "T00:00:00");
  const end = new Date(endDate + "T00:00:00");
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
  const days =
    Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  return days > 0 ? days : null;
}

export function RequestForm({ balances, isLoadingBalances, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(requestSchema),
  });

  const selectedLocationId = useWatch({ control, name: "locationId" });
  const startDate = useWatch({ control, name: "startDate" });
  const endDate = useWatch({ control, name: "endDate" });

  const todayStr = toDateStr(new Date());
  const computedDays = computeDays(startDate ?? "", endDate ?? "");

  const selectedBalance = balances.find(
    (b) => b.locationId === selectedLocationId,
  );
  const balanceExceeded =
    selectedBalance !== undefined &&
    computedDays !== null &&
    computedDays > selectedBalance.availableDays;

  const isRefreshing = selectedBalance?.syncStatus === SyncStatus.Refreshing;
  const isStale = selectedBalance?.syncStatus === SyncStatus.Stale;

  // daysRequested is computed from dates and injected here, not entered by the user
  const handleFormSubmit = handleSubmit((rawValues) => {
    if (computedDays === null || computedDays <= 0) return;
    onSubmit({ ...rawValues, daysRequested: computedDays } as TimeOffRequestFormValues);
  });

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4" noValidate>
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
          <p className="mt-1 text-xs text-red-500">
            {errors.locationId.message as string}
          </p>
        )}

        {selectedBalance && (
          <div className="mt-2 rounded-md border border-[#F6F0E9] bg-[#FEFBF5] px-3 py-2 text-xs text-zinc-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span>
                  Available: <strong>{selectedBalance.availableDays}</strong> day
                  {selectedBalance.availableDays !== 1 ? "s" : ""}
                </span>
                {selectedBalance.pendingDays > 0 && (
                  <span>
                    Pending: <strong>{selectedBalance.pendingDays}</strong> day
                    {selectedBalance.pendingDays !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
              {isRefreshing && <SyncStatusBadge status={SyncStatus.Refreshing} />}
            </div>
          </div>
        )}

        {isRefreshing && (
          <p className="mt-1 text-xs text-zinc-500">
            Refreshing balance from HCM…
          </p>
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
            min={todayStr}
            {...register("startDate")}
            className={inputClass}
          />
          {errors.startDate && (
            <p className="mt-1 text-xs text-red-500">
              {errors.startDate.message as string}
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
            min={startDate || todayStr}
            {...register("endDate")}
            className={inputClass}
          />
          {errors.endDate && (
            <p className="mt-1 text-xs text-red-500">
              {errors.endDate.message as string}
            </p>
          )}
        </div>
      </div>

      <div>
        <p className={labelClass}>Days requested</p>
        <div
          aria-label="days requested"
          className="flex items-center gap-1.5 rounded-lg border border-[#F6F0E9] bg-[#F6F0E9] px-3 py-2 text-sm text-zinc-500"
        >
          {computedDays !== null ? (
            <span className="font-medium text-[#1C1A18]">
              {computedDays} day{computedDays !== 1 ? "s" : ""}
            </span>
          ) : (
            <span className="text-zinc-400">Select dates above</span>
          )}
        </div>
        {balanceExceeded && (
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
        disabled={
          balanceExceeded || (balances.length === 0 && !isLoadingBalances)
        }
        className="w-full rounded-lg bg-[#904209] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#7A3607] focus:outline-none focus:ring-2 focus:ring-[#904209] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Submit Request
      </button>
    </form>
  );
}

"use client";

import React, { Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTRPC } from "@/lib/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";

import { LoadingSkeleton } from "@hamilton/ui/components/skeleton/skeleton";
import { Button } from "@hamilton/ui/components/ui/button";
import {
  formatFlightDuration,
  getFlightTypeColor,
  getFlightTypeText,
} from "@hamilton/validators/lib/logbook";

function LogbookEntryContent({
  id,
  router,
}: {
  id: string;
  router: ReturnType<typeof useRouter>;
}) {
  const trpc = useTRPC();
  const { data: entry } = useSuspenseQuery(
    trpc.logbook.byID.queryOptions({ id }),
  );

  if (!entry) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <AlertCircle className="h-16 w-16 text-red-500" />
        <h2 className="mt-4 text-2xl font-bold">Flight Not Found</h2>
        <p className="mt-2 text-gray-600">
          The flight you're looking for doesn't exist or has been removed.
        </p>
        <Button className="mt-6" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 pt-4 sm:p-8 sm:pt-6">
      <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 drop-shadow-sm dark:text-white">
              {entry.route}
            </h1>
            <p className="mt-1 text-lg font-medium text-gray-500 dark:text-gray-300">
              {entry.aircraft} • {entry.tailNumber}
            </p>
            <p className="mt-1 text-base text-gray-400 dark:text-gray-400">
              {new Date(entry.date).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                {formatFlightDuration(entry.flightTime.total)}
              </span>
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold shadow"
                style={{
                  backgroundColor: `${getFlightTypeColor(entry.flightType)}20`,
                  color: getFlightTypeColor(entry.flightType),
                }}
              >
                {getFlightTypeText(entry.flightType)}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-900">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold tracking-wide text-blue-900 dark:text-blue-200">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-400" />{" "}
              Flight Time
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-extrabold text-green-700 drop-shadow dark:text-green-300">
                  {formatFlightDuration(entry.flightTime.pic)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  PIC
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-extrabold text-blue-700 drop-shadow dark:text-blue-300">
                  {formatFlightDuration(entry.flightTime.sic)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  SIC
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-extrabold text-purple-700 drop-shadow dark:text-purple-300">
                  {formatFlightDuration(entry.flightTime.solo)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Solo
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-extrabold text-pink-700 drop-shadow dark:text-pink-300">
                  {formatFlightDuration(entry.flightTime.dual)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Dual
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-900">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold tracking-wide text-gray-900 dark:text-gray-200">
              <span className="inline-block h-2 w-2 rounded-full bg-yellow-400" />{" "}
              Conditions
            </h2>
            <div className="space-y-3">
              <div className="flex flex-row items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Day
                </span>
                <span className="text-base text-gray-900 dark:text-gray-100">
                  {formatFlightDuration(entry.conditions.day)}
                </span>
              </div>
              <div className="flex flex-row items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Night
                </span>
                <span className="text-base text-gray-900 dark:text-gray-100">
                  {formatFlightDuration(entry.conditions.night)}
                </span>
              </div>
              <div className="flex flex-row items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Actual Instrument
                </span>
                <span className="text-base text-gray-900 dark:text-gray-100">
                  {formatFlightDuration(entry.conditions.actualInstrument)}
                </span>
              </div>
              <div className="flex flex-row items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Simulated Instrument
                </span>
                <span className="text-base text-gray-900 dark:text-gray-100">
                  {formatFlightDuration(entry.conditions.simulatedInstrument)}
                </span>
              </div>
              <div className="flex flex-row items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Cross Country
                </span>
                <span className="text-base text-gray-900 dark:text-gray-100">
                  {formatFlightDuration(entry.conditions.crossCountry)}
                </span>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-900 md:col-span-2">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold tracking-wide text-purple-900 dark:text-purple-200">
              <span className="inline-block h-2 w-2 rounded-full bg-purple-400" />{" "}
              Landings & Approaches
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-row items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Day Landings
                </span>
                <span className="text-base text-gray-900 dark:text-gray-100">
                  {entry.landings.day}
                </span>
              </div>
              <div className="flex flex-row items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Night Landings
                </span>
                <span className="text-base text-gray-900 dark:text-gray-100">
                  {entry.landings.night}
                </span>
              </div>
              <div className="flex flex-row items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Approaches
                </span>
                <span className="text-base text-gray-900 dark:text-gray-100">
                  {entry.approaches}
                </span>
              </div>
              <div className="flex flex-row items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Holds
                </span>
                <span className="text-base text-gray-900 dark:text-gray-100">
                  {entry.holds}
                </span>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-900 md:col-span-2">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold tracking-wide text-cyan-900 dark:text-cyan-200">
              <span className="inline-block h-2 w-2 rounded-full bg-cyan-400" />{" "}
              Departure & Arrival
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Departure Airport
                </span>
                <span className="text-base text-gray-900 dark:text-gray-100">
                  {entry.departure.airport}
                </span>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Departure Time
                </span>
                <span className="text-base text-gray-900 dark:text-gray-100">
                  {entry.departure.time}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Arrival Airport
                </span>
                <span className="text-base text-gray-900 dark:text-gray-100">
                  {entry.arrival.airport}
                </span>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Arrival Time
                </span>
                <span className="text-base text-gray-900 dark:text-gray-100">
                  {entry.arrival.time}
                </span>
              </div>
            </div>
          </div>
          {entry.instructor && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-900">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold tracking-wide text-emerald-900 dark:text-emerald-200">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />{" "}
                Instructor
              </h2>
              <span className="text-base text-gray-900 dark:text-gray-100">
                {entry.instructor}
              </span>
            </div>
          )}
          {entry.remarks && (
            <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-900 md:col-span-2">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold tracking-wide text-gray-900 dark:text-gray-200">
                <span className="inline-block h-2 w-2 rounded-full bg-gray-400" />{" "}
                Remarks
              </h2>
              <span className="leading-6 text-gray-700 dark:text-gray-100">
                {entry.remarks}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LogbookEntryPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  return (
    <Suspense
      fallback={
        <div className="p-4 pt-4 sm:p-8 sm:pt-6">
          <LoadingSkeleton />
        </div>
      }
    >
      <LogbookEntryContent id={id} router={router} />
    </Suspense>
  );
}

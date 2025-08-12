"use client";

import React, { Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTRPC } from "@/lib/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AlertCircle, Plane } from "lucide-react";

import { LoadingSkeleton } from "@hamilton/ui/components/skeleton/skeleton";
import { Button } from "@hamilton/ui/components/ui/button";
import {
  formatFlightDuration,
  getFlightTypeColor,
  getFlightTypeText,
} from "@hamilton/validators/lib/logbook";
import { formatDate } from "@hamilton/validators/shared/date";

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
      <div className="flex h-96 flex-col items-center justify-center bg-gray-50 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h2 className="mt-4 text-xl font-bold text-gray-900">
          Flight Not Found
        </h2>
        <p className="mt-2 text-gray-600">
          The flight you're looking for doesn't exist or may have been deleted.
        </p>
        <Button className="mt-6" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-b-2xl bg-white px-6 pb-2 pt-6 shadow">
          <div className="mb-4 flex flex-row items-center justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {entry.route}
              </h1>
              <p className="mt-1 text-lg text-gray-600">
                {entry.aircraft} • {entry.tailNumber}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-2xl font-bold text-blue-600">
                {formatFlightDuration(entry.flightTime.total)}
              </span>
              <span
                className="mt-2 rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  backgroundColor: `${getFlightTypeColor(entry.flightType)}20`,
                  color: getFlightTypeColor(entry.flightType),
                }}
              >
                {getFlightTypeText(entry.flightType)}
              </span>
            </div>
          </div>
          <div className="mb-6 flex flex-row items-center justify-between">
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-500">Departure</span>
              <span className="text-lg font-semibold text-gray-900">
                {entry.departure.time}
              </span>
              <span className="text-sm text-gray-600">
                {entry.departure.airport}
              </span>
            </div>
            <div className="flex flex-1 flex-col items-center">
              <Plane className="h-6 w-6 text-indigo-500" />
              <span className="mt-1 text-xs text-gray-500">
                {formatDate(entry.date)}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-500">Arrival</span>
              <span className="text-lg font-semibold text-gray-900">
                {entry.arrival.time}
              </span>
              <span className="text-sm text-gray-600">
                {entry.arrival.airport}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-xl bg-white px-6 py-4 shadow">
          <h2 className="mb-3 text-lg font-bold text-gray-900">Flight Time</h2>
          <div className="flex flex-row justify-between">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-green-600">
                {formatFlightDuration(entry.flightTime.pic)}
              </span>
              <span className="text-sm text-gray-500">PIC</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-blue-600">
                {formatFlightDuration(entry.flightTime.dual)}
              </span>
              <span className="text-sm text-gray-500">Dual</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-purple-600">
                {formatFlightDuration(entry.flightTime.solo)}
              </span>
              <span className="text-sm text-gray-500">Solo</span>
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-xl bg-white px-6 py-4 shadow">
          <h2 className="mb-3 text-lg font-bold text-gray-900">Conditions</h2>
          <div className="space-y-3">
            <div className="flex flex-row items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Day</span>
              <span className="text-base text-gray-900">
                {formatFlightDuration(entry.conditions.day)}
              </span>
            </div>
            <div className="flex flex-row items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Night</span>
              <span className="text-base text-gray-900">
                {formatFlightDuration(entry.conditions.night)}
              </span>
            </div>
            <div className="flex flex-row items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Actual Instrument
              </span>
              <span className="text-base text-gray-900">
                {formatFlightDuration(entry.conditions.actualInstrument)}
              </span>
            </div>
            <div className="flex flex-row items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Cross Country
              </span>
              <span className="text-base text-gray-900">
                {formatFlightDuration(entry.conditions.crossCountry)}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-xl bg-white px-6 py-4 shadow">
          <h2 className="mb-3 text-lg font-bold text-gray-900">
            Landings & Approaches
          </h2>
          <div className="space-y-3">
            <div className="flex flex-row items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Day Landings
              </span>
              <span className="text-base text-gray-900">
                {entry.landings.day}
              </span>
            </div>
            <div className="flex flex-row items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Night Landings
              </span>
              <span className="text-base text-gray-900">
                {entry.landings.night}
              </span>
            </div>
            <div className="flex flex-row items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Approaches
              </span>
              <span className="text-base text-gray-900">
                {entry.approaches}
              </span>
            </div>
            <div className="flex flex-row items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Holds</span>
              <span className="text-base text-gray-900">{entry.holds}</span>
            </div>
          </div>
        </div>
        {entry.instructor && (
          <div className="mt-4 rounded-xl bg-white px-6 py-4 shadow">
            <h2 className="mb-3 text-lg font-bold text-gray-900">Instructor</h2>
            <span className="text-base text-gray-900">{entry.instructor}</span>
          </div>
        )}
        {entry.remarks && (
          <div className="mb-6 mt-4 rounded-xl bg-white px-6 py-4 shadow">
            <h2 className="mb-3 text-lg font-bold text-gray-900">Remarks</h2>
            <span className="leading-6 text-gray-700">{entry.remarks}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LogbookEntryPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <LogbookEntryContent id={id} router={router} />
    </Suspense>
  );
}

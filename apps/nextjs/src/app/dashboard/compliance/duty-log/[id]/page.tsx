"use client";

import React, { Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTRPC } from "@/lib/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";

import { LoadingSkeleton } from "@hamilton/ui/components/skeleton/skeleton";
import { Badge } from "@hamilton/ui/components/ui/badge";
import { Button } from "@hamilton/ui/components/ui/button";

function DutyLogDetailContent({
  id,
  router,
}: {
  id: string;
  router: ReturnType<typeof useRouter>;
}) {
  const trpc = useTRPC();
  const { data: entry } = useSuspenseQuery(
    trpc.dutyLog.byID.queryOptions({ id }),
  );

  if (!entry) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <AlertCircle className="h-16 w-16 text-red-500" />
        <h2 className="mt-4 text-2xl font-bold">Duty Log Not Found</h2>
        <p className="mt-2 text-gray-600">
          The duty log you're looking for doesn't exist or has been removed.
        </p>
        <Button className="mt-6" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 pt-4 sm:p-8 sm:pt-6">
      <div className="mb-8 rounded-2xl border p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold capitalize tracking-tight text-gray-900 drop-shadow-sm dark:text-white">
              {entry.type.replace("-duty", "")} Duty
            </h1>
            <p className="mt-1 text-lg font-medium text-gray-500 dark:text-gray-300">
              {entry.description}
            </p>
            <p className="mt-1 text-base text-gray-400 dark:text-gray-400">
              {entry.startTime
                ? new Date(entry.startTime).toLocaleString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <span
                className="text-2xl font-bold text-blue-600 dark:text-blue-300"
                title={`Raw: ${entry.duration ?? "—"}`}
              >
                {typeof entry.duration === "number"
                  ? `${Math.floor(entry.duration)}h ${Math.round((entry.duration % 1) * 60)}m`
                  : "—"}
              </span>
              <Badge
                variant={entry.status === "completed" ? "default" : "secondary"}
              >
                {entry.status}
              </Badge>
            </div>
            {entry.location && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Location: {entry.location}
              </span>
            )}
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-xl border p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold tracking-wide text-blue-900 dark:text-blue-200">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-400" />{" "}
              Duty Info
            </h2>
            <div className="space-y-3">
              <div className="flex flex-row items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Start Time
                </span>
                <span className="text-base text-gray-900 dark:text-gray-100">
                  {entry.startTime
                    ? new Date(entry.startTime).toLocaleString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"}
                </span>
              </div>
              <div className="flex flex-row items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  End Time
                </span>
                <span className="text-base text-gray-900 dark:text-gray-100">
                  {entry.endTime
                    ? new Date(entry.endTime).toLocaleString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"}
                </span>
              </div>
              {entry.flightNumber && (
                <div className="flex flex-row items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Flight Number
                  </span>
                  <span className="text-base text-gray-900 dark:text-gray-100">
                    {entry.flightNumber}
                  </span>
                </div>
              )}
              {entry.aircraft && (
                <div className="flex flex-row items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Aircraft
                  </span>
                  <span className="text-base text-gray-900 dark:text-gray-100">
                    {entry.aircraft}
                  </span>
                </div>
              )}
              {entry.crew && (
                <div className="flex flex-row items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Crew
                  </span>
                  <span className="text-base text-gray-900 dark:text-gray-100">
                    {entry.crew}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="rounded-xl border p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold tracking-wide text-yellow-900 dark:text-yellow-200">
              <span className="inline-block h-2 w-2 rounded-full bg-yellow-400" />{" "}
              Details
            </h2>
            <div className="space-y-3">
              {entry.trainingType && (
                <div className="flex flex-row items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Training Type
                  </span>
                  <span className="text-base text-gray-900 dark:text-gray-100">
                    {entry.trainingType}
                  </span>
                </div>
              )}
              {entry.instructor && (
                <div className="flex flex-row items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Instructor
                  </span>
                  <span className="text-base text-gray-900 dark:text-gray-100">
                    {entry.instructor}
                  </span>
                </div>
              )}
              {entry.notes && (
                <div className="flex flex-row items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Notes
                  </span>
                  <span className="whitespace-pre-line text-base text-gray-900 dark:text-gray-100">
                    {entry.notes}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DutyLogDetailsPage() {
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
      <DutyLogDetailContent id={id} router={router} />
    </Suspense>
  );
}

"use client";

import React, { Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTRPC } from "@/lib/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";

import { LoadingSkeleton } from "@hamilton/ui/components/skeleton/skeleton";
import { Button } from "@hamilton/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@hamilton/ui/components/ui/card";
import {
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
    <div className="flex-1 space-y-6 p-4 pt-4 sm:p-8 sm:pt-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Flight Details
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            View flight log entry details
          </p>
        </div>
        {/* Optionally add an edit button here */}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-2">
              <CardTitle className="mb-1 text-3xl font-extrabold text-blue-900 dark:text-blue-200">
                {entry.route}
              </CardTitle>
              <div className="flex flex-row items-center gap-4 text-sm text-muted-foreground">
                <span>{entry.aircraft}</span>
                <span className="mx-1">•</span>
                <span>{entry.tailNumber}</span>
                <span className="mx-1">•</span>
                <span className="text-xs">
                  {entry.date.toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col">
                <span className="mb-1 text-xs font-medium text-muted-foreground">
                  Duration
                </span>
                <span className="text-3xl font-bold text-blue-600 dark:text-blue-300">
                  {entry.duration != null
                    ? (() => {
                        const hours = Math.floor(entry.duration);
                        const minutes = Math.round(
                          (entry.duration - hours) * 60,
                        );
                        return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
                      })()
                    : "—"}
                </span>
              </div>
              <span
                className="rounded-full bg-opacity-80 px-4 py-2 text-sm font-semibold shadow"
                style={{
                  backgroundColor: `${getFlightTypeColor(entry.flightType)}20`,
                  color: getFlightTypeColor(entry.flightType),
                }}
              >
                {getFlightTypeText(entry.flightType)}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold text-blue-900 dark:text-blue-100">
              Flight Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col items-center justify-center rounded-lg bg-green-50 p-3 dark:bg-green-900/30">
                <span className="mb-1 text-3xl font-extrabold text-green-700 dark:text-green-300">
                  {entry.flightTime.pic ?? "—"}
                </span>
                <span className="text-xs font-semibold tracking-wide text-green-700 dark:text-green-300">
                  PIC
                </span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-lg bg-blue-50 p-3 dark:bg-blue-900/30">
                <span className="mb-1 text-3xl font-extrabold text-blue-700 dark:text-blue-300">
                  {entry.flightTime.sic ?? "—"}
                </span>
                <span className="text-xs font-semibold tracking-wide text-blue-700 dark:text-blue-300">
                  SIC
                </span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-lg bg-purple-50 p-3 dark:bg-purple-900/30">
                <span className="mb-1 text-3xl font-extrabold text-purple-700 dark:text-purple-300">
                  {entry.flightTime.solo ?? "—"}
                </span>
                <span className="text-xs font-semibold tracking-wide text-purple-700 dark:text-purple-300">
                  Solo
                </span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-lg bg-pink-50 p-3 dark:bg-pink-900/30">
                <span className="mb-1 text-3xl font-extrabold text-pink-700 dark:text-pink-300">
                  {entry.flightTime.dual ?? "—"}
                </span>
                <span className="text-xs font-semibold tracking-wide text-pink-700 dark:text-pink-300">
                  Dual
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold text-blue-900 dark:text-blue-100">
              Conditions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Day
                </span>
                <span className="text-base font-semibold">
                  {entry.conditions.day ?? "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Night
                </span>
                <span className="text-base font-semibold">
                  {entry.conditions.night ?? "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Actual Instrument
                </span>
                <span className="text-base font-semibold">
                  {entry.conditions.actualInstrument ?? "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Simulated Instrument
                </span>
                <span className="text-base font-semibold">
                  {entry.conditions.simulatedInstrument ?? "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Cross Country
                </span>
                <span className="text-base font-semibold">
                  {entry.conditions.crossCountry ?? "—"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold text-blue-900 dark:text-blue-100">
              Landings & Approaches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Day Landings
                </span>
                <span className="text-base font-semibold">
                  {entry.landings.day}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Night Landings
                </span>
                <span className="text-base font-semibold">
                  {entry.landings.night}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Approaches
                </span>
                <span className="text-base font-semibold">
                  {entry.approaches}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Holds
                </span>
                <span className="text-base font-semibold">{entry.holds}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold text-blue-900 dark:text-blue-100">
              Departure & Arrival
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Departure Airport
                </span>
                <span className="text-base font-semibold">
                  {entry.departure.airport}
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  Departure Time
                </span>
                <span className="text-base font-semibold">
                  {entry.departure.time
                    ? entry.departure.time.toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Arrival Airport
                </span>
                <span className="text-base font-semibold">
                  {entry.arrival.airport}
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  Arrival Time
                </span>
                <span className="text-base font-semibold">
                  {entry.arrival.time
                    ? entry.arrival.time.toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        {entry.instructor && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold text-blue-900 dark:text-blue-100">
                Instructor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-base font-semibold">
                {entry.instructor}
              </span>
            </CardContent>
          </Card>
        )}
        {entry.remarks && (
          <Card className="md:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold text-blue-900 dark:text-blue-100">
                Remarks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="leading-6 text-gray-700 dark:text-gray-100">
                {entry.remarks}
              </span>
            </CardContent>
          </Card>
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

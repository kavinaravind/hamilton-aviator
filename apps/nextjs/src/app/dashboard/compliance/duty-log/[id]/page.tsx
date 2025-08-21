"use client";

import React, { Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTRPC } from "@/lib/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";

import { LoadingSkeleton } from "@hamilton/ui/components/skeleton/skeleton";
import { Badge } from "@hamilton/ui/components/ui/badge";
import { Button } from "@hamilton/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@hamilton/ui/components/ui/card";

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
    <div className="flex-1 space-y-6 p-4 pt-4 sm:p-8 sm:pt-6">
      <div className="flex flex-row flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold capitalize tracking-tight sm:text-3xl">
            Duty Log
          </h1>
          <p className="text-sm font-extralight text-muted-foreground sm:text-base">
            {entry.description}
          </p>
        </div>
        <div className="flex flex-row items-center gap-4">
          <span
            className="text-2xl font-bold text-blue-600 dark:text-blue-300"
            title={`Raw: ${entry.duration ?? "—"}`}
          >
            {typeof entry.duration === "number"
              ? `${Math.floor(entry.duration)}h${Math.round((entry.duration % 1) * 60) > 0 ? ` ${Math.round((entry.duration % 1) * 60)}m` : ""}`
              : "—"}
          </span>
          <Badge
            variant={entry.status === "completed" ? "default" : "secondary"}
          >
            {entry.status}
          </Badge>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="mb-1 text-3xl font-extrabold text-primary dark:text-blue-200">
              Duty Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Start Time
                </span>
                <span className="text-base font-semibold">
                  {entry.startTime
                    ? new Date(entry.startTime).toLocaleString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  End Time
                </span>
                <span className="text-base font-semibold">
                  {entry.endTime
                    ? new Date(entry.endTime).toLocaleString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"}
                </span>
              </div>
              {entry.flightNumber && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Flight Number
                  </span>
                  <span className="text-base font-semibold">
                    {entry.flightNumber}
                  </span>
                </div>
              )}
              {entry.aircraft && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Aircraft
                  </span>
                  <span className="text-base font-semibold">
                    {entry.aircraft}
                  </span>
                </div>
              )}
              {entry.crew && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Crew
                  </span>
                  <span className="text-base font-semibold">{entry.crew}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        {entry.location && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold text-primary dark:text-blue-100">
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-base font-semibold">{entry.location}</span>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold text-primary dark:text-blue-100">
              Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {entry.trainingType && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Training Type
                  </span>
                  <span className="text-base font-semibold">
                    {entry.trainingType}
                  </span>
                </div>
              )}
              {entry.instructor && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Instructor
                  </span>
                  <span className="text-base font-semibold">
                    {entry.instructor}
                  </span>
                </div>
              )}
              {entry.notes && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Notes
                  </span>
                  <span className="whitespace-pre-line text-base font-semibold">
                    {entry.notes}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
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

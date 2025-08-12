"use client";

import React, { Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTRPC } from "@/lib/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";

import { LoadingSkeleton } from "@hamilton/ui/components/skeleton/skeleton";
import { Badge } from "@hamilton/ui/components/ui/badge";
import { Button } from "@hamilton/ui/components/ui/button";
import { Card } from "@hamilton/ui/components/ui/card";

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
      <div className="flex h-96 flex-col items-center justify-center bg-gray-50 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h2 className="mt-4 text-xl font-bold text-gray-900">
          Duty Log Not Found
        </h2>
        <p className="mt-2 text-gray-600">
          The duty log you're looking for doesn't exist or may have been
          deleted.
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
        {" "}
        <Card className="p-6 shadow">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold capitalize text-gray-900">
                {entry.type.replace("-duty", "")} Duty
              </h1>
              <p className="mt-1 text-gray-600">{entry.description}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge
                variant={entry.status === "completed" ? "default" : "secondary"}
              >
                {entry.status}
              </Badge>
              {entry.location && (
                <span className="text-sm text-gray-500">
                  Location: {entry.location}
                </span>
              )}
            </div>
          </div>
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <div className="text-sm text-gray-500">Start Time</div>
              <div className="font-medium text-gray-900">{entry.startTime}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">End Time</div>
              <div className="font-medium text-gray-900">
                {entry.endTime || "—"}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Duration</div>
              <div className="font-medium text-gray-900">
                {entry.duration || "—"}
              </div>
            </div>
            {entry.crew && (
              <div>
                <div className="text-sm text-gray-500">Crew</div>
                <div className="font-medium text-gray-900">{entry.crew}</div>
              </div>
            )}
            {entry.aircraft && (
              <div>
                <div className="text-sm text-gray-500">Aircraft</div>
                <div className="font-medium text-gray-900">
                  {entry.aircraft}
                </div>
              </div>
            )}
            {entry.flightNumber && (
              <div>
                <div className="text-sm text-gray-500">Flight Number</div>
                <div className="font-medium text-gray-900">
                  {entry.flightNumber}
                </div>
              </div>
            )}
            {entry.instructor && (
              <div>
                <div className="text-sm text-gray-500">Instructor</div>
                <div className="font-medium text-gray-900">
                  {entry.instructor}
                </div>
              </div>
            )}
            {entry.trainingType && (
              <div>
                <div className="text-sm text-gray-500">Training Type</div>
                <div className="font-medium text-gray-900">
                  {entry.trainingType}
                </div>
              </div>
            )}
          </div>
          {entry.notes && (
            <div className="mt-4">
              <div className="mb-1 text-sm text-gray-500">Notes</div>
              <div className="whitespace-pre-line rounded bg-gray-50 p-3 text-gray-800">
                {entry.notes}
              </div>
            </div>
          )}
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
    <Suspense fallback={<LoadingSkeleton />}>
      <DutyLogDetailContent id={id} router={router} />
    </Suspense>
  );
}

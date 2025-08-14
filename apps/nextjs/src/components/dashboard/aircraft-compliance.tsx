"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useTRPC } from "@/lib/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Plane, Timer } from "lucide-react";

import { LoadingSkeleton } from "@hamilton/ui/components/skeleton/skeleton";

export function AircraftCompliance() {
  const trpc = useTRPC();

  function ComplianceData() {
    const { data: aircraftStatus } = useSuspenseQuery(
      trpc.dashboard.aircraftStatus.queryOptions(),
    );
    const { data: dutyCompliance } = useSuspenseQuery(
      trpc.dashboard.dutyCompliance.queryOptions(),
    );
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/dashboard/aircraft">
          <div className="rounded-lg border bg-card p-6 shadow-sm transition-colors hover:bg-accent">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Aircraft Fleet
                </p>
                <p className="text-2xl font-bold">{aircraftStatus.total}</p>
                <p className="text-xs text-muted-foreground">
                  {aircraftStatus.airworthy} airworthy,{" "}
                  {aircraftStatus.maintenance} in maintenance
                </p>
              </div>
              <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                <Plane className="h-5 w-5" />
              </div>
            </div>
          </div>
        </Link>
        <Link href="/dashboard/compliance/duty-log">
          <div className="rounded-lg border bg-card p-6 shadow-sm transition-colors hover:bg-accent">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Duty Hours
                </p>
                <p className="text-2xl font-bold">
                  {dutyCompliance.monthlyHours}
                </p>
                <p className="text-xs text-muted-foreground">
                  {dutyCompliance.remainingDuty} remaining
                </p>
              </div>
              <div className="rounded-full bg-red-100 p-2 text-red-600">
                <Timer className="h-5 w-5" />
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Aircraft & Compliance</h2>
      <Suspense fallback={<LoadingSkeleton />}>
        <ComplianceData />
      </Suspense>
    </div>
  );
}

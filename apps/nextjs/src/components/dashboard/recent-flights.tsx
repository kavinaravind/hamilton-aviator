"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useTRPC } from "@/lib/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronRight, Plane } from "lucide-react";

import { LoadingSkeleton } from "@hamilton/ui/components/skeleton/skeleton";
import { Button } from "@hamilton/ui/components/ui/button";
import { formatDate } from "@hamilton/validators/shared/date";

export function RecentFlights() {
  const trpc = useTRPC();

  function FlightList() {
    const { data: recentFlights } = useSuspenseQuery(
      trpc.dashboard.recentFlights.queryOptions(),
    );
    return (
      <div className="space-y-2">
        {recentFlights.map((flight) => (
          <Link key={flight.id} href={`/dashboard/logbook/${flight.id}`}>
            <div className="flex items-center space-x-4 rounded-lg border bg-card p-4 shadow-sm transition-colors hover:bg-accent">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                <Plane className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-semibold">{flight.route}</p>
                <p className="text-xs text-muted-foreground">
                  {flight.aircraft} • {flight.type}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(flight.date)}
                </p>
                <p className="text-sm font-bold text-blue-600">
                  {flight.duration}h
                </p>
              </div>
              <div className="flex items-center text-right">
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Recent Flights</h2>
        <Link href="/dashboard/logbook">
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      </div>
      <Suspense fallback={<LoadingSkeleton />}>
        <FlightList />
      </Suspense>
    </div>
  );
}

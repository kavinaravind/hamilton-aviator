"use client";

import React, { Suspense, useState } from "react";
import { useTRPC } from "@/lib/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Calendar, Clock, Plane, User } from "lucide-react";

import { StatCard } from "@hamilton/ui/components/app/stat-card";
import { LoadingSkeleton } from "@hamilton/ui/components/skeleton/skeleton";
import { Button } from "@hamilton/ui/components/ui/button";
import { Period } from "@hamilton/validators/lib/dashboard";

type FlightStatsPeriod = "week" | "month" | "year";

const periods: Period[] = [
  { id: "week", label: "7 Days" },
  { id: "month", label: "30 Days" },
  { id: "year", label: "1 Year" },
];

export function FlightStats() {
  const trpc = useTRPC();

  const [selectedPeriod, setSelectedPeriod] =
    useState<FlightStatsPeriod>("week");

  function StatsContent() {
    const { data: flightStats } = useSuspenseQuery(
      trpc.dashboard.flightStatistics.queryOptions({ period: selectedPeriod }),
    );
    return (
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          title="Total Time"
          value={flightStats.totalTime}
          subtitle="hours logged"
          icon={Clock}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="PIC Time"
          value={flightStats.pic}
          subtitle="pilot in command"
          icon={User}
          color="bg-green-100 text-green-600"
        />
        <StatCard
          title="Period Time"
          value={flightStats.periodTime}
          subtitle="this month"
          icon={Calendar}
          color="bg-yellow-100 text-yellow-600"
        />
        <StatCard
          title="Recent Flights"
          value={flightStats.periodFlights.toString()}
          subtitle="last 30 days"
          icon={Plane}
          color="bg-purple-100 text-purple-600"
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex space-x-2">
        {periods.map((period) => (
          <Button
            key={period.id}
            variant={selectedPeriod === period.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod(period.id as FlightStatsPeriod)}
          >
            {period.label}
          </Button>
        ))}
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Flight Statistics</h2>
        <Suspense
          fallback={
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {Array.from({ length: 4 }, (_, idx) => (
                <LoadingSkeleton key={idx} />
              ))}
            </div>
          }
        >
          <StatsContent />
        </Suspense>
      </div>
    </>
  );
}

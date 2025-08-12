"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { AircraftCompliance } from "@/components/dashboard/aircraft-compliance";
import { FlightStats } from "@/components/dashboard/flight-statistics";
import { MaintenanceAlerts } from "@/components/dashboard/maintenance-alerts";
import { RecentFlights } from "@/components/dashboard/recent-flights";

import { LoadingSkeleton } from "@hamilton/ui/components/skeleton/skeleton";
import { Button } from "@hamilton/ui/components/ui/button";
import { Period } from "@hamilton/validators/lib/dashboard";

const periods: Period[] = [
  { id: "week", label: "7 Days" },
  { id: "month", label: "30 Days" },
  { id: "year", label: "1 Year" },
];

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<
    "week" | "month" | "year"
  >("week");

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
          <p className="text-muted-foreground">
            Flight operations and compliance overview
          </p>
        </div>
        <Link href="/dashboard/compliance/duty-log/add">
          <Button>Quick Log</Button>
        </Link>
      </div>
      <div className="flex space-x-2">
        {periods.map((period) => (
          <Button
            key={period.id}
            variant={selectedPeriod === period.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod(period.id)}
          >
            {period.label}
          </Button>
        ))}
      </div>
      <Suspense fallback={<LoadingSkeleton />}>
        <FlightStats period={selectedPeriod} />
      </Suspense>
      <AircraftCompliance />
      <MaintenanceAlerts />
      <RecentFlights />
    </div>
  );
}

import React from "react";
import Link from "next/link";
import { AircraftCompliance } from "@/components/dashboard/aircraft-compliance";
import { FlightStats } from "@/components/dashboard/flight-statistics";
import { MaintenanceAlerts } from "@/components/dashboard/maintenance-alerts";
import { RecentFlights } from "@/components/dashboard/recent-flights";
import { Plus } from "lucide-react";

import { Button } from "@hamilton/ui/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mission Control</h1>
          <p className="font-extralight text-muted-foreground">
            Flight operations and compliance
          </p>
        </div>
        <Link
          href="/dashboard/compliance/duty-log/add"
          className="self-start sm:self-auto"
        >
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Log
          </Button>
        </Link>
      </div>
      <FlightStats />
      <AircraftCompliance />
      <MaintenanceAlerts />
      <RecentFlights />
    </div>
  );
}

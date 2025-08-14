"use client";

import React from "react";
import Link from "next/link";
import { AircraftCompliance } from "@/components/dashboard/aircraft-compliance";
import { FlightStats } from "@/components/dashboard/flight-statistics";
import { MaintenanceAlerts } from "@/components/dashboard/maintenance-alerts";
import { RecentFlights } from "@/components/dashboard/recent-flights";
import { authClient } from "@/lib/auth/client";

import { Button } from "@hamilton/ui/components/ui/button";

export default function DashboardPage() {
  const { data: session, isPending, error, refetch } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <span className="text-red-500">Error: {error.message}</span>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <span className="text-muted-foreground">You are not signed in.</span>
        <Link href="/auth/sign-in">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

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
      <FlightStats />
      <AircraftCompliance />
      <MaintenanceAlerts />
      <RecentFlights />
    </div>
  );
}

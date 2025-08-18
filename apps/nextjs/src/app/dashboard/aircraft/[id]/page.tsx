"use client";

import React, { Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTRPC } from "@/lib/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";

import { LoadingSkeleton } from "@hamilton/ui/components/skeleton/skeleton";
import { Button } from "@hamilton/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@hamilton/ui/components/ui/card";
import {
  getStatusColor,
  getStatusText,
} from "@hamilton/validators/lib/aircraft";
import { formatDate } from "@hamilton/validators/shared/date";

function AircraftDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const trpc = useTRPC();
  const { data: aircraft } = useSuspenseQuery(
    trpc.aircraft.byID.queryOptions({ id }),
  );

  if (!aircraft) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <AlertTriangle className="h-16 w-16 text-red-500" />
        <h2 className="mt-4 text-2xl font-bold">Aircraft Not Found</h2>
        <p className="mt-2 text-gray-600">
          The aircraft you're looking for doesn't exist or has been removed.
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
            Aircraft Details
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            View aircraft information, status, and history
          </p>
        </div>
        {/* Optionally add an edit button here */}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{aircraft.tailNumber}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {aircraft.year} {aircraft.make} {aircraft.model}
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-3 w-3 rounded-full border border-gray-300 shadow dark:border-gray-600"
                style={{ backgroundColor: getStatusColor(aircraft.status) }}
              />
              <span
                className="text-base font-bold tracking-wide"
                style={{ color: getStatusColor(aircraft.status) }}
              >
                {getStatusText(aircraft.status)}
              </span>
              <span
                className={`ml-2 rounded-full px-3 py-1 text-xs font-semibold shadow ${aircraft.ownership === "owned" ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200" : "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200"}`}
              >
                {aircraft.ownership === "owned" ? "Owned" : "Rental"}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Flight Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {aircraft.totalTime}
                </div>
                <div className="text-xs text-muted-foreground">Total Hours</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {aircraft.engine.totalTime}
                </div>
                <div className="text-xs text-muted-foreground">
                  Engine Hours
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {aircraft.propeller.totalTime}
                </div>
                <div className="text-xs text-muted-foreground">
                  Propeller Hours
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Engine & Propeller
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-medium text-muted-foreground">
                  Engine
                </div>
                <div className="text-base font-semibold">
                  {aircraft.engine.make} {aircraft.engine.model}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground">
                  Propeller
                </div>
                <div className="text-base font-semibold">
                  {aircraft.propeller.make} {aircraft.propeller.model}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Annual Due
                </span>
                <span className="text-base font-semibold">
                  {formatDate(aircraft.annualDue)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Last Maintenance
                </span>
                <span className="text-base font-semibold">
                  {formatDate(aircraft.lastMaintenance)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Insurance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Company
                </span>
                <span className="text-base font-semibold">
                  {aircraft.insurance.company}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Policy Number
                </span>
                <span className="text-base font-semibold">
                  {aircraft.insurance.policyNumber}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Expires
                </span>
                <span className="text-base font-semibold">
                  {formatDate(aircraft.insurance.expires)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Registration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Category
                </span>
                <span className="text-base font-semibold">
                  {aircraft.registration.category}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Class
                </span>
                <span className="text-base font-semibold">
                  {aircraft.registration.class}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Expires
                </span>
                <span className="text-base font-semibold">
                  {formatDate(aircraft.registration.expires)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AircraftDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-4 pt-4 sm:p-8 sm:pt-6">
          <LoadingSkeleton />
        </div>
      }
    >
      <AircraftDetailsContent />
    </Suspense>
  );
}

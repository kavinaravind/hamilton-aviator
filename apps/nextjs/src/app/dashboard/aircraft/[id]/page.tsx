"use client";

import React, { Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTRPC } from "@/lib/trpc/react";
import { formatDate } from "@/lib/util";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";

import { LoadingSkeleton } from "@hamilton/ui/components/skeleton/skeleton";
import { Button } from "@hamilton/ui/components/ui/button";
import {
  getStatusColor,
  getStatusText,
} from "@hamilton/validators/lib/aircraft";

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
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-gray-200 p-8 shadow-lg md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 drop-shadow-sm">
              {aircraft.tailNumber}
            </h1>
            <p className="mt-1 text-lg font-medium text-gray-500">
              {aircraft.year} {aircraft.make} {aircraft.model}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-3 w-3 rounded-full border border-gray-300 shadow"
                style={{ backgroundColor: getStatusColor(aircraft.status) }}
              />
              <span
                className="text-base font-bold tracking-wide"
                style={{ color: getStatusColor(aircraft.status) }}
              >
                {getStatusText(aircraft.status)}
              </span>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold shadow ${aircraft.ownership === "owned" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}
            >
              {aircraft.ownership === "owned" ? "Owned" : "Rental"}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white/80 p-6 shadow-md backdrop-blur-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold tracking-wide text-blue-900">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-400" />{" "}
              Flight Time
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-extrabold text-blue-700 drop-shadow">
                  {aircraft.totalTime}
                </div>
                <div className="text-xs text-gray-500">Total Hours</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-extrabold text-green-700 drop-shadow">
                  {aircraft.engine.totalTime}
                </div>
                <div className="text-xs text-gray-500">Engine Hours</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-extrabold text-purple-700 drop-shadow">
                  {aircraft.propeller.totalTime}
                </div>
                <div className="text-xs text-gray-500">Propeller Hours</div>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white/80 p-6 shadow-md backdrop-blur-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold tracking-wide text-gray-900">
              <span className="inline-block h-2 w-2 rounded-full bg-gray-400" />{" "}
              Engine & Propeller
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-medium text-gray-500">Engine</div>
                <div className="text-base font-semibold text-gray-900">
                  {aircraft.engine.make} {aircraft.engine.model}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500">
                  Propeller
                </div>
                <div className="text-base font-semibold text-gray-900">
                  {aircraft.propeller.make} {aircraft.propeller.model}
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white/80 p-6 shadow-md backdrop-blur-sm md:col-span-2">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold tracking-wide text-yellow-900">
              <span className="inline-block h-2 w-2 rounded-full bg-yellow-400" />{" "}
              Maintenance
            </h2>
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="flex-1">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">
                    Annual Due
                  </span>
                  <span className="text-base font-semibold text-gray-900">
                    {formatDate(aircraft.annualDue)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">
                    Last Maintenance
                  </span>
                  <span className="text-base font-semibold text-gray-900">
                    {formatDate(aircraft.lastMaintenance)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white/80 p-6 shadow-md backdrop-blur-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold tracking-wide text-sky-900">
              <span className="inline-block h-2 w-2 rounded-full bg-sky-400" />{" "}
              Insurance
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">
                  Company
                </span>
                <span className="text-base font-semibold text-gray-900">
                  {aircraft.insurance.company}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">
                  Policy Number
                </span>
                <span className="text-base font-semibold text-gray-900">
                  {aircraft.insurance.policyNumber}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">
                  Expires
                </span>
                <span className="text-base font-semibold text-gray-900">
                  {formatDate(aircraft.insurance.expires)}
                </span>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white/80 p-6 shadow-md backdrop-blur-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold tracking-wide text-emerald-900">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />{" "}
              Registration
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">
                  Category
                </span>
                <span className="text-base font-semibold text-gray-900">
                  {aircraft.registration.category}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Class</span>
                <span className="text-base font-semibold text-gray-900">
                  {aircraft.registration.class}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">
                  Expires
                </span>
                <span className="text-base font-semibold text-gray-900">
                  {formatDate(aircraft.registration.expires)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AircraftDetailsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <AircraftDetailsContent />
    </Suspense>
  );
}

"use client";

import type { DetailedAircraft } from "@/lib/aircraft";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { getStatusColor, getStatusText } from "@/lib/aircraft";
import { formatDate } from "@/lib/util";
import { AlertTriangle } from "lucide-react";

import { Button } from "@hamilton/ui/components/ui/button";

const Aircrafts: DetailedAircraft[] = [
  {
    id: "1",
    tailNumber: "N123AB",
    make: "Cessna",
    model: "172",
    year: "2018",
    status: "airworthy",
    ownership: "owned",
    totalTime: "1,247.5",
    engine: {
      make: "Lycoming",
      model: "O-360-A4M",
      totalTime: "1,247.5",
    },
    propeller: {
      make: "McCauley",
      model: "1C160/DTM7557",
      totalTime: "1,247.5",
    },
    annualDue: "2025-03-15",
    lastMaintenance: "2024-12-01",
    insurance: {
      company: "Aviation Insurance Corp",
      expires: "2025-06-30",
      policyNumber: "AIC-2024-789456",
    },
    registration: {
      expires: "2026-01-31",
      category: "Normal",
      class: "Airplane",
    },
  },
  {
    id: "2",
    tailNumber: "N456CD",
    make: "Piper",
    model: "PA-28",
    year: "2015",
    status: "maintenance-soon",
    ownership: "rented",
    totalTime: "2,156.8",
    engine: {
      make: "Lycoming",
      model: "O-320-D2A",
      totalTime: "2,156.8",
    },
    propeller: {
      make: "Sensenich",
      model: "74DM6-0-60",
      totalTime: "2,156.8",
    },
    annualDue: "2025-02-28",
    lastMaintenance: "2024-11-15",
    insurance: {
      company: "Pilot Insurance",
      expires: "2025-05-15",
      policyNumber: "PI-2024-123789",
    },
    registration: {
      expires: "2025-12-31",
      category: "Normal",
      class: "Airplane",
    },
  },
  {
    id: "3",
    tailNumber: "N789EF",
    make: "Cessna",
    model: "172",
    year: "2012",
    status: "maintenance-due",
    ownership: "owned",
    totalTime: "3,892.1",
    engine: {
      make: "Lycoming",
      model: "O-360-A4M",
      totalTime: "3,892.1",
    },
    propeller: {
      make: "McCauley",
      model: "1C160/DTM7557",
      totalTime: "3,892.1",
    },
    annualDue: "2024-12-20",
    lastMaintenance: "2024-06-10",
    insurance: {
      company: "Sky Insurance",
      expires: "2025-04-01",
      policyNumber: "SKY-2024-456123",
    },
    registration: {
      expires: "2025-11-30",
      category: "Normal",
      class: "Airplane",
    },
  },
  {
    id: "4",
    tailNumber: "N321GH",
    make: "Piper",
    model: "PA-34",
    year: "2020",
    status: "airworthy",
    ownership: "rented",
    totalTime: "856.3",
    engine: {
      make: "Continental",
      model: "TSIO-360-KB",
      totalTime: "856.3",
    },
    propeller: {
      make: "Hartzell",
      model: "HC-C2YK-1BF",
      totalTime: "856.3",
    },
    annualDue: "2025-08-12",
    lastMaintenance: "2024-10-05",
    insurance: {
      company: "Falcon Insurance",
      expires: "2025-09-20",
      policyNumber: "FAL-2024-987654",
    },
    registration: {
      expires: "2026-07-31",
      category: "Normal",
      class: "Airplane",
    },
  },
];

export default function AircraftDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const aircraft = Aircrafts.find((a) => a.id === id);

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
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 rounded-xl border bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            {aircraft.tailNumber}
          </h1>
          <p className="mt-1 text-lg text-gray-500">
            {aircraft.year} {aircraft.make} {aircraft.model}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: getStatusColor(aircraft.status) }}
            />
            <span
              className="text-base font-semibold"
              style={{ color: getStatusColor(aircraft.status) }}
            >
              {getStatusText(aircraft.status)}
            </span>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${aircraft.ownership === "owned" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}
          >
            {aircraft.ownership === "owned" ? "Owned" : "Rental"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Flight Time
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {aircraft.totalTime}
              </div>
              <div className="text-sm text-gray-500">Total Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {aircraft.engine.totalTime}
              </div>
              <div className="text-sm text-gray-500">Engine Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {aircraft.propeller.totalTime}
              </div>
              <div className="text-sm text-gray-500">Propeller Hours</div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Engine & Propeller
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-600">Engine</div>
              <div className="text-base text-gray-900">
                {aircraft.engine.make} {aircraft.engine.model}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">Propeller</div>
              <div className="text-base text-gray-900">
                {aircraft.propeller.make} {aircraft.propeller.model}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm md:col-span-2">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Maintenance
          </h2>
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="flex-1">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Annual Due
                </span>
                <span className="text-base text-gray-900">
                  {formatDate(aircraft.annualDue)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Last Maintenance
                </span>
                <span className="text-base text-gray-900">
                  {formatDate(aircraft.lastMaintenance)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Insurance
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Company</span>
              <span className="text-base text-gray-900">
                {aircraft.insurance.company}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Policy Number
              </span>
              <span className="text-base text-gray-900">
                {aircraft.insurance.policyNumber}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Expires</span>
              <span className="text-base text-gray-900">
                {formatDate(aircraft.insurance.expires)}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Registration
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Category
              </span>
              <span className="text-base text-gray-900">
                {aircraft.registration.category}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Class</span>
              <span className="text-base text-gray-900">
                {aircraft.registration.class}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Expires</span>
              <span className="text-base text-gray-900">
                {formatDate(aircraft.registration.expires)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

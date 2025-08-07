"use client";

import type { Aircraft, AircraftFilter } from "@/lib/dashboard";
import React, { useState } from "react";
import Link from "next/link";
import { formatDate, getStatusColor } from "@/lib/dashboard";
import {
  AlertTriangle,
  CheckCircle,
  Filter,
  Plane,
  Plus,
  Search,
  Wrench,
} from "lucide-react";

import { Badge } from "@hamilton/ui/components/ui/badge";
import { Button } from "@hamilton/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@hamilton/ui/components/ui/card";
import { Input } from "@hamilton/ui/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@hamilton/ui/components/ui/tabs";

// Mock data - in real app, this would come from APIs
const aircraftData: Aircraft[] = [
  {
    id: "1",
    tailNumber: "N123AB",
    make: "Cessna",
    model: "172",
    year: 2018,
    status: "airworthy",
    ownership: "owned",
    location: "KLAX",
    totalTime: 1247.3,
    lastInspection: "2025-07-15",
    nextInspection: "2025-08-15",
    inspectionType: "100-Hour",
    hoursToInspection: 7.8,
  },
  {
    id: "2",
    tailNumber: "N456CD",
    make: "Piper",
    model: "Cherokee",
    year: 2020,
    status: "maintenance-due",
    ownership: "rented",
    location: "KPHX",
    totalTime: 892.1,
    lastInspection: "2024-12-20",
    nextInspection: "2025-09-20",
    inspectionType: "Annual",
    daysToInspection: 45,
  },
  {
    id: "3",
    tailNumber: "N789EF",
    make: "Cessna",
    model: "182",
    year: 2019,
    status: "maintenance-soon",
    ownership: "owned",
    location: "KLAS",
    totalTime: 567.2,
    lastInspection: "2025-06-01",
    nextInspection: "2025-08-20",
    inspectionType: "100-Hour",
    hoursToInspection: 15.3,
  },
];

const filterOptions: AircraftFilter[] = [
  { id: "all", label: "All Aircraft", count: aircraftData.length },
  {
    id: "airworthy",
    label: "Airworthy",
    count: aircraftData.filter((a) => a.status === "airworthy").length,
  },
  {
    id: "maintenance",
    label: "Maintenance",
    count: aircraftData.filter((a) => a.status.includes("maintenance")).length,
  },
];

interface AircraftCardProps {
  aircraft: Aircraft;
}

function AircraftCard({ aircraft }: AircraftCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "airworthy":
        return CheckCircle;
      case "maintenance-soon":
        return AlertTriangle;
      case "maintenance-due":
        return Wrench;
      default:
        return AlertTriangle;
    }
  };

  const StatusIcon = getStatusIcon(aircraft.status);

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{aircraft.tailNumber}</CardTitle>
          <Badge
            variant={
              aircraft.status === "airworthy" ? "default" : "destructive"
            }
            className={getStatusColor(aircraft.status)}
          >
            <StatusIcon className="mr-1 h-3 w-3" />
            {aircraft.status.replace("-", " ")}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {aircraft.year} {aircraft.make} {aircraft.model}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Location</p>
            <p className="font-medium">{aircraft.location}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total Time</p>
            <p className="font-medium">{aircraft.totalTime}h</p>
          </div>
          <div>
            <p className="text-muted-foreground">Ownership</p>
            <p className="font-medium capitalize">{aircraft.ownership}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Next Inspection</p>
            <p className="font-medium">{aircraft.inspectionType}</p>
          </div>
        </div>

        {aircraft.status !== "airworthy" && (
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">
                Due in{" "}
                {aircraft.hoursToInspection
                  ? `${aircraft.hoursToInspection} hours`
                  : `${aircraft.daysToInspection} days`}
              </span>
            </div>
          </div>
        )}

        <div className="flex space-x-2 pt-2">
          <Link href={`/dashboard/aircraft/${aircraft.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </Link>
          <Link
            href={`/dashboard/aircraft/${aircraft.id}/edit`}
            className="flex-1"
          >
            <Button size="sm" className="w-full">
              Edit
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AircraftPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const filteredAircraft = aircraftData.filter((aircraft) => {
    const matchesSearch =
      aircraft.tailNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${aircraft.make} ${aircraft.model}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "airworthy" && aircraft.status === "airworthy") ||
      (selectedFilter === "maintenance" &&
        aircraft.status.includes("maintenance"));

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Aircraft</h1>
          <p className="text-muted-foreground">
            Manage your aircraft fleet and maintenance schedules
          </p>
        </div>
        <Link href="/dashboard/aircraft/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Aircraft
          </Button>
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search aircraft..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Tabs
          value={selectedFilter}
          onValueChange={setSelectedFilter}
          className="w-auto"
        >
          <TabsList>
            {filterOptions.map((filter) => (
              <TabsTrigger
                key={filter.id}
                value={filter.id}
                className="flex items-center space-x-2"
              >
                <span>{filter.label}</span>
                <Badge variant="secondary" className="ml-2">
                  {filter.count}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Aircraft Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAircraft.map((aircraft) => (
          <AircraftCard key={aircraft.id} aircraft={aircraft} />
        ))}
      </div>

      {filteredAircraft.length === 0 && (
        <div className="py-12 text-center">
          <Plane className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No aircraft found</h3>
          <p className="text-muted-foreground">
            {searchQuery || selectedFilter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "Get started by adding your first aircraft"}
          </p>
          {!searchQuery && selectedFilter === "all" && (
            <Link href="/dashboard/aircraft/add" className="mt-4 inline-block">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Aircraft
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

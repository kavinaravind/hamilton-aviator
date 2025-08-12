"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useTRPC } from "@/lib/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Plane, Search } from "lucide-react";

import type {
  Aircraft,
  AircraftFilter,
} from "@hamilton/validators/lib/aircraft";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@hamilton/ui/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@hamilton/ui/components/ui/tabs";
import {
  getStatusColor,
  getStatusIcon,
} from "@hamilton/validators/lib/aircraft";

function getFilterOptions(aircrafts: Aircraft[]): AircraftFilter[] {
  return [
    { id: "all", label: "All Aircraft", count: aircrafts.length },
    {
      id: "airworthy",
      label: "Airworthy",
      count: aircrafts.filter((a) => a.status === "airworthy").length,
    },
    {
      id: "maintenance",
      label: "Maintenance",
      count: aircrafts.filter((a) => a.status.includes("maintenance")).length,
    },
  ];
}

function AircraftCard({ aircraft }: { aircraft: Aircraft }) {
  const StatusIcon = getStatusIcon(aircraft.status);
  return (
    <Card className="flex min-h-[220px] flex-1 flex-col transition-shadow hover:shadow-md">
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
          {aircraft.make} {aircraft.model}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Ownership</p>
            <p className="font-medium capitalize">{aircraft.ownership}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Status</p>
            <p className="font-medium capitalize">
              {aircraft.status.replace("-", " ")}
            </p>
          </div>
        </div>
        <div className="flex pt-2">
          <Link href={`/dashboard/aircraft/${aircraft.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AircraftPage() {
  const trpc = useTRPC();
  const { data: aircrafts } = useSuspenseQuery(
    trpc.aircraft.all.queryOptions(),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  const filterOptions = getFilterOptions(aircrafts);

  const filteredAircraft = aircrafts.filter((aircraft) => {
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
    <Suspense
      fallback={
        <div className="p-8 text-center text-muted-foreground">
          Loading aircraft...
        </div>
      }
    >
      <div className="flex-1 space-y-6 p-4 pt-4 sm:p-8 sm:pt-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              My Aircrafts
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              View your aircraft fleet and maintenance schedules
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full flex-1 sm:max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search aircraft..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10"
            />
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:space-x-2">
            <Tabs
              value={selectedFilter}
              onValueChange={setSelectedFilter}
              className="w-full sm:w-auto"
            >
              <TabsList className="flex w-full flex-row flex-wrap gap-1 sm:w-auto">
                {filterOptions.map((filter) => (
                  <TabsTrigger
                    key={filter.id}
                    value={filter.id}
                    className="flex min-w-[100px] flex-1 items-center space-x-2 sm:min-w-0"
                  >
                    <span>{filter.label}</span>
                    <Badge variant="secondary" className="ml-2">
                      {filter.count}
                    </Badge>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <Tabs
              value={viewMode}
              onValueChange={(value) => setViewMode(value as "cards" | "table")}
              className="w-full sm:w-auto"
            >
              <TabsList className="flex w-full flex-row gap-1 sm:w-auto">
                <TabsTrigger
                  value="cards"
                  className="min-w-[80px] flex-1 sm:min-w-0"
                >
                  Cards
                </TabsTrigger>
                <TabsTrigger
                  value="table"
                  className="min-w-[80px] flex-1 sm:min-w-0"
                >
                  Table
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        {viewMode === "cards" ? (
          <div className="grid grid-cols-1 gap-3 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAircraft.map((aircraft) => (
              <div className="flex w-full" key={aircraft.id}>
                <AircraftCard aircraft={aircraft} />
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg">
            <Card className="min-w-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tail #</TableHead>
                    <TableHead>Make</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ownership</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAircraft.map((aircraft) => {
                    const StatusIcon = getStatusIcon(aircraft.status);
                    return (
                      <TableRow key={aircraft.id}>
                        <TableCell>{aircraft.tailNumber}</TableCell>
                        <TableCell>{aircraft.make}</TableCell>
                        <TableCell>{aircraft.model}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              aircraft.status === "airworthy"
                                ? "default"
                                : "destructive"
                            }
                            className={getStatusColor(aircraft.status)}
                          >
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {aircraft.status.replace("-", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="capitalize">
                          {aircraft.ownership}
                        </TableCell>
                        <TableCell>
                          <Link href={`/dashboard/aircraft/${aircraft.id}`}>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          </div>
        )}
        {filteredAircraft.length === 0 && (
          <div className="py-12 text-center">
            <Plane className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No aircraft found</h3>
            <p className="text-muted-foreground">
              {searchQuery || selectedFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No aircraft in your fleet."}
            </p>
          </div>
        )}
      </div>
    </Suspense>
  );
}

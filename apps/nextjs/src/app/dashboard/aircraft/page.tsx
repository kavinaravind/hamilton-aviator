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
import { LoadingSkeleton } from "@hamilton/ui/components/skeleton/skeleton";
import { Badge } from "@hamilton/ui/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@hamilton/ui/components/ui/card";
import { Input } from "@hamilton/ui/components/ui/input";
import { ScrollArea, ScrollBar } from "@hamilton/ui/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@hamilton/ui/components/ui/select";
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
    <Link href={`/dashboard/aircraft/${aircraft.id}`} className="flex-1">
      <Card className="flex min-h-[220px] flex-1 cursor-pointer flex-col transition-shadow hover:shadow-md">
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
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Ownership</p>
              <p className="font-medium capitalize">{aircraft.ownership}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Year</p>
              <p className="font-medium">{aircraft.year}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Engine</p>
              <p className="font-medium">
                {aircraft.engine?.make} {aircraft.engine?.model}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Annual Due</p>
              <p className="font-medium">{aircraft.annualDue}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Insurance</p>
              <p className="font-medium">{aircraft.insurance?.company}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function AircraftPage() {
  const trpc = useTRPC();

  function AircraftData() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilter, setSelectedFilter] = useState<string>("all");
    const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

    const { data: aircrafts } = useSuspenseQuery(
      trpc.aircraft.all.queryOptions(),
    );

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
      <>
        <div className="flex w-full flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search aircraft..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10"
            />
          </div>
          <div className="flex w-full min-w-0 flex-col gap-2 lg:w-auto lg:flex-row lg:items-center lg:space-x-2">
            <div className="block w-full lg:hidden">
              <Select
                value={selectedFilter}
                onValueChange={setSelectedFilter}
                defaultValue={selectedFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duty type" />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.map((filter) => (
                    <SelectItem key={filter.id} value={filter.id}>
                      <span className="flex w-full items-center justify-between">
                        <span>{filter.label}</span>
                        <Badge variant="secondary" className="ml-2">
                          {filter.count}
                        </Badge>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="hidden w-full lg:block lg:w-auto">
              <Tabs
                value={selectedFilter}
                onValueChange={setSelectedFilter}
                className="w-full lg:w-auto"
              >
                <TabsList className="flex w-full">
                  {filterOptions.map((filter) => (
                    <TabsTrigger
                      key={filter.id}
                      value={filter.id}
                      className="flex w-full flex-1 items-center justify-center space-x-1"
                    >
                      <span>{filter.label}</span>
                      <Badge variant="secondary">{filter.count}</Badge>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            <Tabs
              value={viewMode}
              onValueChange={(value) => setViewMode(value as "cards" | "table")}
              className="w-full lg:w-auto"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="cards" className="w-full">
                  Cards
                </TabsTrigger>
                <TabsTrigger value="table" className="w-full">
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
          <Card className="flex">
            <ScrollArea className="w-1 flex-1">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tail #</TableHead>
                    <TableHead>Make</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ownership</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Engine</TableHead>
                    <TableHead>Annual Due</TableHead>
                    <TableHead>Insurance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAircraft.map((aircraft) => {
                    const StatusIcon = getStatusIcon(aircraft.status);
                    return (
                      <Link
                        href={`/dashboard/aircraft/${aircraft.id}`}
                        key={aircraft.id}
                        className="contents"
                      >
                        <TableRow className="cursor-pointer transition-colors hover:bg-accent">
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
                          <TableCell>{aircraft.year}</TableCell>
                          <TableCell>
                            {aircraft.engine?.make} {aircraft.engine?.model}
                          </TableCell>
                          <TableCell>{aircraft.annualDue}</TableCell>
                          <TableCell>{aircraft.insurance?.company}</TableCell>
                        </TableRow>
                      </Link>
                    );
                  })}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" className="w-full" />
            </ScrollArea>
          </Card>
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
      </>
    );
  }

  return (
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
      <Suspense fallback={<LoadingSkeleton />}>
        <AircraftData />
      </Suspense>
    </div>
  );
}

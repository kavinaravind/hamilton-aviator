"use client";

import type { LogEntry, LogFilter } from "@/lib/dashboard";
import React, { useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/dashboard";
import { Plane, Plus, Search } from "lucide-react";

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

const logEntries: LogEntry[] = [
  {
    id: "1",
    date: "2025-08-05",
    aircraft: "N123AB",
    departure: "KLAX",
    arrival: "KLAS",
    route: "KLAX-KLAS",
    totalTime: "2.3",
    picTime: "2.3",
    sicTime: "0.0",
    instrumentTime: "0.5",
    nightTime: "0.0",
    crossCountryTime: "2.3",
    approaches: 1,
    landings: { day: 2, night: 0 },
    remarks: "Clear weather, smooth flight",
    flightType: "pic",
    conditions: "day",
  },
  {
    id: "2",
    date: "2025-08-03",
    aircraft: "N456CD",
    departure: "KPHX",
    arrival: "KLAX",
    route: "KPHX-KLAX",
    totalTime: "3.1",
    picTime: "3.1",
    sicTime: "0.0",
    instrumentTime: "1.2",
    nightTime: "0.8",
    crossCountryTime: "3.1",
    approaches: 2,
    landings: { day: 1, night: 1 },
    remarks: "IFR approach practice",
    flightType: "pic",
    conditions: "ifr",
  },
  {
    id: "3",
    date: "2025-07-28",
    aircraft: "N789EF",
    departure: "KSAN",
    arrival: "KPHX",
    route: "KSAN-KPHX",
    totalTime: "1.8",
    picTime: "0.0",
    sicTime: "1.8",
    instrumentTime: "0.0",
    nightTime: "0.0",
    crossCountryTime: "1.8",
    approaches: 0,
    landings: { day: 2, night: 0 },
    remarks: "Training flight with CFI",
    flightType: "dual",
    conditions: "vfr",
  },
];

const filterOptions: LogFilter[] = [
  { id: "all", label: "All Flights", count: logEntries.length },
  {
    id: "pic",
    label: "PIC",
    count: logEntries.filter((e) => e.flightType === "pic").length,
  },
  {
    id: "dual",
    label: "Dual",
    count: logEntries.filter((e) => e.flightType === "dual").length,
  },
  {
    id: "cross-country",
    label: "Cross Country",
    count: logEntries.filter((e) => parseFloat(e.crossCountryTime || "0") > 0)
      .length,
  },
];

function LogEntryCard({ entry }: { entry: LogEntry }) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{entry.route}</CardTitle>
          <Badge variant={entry.flightType === "pic" ? "default" : "secondary"}>
            {entry.flightType.toUpperCase()}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {formatDate(entry.date)} • {entry.aircraft}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Total Time</p>
            <p className="font-medium">{entry.totalTime}h</p>
          </div>
          <div>
            <p className="text-muted-foreground">PIC Time</p>
            <p className="font-medium">{entry.picTime}h</p>
          </div>
          <div>
            <p className="text-muted-foreground">Landings</p>
            <p className="font-medium">
              {entry.landings.day + entry.landings.night}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Approaches</p>
            <p className="font-medium">{entry.approaches}</p>
          </div>
        </div>

        {entry.remarks && (
          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm text-muted-foreground">Remarks</p>
            <p className="text-sm">{entry.remarks}</p>
          </div>
        )}

        <div className="flex space-x-2 pt-2">
          <Link
            href={`/dashboard/logbook/flight/${entry.id}`}
            className="flex-1"
          >
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </Link>
          <Link
            href={`/dashboard/logbook/flight/${entry.id}/edit`}
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

export default function LogbookPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  const filteredEntries = logEntries.filter((entry) => {
    const matchesSearch =
      entry.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.aircraft.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.departure.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.arrival.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "pic" && entry.flightType === "pic") ||
      (selectedFilter === "dual" && entry.flightType === "dual") ||
      (selectedFilter === "cross-country" &&
        parseFloat(entry.crossCountryTime || "0") > 0);

    return matchesSearch && matchesFilter;
  });

  // Calculate totals
  const totals = filteredEntries.reduce(
    (acc, entry) => ({
      totalTime: acc.totalTime + parseFloat(entry.totalTime),
      picTime: acc.picTime + parseFloat(entry.picTime),
      crossCountryTime:
        acc.crossCountryTime + parseFloat(entry.crossCountryTime || "0"),
      landings: acc.landings + entry.landings.day + entry.landings.night,
    }),
    { totalTime: 0, picTime: 0, crossCountryTime: 0, landings: 0 },
  );

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Logbook</h1>
          <p className="text-muted-foreground">
            Track your flight hours and experience
          </p>
        </div>
        <Link href="/dashboard/logbook/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Flight
          </Button>
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totals.totalTime.toFixed(1)}h
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              PIC Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totals.picTime.toFixed(1)}h
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cross Country
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totals.crossCountryTime.toFixed(1)}h
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Landings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.landings}</div>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search flights..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
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
          <Tabs
            value={viewMode}
            onValueChange={(value) => setViewMode(value as "cards" | "table")}
          >
            <TabsList>
              <TabsTrigger value="cards">Cards</TabsTrigger>
              <TabsTrigger value="table">Table</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      {viewMode === "cards" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEntries.map((entry) => (
            <LogEntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Aircraft</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>PIC</TableHead>
                <TableHead>Landings</TableHead>
                <TableHead>Type</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{formatDate(entry.date)}</TableCell>
                  <TableCell>{entry.aircraft}</TableCell>
                  <TableCell>{entry.route}</TableCell>
                  <TableCell>{entry.totalTime}h</TableCell>
                  <TableCell>{entry.picTime}h</TableCell>
                  <TableCell>
                    {entry.landings.day + entry.landings.night}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        entry.flightType === "pic" ? "default" : "secondary"
                      }
                    >
                      {entry.flightType.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link href={`/dashboard/logbook/flight/${entry.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
      {filteredEntries.length === 0 && (
        <div className="py-12 text-center">
          <Plane className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No flights found</h3>
          <p className="text-muted-foreground">
            {searchQuery || selectedFilter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "Get started by logging your first flight"}
          </p>
          {!searchQuery && selectedFilter === "all" && (
            <Link href="/dashboard/logbook/add" className="mt-4 inline-block">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Flight
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import type { DutyEntry, DutyFilter } from "@/lib/compliance/duty-log";
import React, { useState } from "react";
import Link from "next/link";
import {
  formatDate,
  getDutyTypeColor,
  getDutyTypeIcon,
  getStatusVariant,
} from "@/lib/compliance/duty-log";
import { Plus, Search, Timer } from "lucide-react";

import { Badge } from "@hamilton/ui/components/ui/badge";
import { Button } from "@hamilton/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@hamilton/ui/components/ui/card";
import { Input } from "@hamilton/ui/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@hamilton/ui/components/ui/tabs";

const dutyEntries: DutyEntry[] = [
  {
    id: "1",
    date: "2025-08-07",
    dutyType: "flight",
    startTime: "08:00",
    endTime: "12:30",
    duration: "4.5",
    location: "KLAX",
    description: "Commercial flight LAX to LAS",
    status: "completed",
  },
  {
    id: "2",
    date: "2025-08-06",
    dutyType: "training",
    startTime: "14:00",
    endTime: "17:00",
    duration: "3.0",
    location: "Training Center",
    description: "Recurrent training - Emergency procedures",
    status: "completed",
  },
  {
    id: "3",
    date: "2025-08-05",
    dutyType: "ground",
    startTime: "09:00",
    endTime: "11:00",
    duration: "2.0",
    location: "KPHX",
    description: "Pre-flight planning and briefing",
    status: "completed",
  },
  {
    id: "4",
    date: "2025-08-07",
    dutyType: "flight",
    startTime: "18:00",
    endTime: "22:00",
    duration: "4.0",
    location: "KLAS",
    description: "Return flight LAS to LAX",
    status: "active",
  },
];

const filterOptions: DutyFilter[] = [
  { id: "all", label: "All Duties", count: dutyEntries.length },
  {
    id: "flight",
    label: "Flight",
    count: dutyEntries.filter((e) => e.dutyType === "flight").length,
  },
  {
    id: "ground",
    label: "Ground",
    count: dutyEntries.filter((e) => e.dutyType === "ground").length,
  },
  {
    id: "training",
    label: "Training",
    count: dutyEntries.filter((e) => e.dutyType === "training").length,
  },
];

function DutyEntryCard({ entry }: { entry: DutyEntry }) {
  const Icon = getDutyTypeIcon(entry.dutyType);

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div
              className={`rounded-full p-2 ${getDutyTypeColor(entry.dutyType)}`}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-lg capitalize">
                {entry.dutyType} Duty
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {formatDate(entry.date)} • {entry.location}
              </p>
            </div>
          </div>
          <Badge variant={getStatusVariant(entry.status)}>{entry.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Start Time</p>
            <p className="font-medium">{entry.startTime}</p>
          </div>
          <div>
            <p className="text-muted-foreground">End Time</p>
            <p className="font-medium">{entry.endTime}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Duration</p>
            <p className="font-medium">{entry.duration}h</p>
          </div>
          <div>
            <p className="text-muted-foreground">Status</p>
            <p className="font-medium capitalize">{entry.status}</p>
          </div>
        </div>

        <div className="rounded-lg bg-muted p-3">
          <p className="text-sm text-muted-foreground">Description</p>
          <p className="text-sm">{entry.description}</p>
        </div>

        <div className="flex pt-2">
          <Link
            href={`/dashboard/compliance/duty-log/${entry.id}`}
            className="flex-1"
          >
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DutyLogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const filteredEntries = dutyEntries.filter((entry) => {
    const matchesSearch =
      entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.dutyType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilter === "all" || entry.dutyType === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  // Calculate totals for current month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyEntries = dutyEntries.filter((entry) => {
    const entryDate = new Date(entry.date);
    return (
      entryDate.getMonth() === currentMonth &&
      entryDate.getFullYear() === currentYear
    );
  });

  const totals = {
    totalHours: monthlyEntries.reduce(
      (acc, entry) => acc + parseFloat(entry.duration),
      0,
    ),
    flightHours: monthlyEntries
      .filter((e) => e.dutyType === "flight")
      .reduce((acc, entry) => acc + parseFloat(entry.duration), 0),
    groundHours: monthlyEntries
      .filter((e) => e.dutyType === "ground")
      .reduce((acc, entry) => acc + parseFloat(entry.duration), 0),
    trainingHours: monthlyEntries
      .filter((e) => e.dutyType === "training")
      .reduce((acc, entry) => acc + parseFloat(entry.duration), 0),
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Duty Log</h1>
          <p className="text-muted-foreground">
            Track your duty time and compliance requirements
          </p>
        </div>
        <Link href="/dashboard/compliance/duty-log/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Duty Entry
          </Button>
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Hours (Month)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totals.totalHours.toFixed(1)}h
            </div>
            <p className="text-xs text-muted-foreground">
              {(100 - totals.totalHours).toFixed(1)}h remaining
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Flight Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totals.flightHours.toFixed(1)}h
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ground Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totals.groundHours.toFixed(1)}h
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Training Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totals.trainingHours.toFixed(1)}h
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search duty entries..."
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEntries.map((entry) => (
          <DutyEntryCard key={entry.id} entry={entry} />
        ))}
      </div>
      {filteredEntries.length === 0 && (
        <div className="py-12 text-center">
          <Timer className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No duty entries found</h3>
          <p className="text-muted-foreground">
            {searchQuery || selectedFilter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "Get started by logging your first duty entry"}
          </p>
          {!searchQuery && selectedFilter === "all" && (
            <Link
              href="/dashboard/compliance/duty-log/add"
              className="mt-4 inline-block"
            >
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Duty Entry
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

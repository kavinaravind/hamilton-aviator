"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/lib/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Plus, Search, Timer } from "lucide-react";

import type { DutyLog } from "@hamilton/validators/lib/compliance";
import { LoadingSkeleton } from "@hamilton/ui/components/skeleton/skeleton";
import { Badge } from "@hamilton/ui/components/ui/badge";
import { Button } from "@hamilton/ui/components/ui/button";
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
  getDutyTypeTWColor,
  getDutyTypLucideIcon,
  getStatusVariant,
} from "@hamilton/validators/lib/compliance";
import { formatDate } from "@hamilton/validators/shared/date";

function DutyEntryCard({ entry }: { entry: DutyLog }) {
  const Icon = getDutyTypLucideIcon(entry.type);
  return (
    <Link
      href={`/dashboard/compliance/duty-log/${entry.id}`}
      className="flex-1"
    >
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div
                className={`rounded-full p-2 ${getDutyTypeTWColor(entry.type)}`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-lg capitalize">
                  {entry.type.replace("-duty", "")} Duty
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {formatDate(entry.startTime.toISOString())}
                  {entry.location ? ` • ${entry.location}` : ""}
                </p>
              </div>
            </div>
            <Badge variant={getStatusVariant(entry.status)}>
              {entry.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Start Time</p>
              <p className="font-medium">
                {entry.startTime.toISOString().slice(11, 16)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">End Time</p>
              <p className="font-medium">
                {entry.endTime
                  ? entry.endTime.toISOString().slice(11, 16)
                  : "-"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Duration</p>
              <p className="font-medium">
                {typeof entry.duration === "number"
                  ? `${entry.duration}h`
                  : entry.duration
                    ? `${parseFloat(entry.duration)}h`
                    : "—"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <p className="font-medium capitalize">{entry.status}</p>
            </div>
          </div>
          {entry.description && (
            <div className="rounded-lg bg-muted p-3">
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="text-sm">{entry.description}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export default function DutyLogPage() {
  const trpc = useTRPC();
  const router = useRouter();

  function DutyLogData() {
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
    const [selectedFilter, setSelectedFilter] = useState<string>("all");

    const { data: duties } = useSuspenseQuery(trpc.dutyLog.all.queryOptions());

    const dutyTypes = [
      { id: "flight-duty", label: "Flight" },
      { id: "training", label: "Training" },
      { id: "standby", label: "Standby" },
      { id: "maintenance", label: "Maintenance" },
    ];
    const filterOptions = [
      { id: "all", label: "All", count: duties.length },
      ...dutyTypes.map((type) => ({
        id: type.id,
        label: type.label,
        count: duties.filter((e: DutyLog) => e.type === type.id).length,
      })),
    ];

    const filteredEntries = duties.filter((entry: DutyLog) => {
      const matchesSearch =
        (entry.description?.toLowerCase().includes(searchQuery.toLowerCase()) ??
          false) ||
        (entry.location?.toLowerCase().includes(searchQuery.toLowerCase()) ??
          false) ||
        entry.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        selectedFilter === "all" || entry.type === selectedFilter;
      return matchesSearch && matchesFilter;
    });

    // Calculate totals for current month
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const monthlyEntries = duties.filter((entry: DutyLog) => {
      const entryDate = new Date(entry.startTime);
      return (
        entryDate.getMonth() === currentMonth &&
        entryDate.getFullYear() === currentYear
      );
    });
    const totals = {
      totalHours: monthlyEntries.reduce(
        (acc: number, entry: DutyLog) => acc + (entry.duration ?? 0),
        0,
      ),
      flightHours: monthlyEntries
        .filter((e: DutyLog) => e.type === "flight-duty")
        .reduce(
          (acc: number, entry: DutyLog) => acc + (entry.duration ?? 0),
          0,
        ),
      trainingHours: monthlyEntries
        .filter((e: DutyLog) => e.type === "training")
        .reduce(
          (acc: number, entry: DutyLog) => acc + (entry.duration ?? 0),
          0,
        ),
      standbyHours: monthlyEntries
        .filter((e: DutyLog) => e.type === "standby")
        .reduce(
          (acc: number, entry: DutyLog) => acc + (entry.duration ?? 0),
          0,
        ),
      maintenanceHours: monthlyEntries
        .filter((e: DutyLog) => e.type === "maintenance")
        .reduce(
          (acc: number, entry: DutyLog) => acc + (entry.duration ?? 0),
          0,
        ),
    };

    return (
      <>
        <div className="grid gap-4 md:grid-cols-5">
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
                Training Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totals.trainingHours.toFixed(1)}h
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Standby Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totals.standbyHours.toFixed(1)}h
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Maintenance Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totals.maintenanceHours.toFixed(1)}h
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex w-full flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search duty entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex w-full min-w-0 flex-col gap-2 xl:w-auto xl:flex-row xl:items-center xl:space-x-2">
            <div className="block w-full xl:hidden">
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
            <div className="hidden w-full xl:block xl:w-auto">
              <Tabs
                value={selectedFilter}
                onValueChange={setSelectedFilter}
                className="w-full xl:w-auto"
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
              className="w-full xl:w-auto"
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEntries.map((entry: DutyLog) => (
              <DutyEntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        ) : (
          <Card className="flex">
            <ScrollArea className="w-1 flex-1">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Start</TableHead>
                    <TableHead>End</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.map((entry: DutyLog) => (
                    <TableRow
                      key={entry.id}
                      onClick={() =>
                        router.push(
                          `/dashboard/compliance/duty-log/${entry.id}`,
                        )
                      }
                      className="cursor-pointer transition-colors hover:bg-accent"
                    >
                      <TableCell>
                        {formatDate(entry.startTime.toISOString())}
                      </TableCell>
                      <TableCell className="capitalize">
                        {entry.type.replace("-duty", "")}
                      </TableCell>
                      <TableCell>{entry.location || "—"}</TableCell>
                      <TableCell>
                        {entry.startTime.toISOString().slice(11, 16)}
                      </TableCell>
                      <TableCell>
                        {entry.endTime
                          ? entry.endTime.toISOString().slice(11, 16)
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {typeof entry.duration === "number"
                          ? `${entry.duration}h`
                          : entry.duration
                            ? `${parseFloat(entry.duration)}h`
                            : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(entry.status)}>
                          {entry.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" className="w-full" />
            </ScrollArea>
          </Card>
        )}
        {filteredEntries.length === 0 && (
          <div className="py-12 text-center">
            <Timer className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">
              No duty entries found
            </h3>
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
      </>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-4 pt-4 sm:p-8 sm:pt-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            My Duty Log
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
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
      <Suspense fallback={<LoadingSkeleton />}>
        <DutyLogData />
      </Suspense>
    </div>
  );
}

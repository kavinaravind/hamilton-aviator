"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/lib/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Plane, Plus, Search } from "lucide-react";

import type { Logbook } from "@hamilton/validators/lib/logbook";
import { LoadingSkeleton } from "@hamilton/ui/components/skeleton/skeleton";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@hamilton/ui/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@hamilton/ui/components/ui/tabs";
import { formatDate } from "@hamilton/validators/shared/date";

function LogEntryCard({ entry }: { entry: Logbook }) {
  return (
    <Link href={`/dashboard/logbook/${entry.id}`} className="flex-1">
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{entry.route}</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            {formatDate(entry.date.toISOString())} • {entry.aircraft} (
            {entry.tailNumber})
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Duration</p>
              <p className="font-medium capitalize">
                {typeof entry.duration === "number"
                  ? (() => {
                      const hours = Math.floor(entry.duration);
                      const minutes = Math.round((entry.duration - hours) * 60);
                      return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
                    })()
                  : (entry.duration ?? "—")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function LogbookPage() {
  const router = useRouter();

  const trpc = useTRPC();

  function LogbookData() {
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

    const { data: flights } = useSuspenseQuery(trpc.logbook.all.queryOptions());

    const filteredEntries = flights.filter((entry) => {
      const matchesSearch =
        entry.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.aircraft.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.tailNumber.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });

    // Calculate totals (only duration for new type)
    const totals = filteredEntries.reduce(
      (acc, entry) => ({
        duration:
          acc.duration +
          (typeof entry.duration === "number"
            ? entry.duration
            : parseFloat(entry.duration)),
      }),
      { duration: 0 },
    );

    return (
      <>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(() => {
                  const hours = Math.floor(totals.duration);
                  const minutes = Math.round((totals.duration - hours) * 60);
                  return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
                })()}
              </div>
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
          <Card className="flex">
            <ScrollArea className="w-1 flex-1">
              {" "}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Aircraft</TableHead>
                    <TableHead>Tail #</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.map((entry) => (
                    <TableRow
                      key={entry.id}
                      onClick={() =>
                        router.push(`/dashboard/logbook/${entry.id}`)
                      }
                      className="cursor-pointer transition-colors hover:bg-accent"
                    >
                      <TableCell>
                        {entry.date
                          ? formatDate(
                              typeof entry.date === "string"
                                ? entry.date
                                : entry.date.toISOString(),
                            )
                          : "—"}
                      </TableCell>
                      <TableCell>{entry.aircraft}</TableCell>
                      <TableCell>{entry.tailNumber}</TableCell>
                      <TableCell>{entry.route}</TableCell>
                      <TableCell>
                        {typeof entry.duration === "number"
                          ? (() => {
                              const hours = Math.floor(entry.duration);
                              const minutes = Math.round(
                                (entry.duration - hours) * 60,
                              );
                              return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
                            })()
                          : (entry.duration ?? "—")}
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
            <Plane className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No flights found</h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? "Try adjusting your search criteria"
                : "Get started by logging your first flight"}
            </p>
            {!searchQuery && (
              <Link href="/dashboard/logbook/add" className="mt-4 inline-block">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Flight
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
            Flight Logbook
          </h1>
          <p className="text-sm font-extralight text-muted-foreground sm:text-base">
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
      <Suspense fallback={<LoadingSkeleton />}>
        <LogbookData />
      </Suspense>
    </div>
  );
}

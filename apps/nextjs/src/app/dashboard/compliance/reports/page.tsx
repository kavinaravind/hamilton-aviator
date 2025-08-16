"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useTRPC } from "@/lib/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { FileText, Plus, Search } from "lucide-react";

import type { ReportType } from "@hamilton/validators/lib/compliance";
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
  getReportCategoryColor,
  getReportIcon,
} from "@hamilton/validators/lib/compliance";

function ReportTypeCard({ reportType }: { reportType: ReportType }) {
  const Icon = getReportIcon(reportType.icon);
  return (
    <Link
      href={`/dashboard/compliance/reports/${reportType.id}`}
      className="flex-1"
    >
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div
                className={`rounded-full p-2 ${getReportCategoryColor(reportType.category)}`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-lg">{reportType.title}</CardTitle>
                <Badge className={getReportCategoryColor(reportType.category)}>
                  {reportType.category.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {reportType.description}
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Estimated Time</p>
              <p className="font-medium">{reportType.estimatedTime}</p>
            </div>
          </div>
          <div className="flex space-x-2 pt-2">
            <Button className="flex-1">Generate Report</Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function ReportsPage() {
  const trpc = useTRPC();

  function ReportsData() {
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    const { data: reports = [] } = useSuspenseQuery(
      trpc.report.all.queryOptions(),
    );

    // Categories for filtering
    const categories = [
      { id: "all", label: "All Reports", count: reports.length },
      ...Array.from(new Set(reports.map((r: ReportType) => r.category)))
        .filter((cat): cat is string => typeof cat === "string")
        .map((cat) => ({
          id: cat,
          label: cat.charAt(0).toUpperCase() + cat.slice(1),
          count: reports.filter((r: ReportType) => r.category === cat).length,
        })),
    ];

    const filteredReports = reports.filter((report: ReportType) => {
      const matchesSearch =
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || report.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    return (
      <>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Tabs
              value={selectedCategory}
              onValueChange={setSelectedCategory}
              className="w-auto"
            >
              <TabsList>
                {categories.map((cat) => (
                  <TabsTrigger
                    key={cat.id}
                    value={cat.id}
                    className="flex items-center space-x-2"
                  >
                    <span>{cat.label}</span>
                    <Badge variant="secondary" className="ml-2">
                      {cat.count}
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
            {filteredReports.map((report: ReportType) => (
              <ReportTypeCard key={report.id} reportType={report} />
            ))}
          </div>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Estimated Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report: ReportType) => (
                  <Link
                    key={report.id}
                    href={`/dashboard/compliance/reports/${report.id}`}
                    className="contents"
                  >
                    <TableRow className="cursor-pointer transition-colors hover:bg-accent">
                      <TableCell className="font-medium">
                        {report.title}
                      </TableCell>
                      <TableCell>{report.category}</TableCell>
                      <TableCell>{report.description}</TableCell>
                      <TableCell>{report.estimatedTime}</TableCell>
                    </TableRow>
                  </Link>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
        {filteredReports.length === 0 && (
          <div className="py-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No reports found</h3>
            <p className="text-muted-foreground">
              {searchQuery || selectedCategory !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Get started by generating your first report"}
            </p>
            {!searchQuery && selectedCategory === "all" && (
              <Link
                href="/dashboard/compliance/reports/add"
                className="mt-4 inline-block"
              >
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Report
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
            Reports
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Generate regulatory forms and compliance reports
          </p>
        </div>
        <Link href="/dashboard/compliance/reports/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Report
          </Button>
        </Link>
      </div>
      <Suspense fallback={<LoadingSkeleton />}>
        <ReportsData />
      </Suspense>
      <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
        <div className="flex items-start">
          <FileText className="mt-1 h-5 w-5 text-blue-500 dark:text-blue-400" />
          <div className="ml-3 flex-1">
            <p className="mb-1 text-sm font-semibold text-blue-900 dark:text-blue-200">
              Report Generation Tips
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Ensure your logbook entries are up to date before generating
              reports.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { Suspense, useState } from "react";
import {
  getReportCategoryColor,
  getReportIcon,
} from "@/lib/compliance/reports";
import { useTRPC } from "@/lib/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { FileText, Search } from "lucide-react";

import type { ReportType } from "@hamilton/validators/lib/compliance";
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

function ReportTypeCard({ reportType }: { reportType: ReportType }) {
  const Icon = getReportIcon(reportType.icon);

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
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
  );
}

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  const trpc = useTRPC();
  const { data: reports = [] } = useSuspenseQuery(
    trpc.report.all.queryOptions(),
  );

  const categories = [
    { id: "all", label: "All" },
    ...Array.from(new Set(reports.map((r: ReportType) => r.category)))
      .filter((cat): cat is string => typeof cat === "string")
      .map((cat) => ({
        id: cat,
        label: cat.charAt(0).toUpperCase() + cat.slice(1),
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
    <Suspense
      fallback={
        <div className="p-8 text-center text-muted-foreground">
          Loading reports...
        </div>
      }
    >
      <div className="flex-1 space-y-6 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">
              Generate regulatory forms and compliance reports
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-4">
          <div className="flex flex-1 items-end gap-3">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
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
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          <Tabs
            value={viewMode}
            onValueChange={(v) => setViewMode(v as "cards" | "table")}
            className="w-auto"
          >
            <TabsList>
              <TabsTrigger value="cards">Cards</TabsTrigger>
              <TabsTrigger value="table">Table</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Available Reports</h2>
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
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report: ReportType) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">
                        {report.title}
                      </TableCell>
                      <TableCell>{report.category}</TableCell>
                      <TableCell>{report.description}</TableCell>
                      <TableCell>{report.estimatedTime}</TableCell>
                      <TableCell>
                        <Button size="sm">Generate</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </div>
        {filteredReports.length === 0 && (
          <div className="py-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No reports found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
        <div className="mt-6 rounded-lg bg-blue-50 p-4">
          <div className="flex items-start">
            <FileText className="mt-1 h-5 w-5 text-blue-500" />
            <div className="ml-3 flex-1">
              <p className="mb-1 text-sm font-semibold text-blue-900">
                Report Generation Tips
              </p>
              <p className="text-sm text-blue-700">
                Ensure your logbook entries are up to date before generating
                reports.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}

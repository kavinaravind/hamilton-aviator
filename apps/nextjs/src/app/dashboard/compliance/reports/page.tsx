"use client";

import type { RecentReport, ReportFilter, ReportType } from "@/lib/dashboard";
import React, { useState } from "react";
import Link from "next/link";
import { formatDate, getReportCategoryColor } from "@/lib/dashboard";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  FileText,
  Plus,
  Search,
} from "lucide-react";

import { Alert, AlertDescription } from "@hamilton/ui/components/ui/alert";
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
const reportTypes: ReportType[] = [
  {
    id: "faa-8710",
    name: "FAA Form 8710-1",
    description: "Airman Certificate and/or Rating Application",
    category: "faa",
    estimatedTime: "15 min",
    lastGenerated: "2025-07-15",
    icon: "file-text",
  },
  {
    id: "logbook-export",
    name: "Logbook Export",
    description: "Complete flight time summary for insurance or applications",
    category: "logbook",
    estimatedTime: "5 min",
    lastGenerated: "2025-08-01",
    icon: "download",
  },
  {
    id: "duty-compliance",
    name: "Duty Time Compliance",
    description: "Monthly duty time summary for regulatory compliance",
    category: "compliance",
    estimatedTime: "10 min",
    lastGenerated: "2025-08-01",
    icon: "clock",
  },
  {
    id: "maintenance-summary",
    name: "Maintenance Summary",
    description: "Aircraft maintenance status and upcoming requirements",
    category: "maintenance",
    estimatedTime: "8 min",
    icon: "wrench",
  },
];

const recentReports: RecentReport[] = [
  {
    id: "1",
    name: "Logbook Export - July 2025",
    type: "Logbook Export",
    generatedDate: "2025-08-01",
    status: "completed",
    fileSize: "2.3 MB",
    downloadUrl: "/downloads/logbook-july-2025.pdf",
  },
  {
    id: "2",
    name: "Duty Compliance - July 2025",
    type: "Duty Time Compliance",
    generatedDate: "2025-08-01",
    status: "completed",
    fileSize: "1.1 MB",
    downloadUrl: "/downloads/duty-compliance-july-2025.pdf",
  },
  {
    id: "3",
    name: "FAA Form 8710-1",
    type: "FAA Form 8710-1",
    generatedDate: "2025-07-15",
    status: "processing",
  },
];

const filterOptions: ReportFilter[] = [
  { id: "all", label: "All Reports", count: reportTypes.length },
  {
    id: "faa",
    label: "FAA Forms",
    count: reportTypes.filter((r) => r.category === "faa").length,
  },
  {
    id: "logbook",
    label: "Logbook",
    count: reportTypes.filter((r) => r.category === "logbook").length,
  },
  {
    id: "compliance",
    label: "Compliance",
    count: reportTypes.filter((r) => r.category === "compliance").length,
  },
  {
    id: "maintenance",
    label: "Maintenance",
    count: reportTypes.filter((r) => r.category === "maintenance").length,
  },
];

interface ReportTypeCardProps {
  reportType: ReportType;
}

function ReportTypeCard({ reportType }: ReportTypeCardProps) {
  const getReportIcon = (iconName: string) => {
    switch (iconName) {
      case "file-text":
        return FileText;
      case "download":
        return Download;
      case "clock":
        return Clock;
      default:
        return FileText;
    }
  };

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
              <CardTitle className="text-lg">{reportType.name}</CardTitle>
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
          <div>
            <p className="text-muted-foreground">Last Generated</p>
            <p className="font-medium">
              {reportType.lastGenerated
                ? formatDate(reportType.lastGenerated)
                : "Never"}
            </p>
          </div>
        </div>

        <div className="flex space-x-2 pt-2">
          <Button className="flex-1">Generate Report</Button>
          <Button variant="outline" size="icon">
            <FileText className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface RecentReportRowProps {
  report: RecentReport;
}

function RecentReportRow({ report }: RecentReportRowProps) {
  const getStatusVariant = (
    status: string,
  ): "default" | "secondary" | "destructive" => {
    switch (status) {
      case "completed":
        return "default";
      case "processing":
        return "secondary";
      case "failed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return CheckCircle;
      case "processing":
        return Clock;
      case "failed":
        return AlertTriangle;
      default:
        return Clock;
    }
  };

  const StatusIcon = getStatusIcon(report.status);

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-center space-x-3">
        <StatusIcon className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="font-medium">{report.name}</p>
          <p className="text-sm text-muted-foreground">
            {formatDate(report.generatedDate)} • {report.fileSize}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Badge variant={getStatusVariant(report.status)}>{report.status}</Badge>
        {report.status === "completed" && (
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        )}
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const filteredReportTypes = reportTypes.filter((reportType) => {
    const matchesSearch =
      reportType.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reportType.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilter === "all" || reportType.category === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate regulatory forms and compliance reports
          </p>
        </div>
      </div>

      {/* Help Alert */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Reports are generated based on your current flight data and aircraft
          information. Ensure your logbook and aircraft records are up to date
          before generating official forms.
        </AlertDescription>
      </Alert>

      {/* Search and Filter */}
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

      {/* Report Types Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Available Reports</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredReportTypes.map((reportType) => (
            <ReportTypeCard key={reportType.id} reportType={reportType} />
          ))}
        </div>
      </div>

      {/* Recent Reports */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Reports</h2>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        <div className="space-y-2">
          {recentReports.map((report) => (
            <RecentReportRow key={report.id} report={report} />
          ))}
        </div>
      </div>

      {filteredReportTypes.length === 0 && (
        <div className="py-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No reports found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}

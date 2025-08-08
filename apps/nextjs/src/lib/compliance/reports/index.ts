import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  FileText,
} from "lucide-react";

export interface ReportType {
  id: string;
  name: string;
  description: string;
  category: string;
  estimatedTime: string;
  lastGenerated?: string;
  icon: string;
}

export interface RecentReport {
  id: string;
  name: string;
  type: string;
  generatedDate: string;
  status: string;
  fileSize?: string;
  downloadUrl?: string;
}

export interface ReportFilter {
  id: string;
  label: string;
  count: number;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getReportCategoryColor(category: string): string {
  switch (category) {
    case "faa":
      return "bg-blue-100 text-blue-800";
    case "logbook":
      return "bg-green-100 text-green-800";
    case "compliance":
      return "bg-yellow-100 text-yellow-800";
    case "maintenance":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export const getStatusVariant = (
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

export const getStatusIcon = (status: string) => {
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

export const getReportIcon = (iconName: string) => {
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

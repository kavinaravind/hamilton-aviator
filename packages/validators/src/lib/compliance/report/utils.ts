import { Clock, Download, FileText } from "lucide-react";

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

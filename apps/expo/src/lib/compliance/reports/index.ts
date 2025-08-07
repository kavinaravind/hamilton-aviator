export interface ReportType {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  estimatedTime: string;
  requiredData: string[];
  category: "regulatory" | "export" | "insurance" | "custom";
}

export interface RecentReport {
  id: string;
  type: string;
  generatedDate: string;
  status: "completed" | "generating" | "failed";
  fileName: string;
  size: string;
}

// Utility functions
export const getReportCategoryColor = (
  category: ReportType["category"],
): string => {
  switch (category) {
    case "regulatory":
      return "#3B82F6";
    case "insurance":
      return "#F59E0B";
    case "export":
      return "#10B981";
    case "custom":
      return "#8B5CF6";
    default:
      return "#6B7280";
  }
};

export const getReportStatusColor = (
  status: RecentReport["status"],
): string => {
  switch (status) {
    case "completed":
      return "#10B981";
    case "generating":
      return "#F59E0B";
    case "failed":
      return "#EF4444";
    default:
      return "#6B7280";
  }
};

export const getReportStatusText = (status: RecentReport["status"]): string => {
  switch (status) {
    case "completed":
      return "Completed";
    case "generating":
      return "Generating...";
    case "failed":
      return "Failed";
    default:
      return "Unknown";
  }
};

export const formatReportDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

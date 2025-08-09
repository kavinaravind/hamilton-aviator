import type { ComplianceReport } from "./types";

export const getReportStatusColor = (
  status: ComplianceReport["status"],
): string => {
  switch (status) {
    case "pending":
      return "#F59E0B";
    case "approved":
      return "#10B981";
    case "rejected":
      return "#EF4444";
    default:
      return "#6B7280";
  }
};

export const getReportTypeText = (type: ComplianceReport["type"]): string => {
  switch (type) {
    case "duty-log":
      return "Duty Log";
    case "flight-time":
      return "Flight Time";
    case "rest-period":
      return "Rest Period";
    default:
      return "Unknown";
  }
};

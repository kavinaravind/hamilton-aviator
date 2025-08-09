import type { DutyEntry } from "./types";

export const getDutyStatusColor = (status: DutyEntry["status"]): string => {
  switch (status) {
    case "completed":
      return "#10B981";
    case "active":
      return "#F59E0B";
    default:
      return "#6B7280";
  }
};

export const getDutyTypeText = (type: DutyEntry["type"]): string => {
  switch (type) {
    case "flight-duty":
      return "Flight Duty";
    case "training":
      return "Training";
    case "standby":
      return "Standby";
    case "maintenance":
      return "Maintenance";
    default:
      return "Unknown";
  }
};

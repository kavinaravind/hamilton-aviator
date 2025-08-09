import type { AircraftStatus } from "./types";

export const getStatusColor = (status: AircraftStatus): string => {
  switch (status) {
    case "airworthy":
      return "#10B981";
    case "maintenance-soon":
      return "#F59E0B";
    case "maintenance-due":
      return "#EF4444";
    default:
      return "#6B7280";
  }
};

export const getStatusText = (status: AircraftStatus): string => {
  switch (status) {
    case "airworthy":
      return "Airworthy";
    case "maintenance-soon":
      return "Maintenance Soon";
    case "maintenance-due":
      return "Maintenance Due";
    default:
      return "Unknown";
  }
};

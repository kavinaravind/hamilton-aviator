import type { DutyEntry } from "./types";

export const getDutyStatusText = (status: DutyEntry["status"]): string => {
  switch (status) {
    case "completed":
      return "Completed";
    case "active":
      return "Active";
    default:
      return "Unknown";
  }
};

export const calculateMonthlyDutyTime = (entries: DutyEntry[]): string => {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  let totalMinutes = 0;
  for (const entry of entries) {
    if (!entry.endTime) continue;
    const start = new Date(entry.startTime);
    const end = new Date(entry.endTime);
    if (start.getMonth() === month && start.getFullYear() === year) {
      totalMinutes += Math.max(0, (end.getTime() - start.getTime()) / 60000);
    }
  }
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  return `${hours}h ${minutes}m`;
};

// Format a date string as YYYY-MM-DD
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Format a time string as HH:MM
export const formatTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

// Get color for a duty type
export const getDutyTypeColor = (type: DutyEntry["type"]): string => {
  switch (type) {
    case "flight-duty":
      return "#3B82F6";
    case "training":
      return "#10B981";
    case "standby":
      return "#F59E0B";
    case "maintenance":
      return "#EF4444";
    default:
      return "#6B7280";
  }
};

// Get icon name for a duty type (Ionicons)
export const getDutyTypeIcon = (type: DutyEntry["type"]): string => {
  switch (type) {
    case "flight-duty":
      return "airplane";
    case "training":
      return "school";
    case "standby":
      return "time";
    case "maintenance":
      return "construct";
    default:
      return "help-circle";
  }
};

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

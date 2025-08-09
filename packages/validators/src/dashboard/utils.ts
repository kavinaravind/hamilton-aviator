import type { UpcomingItem } from "./types";

export const formatDuration = (hours: number): string => {
  return hours.toFixed(1);
};

export const getAlertColor = (urgent: boolean): string => {
  return urgent ? "#EF4444" : "#6B7280";
};

export const getAlertBackgroundColor = (urgent: boolean): string => {
  return urgent ? "#FEF2F2" : "#F3F4F6";
};

export const getEventTypeIcon = (type: UpcomingItem["type"]) => {
  return type === "checkride" ? "school" : "book";
};

export const getEventTypeColor = (type: UpcomingItem["type"]): string => {
  return type === "checkride" ? "#EF4444" : "#3B82F6";
};

export const getEventTypeBackgroundColor = (
  type: UpcomingItem["type"],
): string => {
  return type === "checkride" ? "#FEF2F2" : "#F0F9FF";
};

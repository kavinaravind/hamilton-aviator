// Utility for icon based on duty type
import { Calendar, Clock, MapPin, Timer } from "lucide-react";

// Utility for badge variant based on status
export function getStatusVariant(
  status: string,
): "default" | "secondary" | "destructive" {
  switch (status) {
    case "active":
      return "default";
    case "completed":
      return "secondary";
    case "pending":
      return "destructive";
    default:
      return "secondary";
  }
}

export function getDutyTypeIcon(type: string) {
  switch (type) {
    case "flight":
      return Clock;
    case "ground":
      return MapPin;
    case "training":
      return Calendar;
    default:
      return Timer;
  }
}
// Types for duty log entries and filters
export type DutyEntry = {
  id: string;
  date: string; // ISO date string
  dutyType: "flight" | "ground" | "training" | string;
  startTime: string;
  endTime: string;
  duration: string; // hours as string
  location: string;
  description: string;
  status: "active" | "completed" | "pending" | string;
};

export type DutyFilter = {
  id: string;
  label: string;
  count: number;
};

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getDutyTypeColor(type: string): string {
  switch (type) {
    case "flight":
      return "bg-blue-100 text-blue-700";
    case "ground":
      return "bg-green-100 text-green-700";
    case "training":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

// Form data type for add/edit duty entry
export interface DutyFormData {
  date: string;
  dutyType: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
}

// Utility to calculate duration from start and end time
export function calculateDuration(start: string, end: string): string {
  if (!start || !end) return "0.0";

  const [startHour, startMin] = start.split(":").map(Number);
  const [endHour, endMin] = end.split(":").map(Number);

  if (
    startHour === undefined ||
    startMin === undefined ||
    endHour === undefined ||
    endMin === undefined
  ) {
    return "0.0";
  }

  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  let duration = endMinutes - startMinutes;
  if (duration < 0) duration += 24 * 60; // Handle overnight flights

  return (duration / 60).toFixed(1);
}

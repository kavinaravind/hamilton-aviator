import { Calendar, Clock, MapPin, Timer } from "lucide-react";

import type { DutyLog } from "./types";

export function getDutyTypLucideIcon(type: string) {
  switch (type) {
    case "flight-duty":
      return Clock;
    case "maintenance":
      return MapPin;
    case "training":
      return Calendar;
    default:
      return Timer;
  }
}

export function getDutyTypeTWColor(type: string): string {
  switch (type) {
    case "flight-duty":
      return "bg-blue-100 text-blue-700";
    case "maintenance":
      return "bg-green-100 text-green-700";
    case "training":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

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

export const getDutyStatusText = (status: DutyLog["status"]): string => {
  switch (status) {
    case "completed":
      return "Completed";
    case "active":
      return "Active";
    default:
      return "Unknown";
  }
};

// Get color for a duty type
export const getDutyTypeColor = (type: DutyLog["type"]): string => {
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
export const getDutyTypeIcon = (type: DutyLog["type"]): string => {
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

export const getDutyStatusColor = (status: DutyLog["status"]): string => {
  switch (status) {
    case "completed":
      return "#10B981";
    case "active":
      return "#F59E0B";
    default:
      return "#6B7280";
  }
};

export const getDutyTypeText = (type: DutyLog["type"]): string => {
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

export const calculateMonthlyDutyTime = (entries: DutyLog[]): string => {
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

export function calculateDuration(
  start: Date | undefined,
  end: Date | null | undefined,
): string {
  if (!start || !end) return "0h 0m";
  const startTime = start.getTime();
  const endTime = end.getTime();
  const durationMs = endTime - startTime;
  if (durationMs < 0) return "0h 0m";
  const totalMinutes = Math.round(durationMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

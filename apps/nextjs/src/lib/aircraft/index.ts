import { AlertTriangle, CheckCircle, Wrench } from "lucide-react";

export function getStatusIcon(status: string) {
  switch (status) {
    case "airworthy":
      return CheckCircle;
    case "maintenance-soon":
      return AlertTriangle;
    case "maintenance-due":
      return Wrench;
    default:
      return AlertTriangle;
  }
}
// Aircraft types for aircraft page
export type AircraftStatusType =
  | "airworthy"
  | "maintenance-soon"
  | "maintenance-due";
export type AircraftOwnership = "owned" | "rented";

export interface Aircraft {
  id: string;
  tailNumber: string;
  type: string;
  model: string;
  year: number;
  ownership: AircraftOwnership;
  status: AircraftStatusType;
  totalTime: number;
  lastInspection: string;
  nextInspection: string;
  location: string;
  notes?: string;
  inspectionType?: string;
  hoursToInspection?: number;
  daysToInspection?: number;
}

export type AircraftFilter = {
  id: string;
  label: string;
  count: number;
};

export const getStatusColor = (status: AircraftStatusType): string => {
  switch (status) {
    case "airworthy":
      return "bg-green-100 text-green-800";
    case "maintenance-soon":
      return "bg-yellow-100 text-yellow-800";
    case "maintenance-due":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

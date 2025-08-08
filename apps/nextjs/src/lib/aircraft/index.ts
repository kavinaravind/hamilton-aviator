import { AlertTriangle, CheckCircle, Wrench } from "lucide-react";

// Aircraft status types for details page
export type AircraftStatus =
  | "airworthy"
  | "maintenance-soon"
  | "maintenance-due";

export interface Aircraft {
  id: string;
  tailNumber: string;
  type?: string;
  make?: string;
  model: string;
  year?: number | string;
  ownership: AircraftOwnership;
  status: AircraftStatus;
  totalTime?: number | string;
  lastInspection?: string;
  nextInspection?: string;
  location?: string;
  notes?: string;
  inspectionType?: string;
  hoursToInspection?: number;
  daysToInspection?: number;
}

export interface DetailedAircraft extends Aircraft {
  year: string;
  totalTime: string;
  make: string;
  engine: {
    make: string;
    model: string;
    totalTime: string;
  };
  propeller: {
    make: string;
    model: string;
    totalTime: string;
  };
  annualDue: string;
  lastMaintenance: string;
  insurance: {
    company: string;
    expires: string;
    policyNumber: string;
  };
  registration: {
    expires: string;
    category: string;
    class: string;
  };
}

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

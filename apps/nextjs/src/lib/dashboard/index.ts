// Dashboard types and utilities for web

export interface FlightStats {
  totalTime: string;
  pic: string;
  monthlyTime: string;
  last30Days: number;
}

export interface AircraftStatus {
  total: number;
  airworthy: number;
  maintenance: number;
  maintenanceSoon: number;
}

export interface DutyCompliance {
  activeDuty: number;
  monthlyHours: string;
  remainingDuty: string;
  nextRest: string;
}

export interface MaintenanceAlert {
  id: string;
  aircraftId: string;
  type: string;
  dueInHours?: number;
  dueInDays?: number;
  urgent: boolean;
}

export interface RecentFlight {
  id: string;
  date: string;
  route: string;
  aircraft: string;
  duration: string;
  type: string;
}

export interface UpcomingItem {
  id: string;
  type: "checkride" | "training";
  title: string;
  date: string;
  location: string;
  urgent: boolean;
}

export interface Period {
  id: string;
  label: string;
}

export interface QuickStatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  onClick?: () => void;
}

// Types for logbook entries and filters
export type LogEntry = {
  id: string;
  date: string;
  aircraft: string;
  departure: string;
  arrival: string;
  route: string;
  totalTime: string;
  picTime: string;
  sicTime: string;
  instrumentTime: string;
  nightTime: string;
  crossCountryTime: string;
  approaches: number;
  landings: { day: number; night: number };
  remarks?: string;
  flightType: "pic" | "dual";
  conditions: "day" | "night" | "ifr" | "vfr";
};

export type LogFilter = {
  id: string;
  label: string;
  count: number;
};

// Utility functions
export const formatDuration = (hours: number): string => {
  return hours.toFixed(1);
};

export const getAlertVariant = (
  urgent: boolean,
): "destructive" | "secondary" => {
  return urgent ? "destructive" : "secondary";
};

export const getEventTypeColor = (type: UpcomingItem["type"]): string => {
  return type === "checkride" ? "destructive" : "default";
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

// Logbook types
export interface LogbookEntry {
  id: string;
  date: string;
  aircraft: string;
  route: string;
  duration: string;
  pic: string;
  sic: string;
  solo: string;
  crossCountry: string;
  night: string;
  instrument: string;
  approaches: number;
  landings: number;
  remarks: string;
}

// Duty log types
export type DutyType = "flight-duty" | "duty" | "rest";
export type DutyStatus = "active" | "completed" | "upcoming";

export interface DutyLogEntry {
  id: string;
  date: string;
  type: DutyType;
  startTime: string;
  endTime?: string;
  duration?: string;
  status: DutyStatus;
  notes?: string;
}

// Reports types
export type ReportType =
  | "faa-forms"
  | "logbook-export"
  | "compliance"
  | "maintenance";
export type ReportCategory =
  | "regulatory"
  | "operational"
  | "maintenance"
  | "training";

export interface ReportItem {
  id: string;
  type: ReportType;
  category: ReportCategory;
  title: string;
  description: string;
  lastGenerated?: string;
  format: string[];
}

export interface RecentReport {
  id: string;
  reportId: string;
  title: string;
  generatedAt: string;
  format: string;
  status: "completed" | "processing" | "failed";
}

// Additional utility functions

export const getDutyStatusColor = (status: DutyStatus): string => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "completed":
      return "bg-gray-100 text-gray-800";
    case "upcoming":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getReportCategoryColor = (category: ReportCategory): string => {
  switch (category) {
    case "regulatory":
      return "bg-red-100 text-red-800";
    case "operational":
      return "bg-blue-100 text-blue-800";
    case "maintenance":
      return "bg-yellow-100 text-yellow-800";
    case "training":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

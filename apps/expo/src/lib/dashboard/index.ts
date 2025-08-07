// Dashboard types and utilities

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
  icon: string;
  color: string;
  onPress?: () => void;
}

// Utility functions
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

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

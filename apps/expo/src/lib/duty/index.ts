export interface DutyEntry {
  id: string;
  startTime: string;
  endTime: string | null;
  type: "flight-duty" | "training" | "standby" | "maintenance";
  description: string;
  duration: string;
  status: "completed" | "active";
}

export interface DetailedDutyEntry extends DutyEntry {
  location?: string;
  crew?: string[];
  aircraft?: string;
  flightNumber?: string;
  instructor?: string;
  trainingType?: string;
  notes?: string;
}

export const getDutyTypeColor = (type: DutyEntry["type"]): string => {
  switch (type) {
    case "flight-duty":
      return "#3B82F6";
    case "training":
      return "#10B981";
    case "standby":
      return "#F59E0B";
    case "maintenance":
      return "#8B5CF6";
    default:
      return "#6B7280";
  }
};

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
      return "briefcase";
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
      return "Other";
  }
};

export const getDutyStatusColor = (status: DutyEntry["status"]): string => {
  switch (status) {
    case "active":
      return "#10B981";
    case "completed":
      return "#6B7280";
    default:
      return "#6B7280";
  }
};

export const getDutyStatusText = (status: DutyEntry["status"]): string => {
  switch (status) {
    case "active":
      return "Active";
    case "completed":
      return "Completed";
    default:
      return "Unknown";
  }
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const formatDuration = (duration: string): string => {
  // Parse duration string like "8h 30m" and return formatted version
  return duration;
};

export const calculateTotalDutyTime = (entries: DutyEntry[]): string => {
  // Simple calculation - in real app, properly parse duration strings
  const completedEntries = entries.filter(
    (entry) => entry.status === "completed",
  );
  const totalHours = completedEntries.length * 6;
  return `${totalHours}h`;
};

export const calculateMonthlyDutyTime = (
  entries: DutyEntry[],
  month?: number,
  year?: number,
): string => {
  const currentMonth = month ?? new Date().getMonth();
  const currentYear = year ?? new Date().getFullYear();

  const monthlyEntries = entries.filter((entry) => {
    const dutyDate = new Date(entry.startTime);
    return (
      dutyDate.getMonth() === currentMonth &&
      dutyDate.getFullYear() === currentYear &&
      entry.status === "completed"
    );
  });

  const totalHours = monthlyEntries.length * 6;
  return `${totalHours}h`;
};

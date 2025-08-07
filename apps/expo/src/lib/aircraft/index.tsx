export type AircraftStatus =
  | "airworthy"
  | "maintenance-soon"
  | "maintenance-due";

export type AircraftOwnership = "owned" | "rented";

export interface Aircraft {
  id: string;
  tailNumber: string;
  make: string;
  model: string;
  status: AircraftStatus;
  ownership: AircraftOwnership;
}

export interface DetailedAircraft extends Aircraft {
  year: string;
  totalTime: string;
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

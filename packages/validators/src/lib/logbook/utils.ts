import type { DetailedFlight, Flight } from "./types";

export const formatFlightDuration = (duration: string): string => {
  const hours = parseFloat(duration);
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);

  if (wholeHours === 0) {
    return `${minutes}m`;
  } else if (minutes === 0) {
    return `${wholeHours}h`;
  } else {
    return `${wholeHours}h ${minutes}m`;
  }
};

export const parseRoute = (
  route: string,
): { departure: string; arrival: string } => {
  const parts = route.split(" - ");
  return {
    departure: parts[0] ?? "",
    arrival: parts[1] ?? parts[0] ?? "",
  };
};

export const calculateTotalFlightTime = (flights: Flight[]): string => {
  const totalHours = flights.reduce((sum, flight) => {
    return sum + parseFloat(flight.duration);
  }, 0);

  return totalHours.toFixed(1);
};

export const getFlightTypeColor = (
  flightType: DetailedFlight["flightType"],
): string => {
  switch (flightType) {
    case "training":
      return "#3B82F6";
    case "solo":
      return "#10B981";
    case "cross-country":
      return "#8B5CF6";
    case "local":
      return "#F59E0B";
    case "commercial":
      return "#EF4444";
    default:
      return "#6B7280";
  }
};

export const getFlightTypeText = (
  flightType: DetailedFlight["flightType"],
): string => {
  switch (flightType) {
    case "training":
      return "Training";
    case "solo":
      return "Solo";
    case "cross-country":
      return "Cross Country";
    case "local":
      return "Local";
    case "commercial":
      return "Commercial";
    default:
      return "Unknown";
  }
};

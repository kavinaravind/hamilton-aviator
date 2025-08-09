import { z } from "zod/v4";

export const FlightStatsSchema = z.object({
  totalTime: z.string(),
  pic: z.string(),
  monthlyTime: z.string(),
  last30Days: z.number(),
});
export type FlightStats = z.infer<typeof FlightStatsSchema>;

export const AircraftStatusSchema = z.object({
  total: z.number(),
  airworthy: z.number(),
  maintenance: z.number(),
  maintenanceSoon: z.number(),
});
export type AircraftStatus = z.infer<typeof AircraftStatusSchema>;

export const DutyComplianceSchema = z.object({
  activeDuty: z.number(),
  monthlyHours: z.string(),
  remainingDuty: z.string(),
  nextRest: z.string(),
});
export type DutyCompliance = z.infer<typeof DutyComplianceSchema>;

export const MaintenanceAlertSchema = z.object({
  id: z.string(),
  aircraftId: z.string(),
  type: z.string(),
  dueInHours: z.number().optional(),
  dueInDays: z.number().optional(),
  urgent: z.boolean(),
});
export type MaintenanceAlert = z.infer<typeof MaintenanceAlertSchema>;

export const RecentFlightSchema = z.object({
  id: z.string(),
  date: z.string(),
  route: z.string(),
  aircraft: z.string(),
  duration: z.string(),
  type: z.string(),
});
export type RecentFlight = z.infer<typeof RecentFlightSchema>;

export const UpcomingItemSchema = z.object({
  id: z.string(),
  type: z.enum(["checkride", "training"]),
  title: z.string(),
  date: z.string(),
  location: z.string(),
  urgent: z.boolean(),
});
export type UpcomingItem = z.infer<typeof UpcomingItemSchema>;

export const PeriodSchema = z.object({
  id: z.string(),
  label: z.string(),
});
export type Period = z.infer<typeof PeriodSchema>;

import { boolean, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

// Logbook: Flight
export const flight = pgTable("flight", {
  id: uuid("id").primaryKey().defaultRandom(),
  date: text("date").notNull(),
  route: text("route").notNull(),
  aircraft: text("aircraft").notNull(),
  duration: text("duration").notNull(),
  tailNumber: text("tail_number").notNull(),
});

// Dashboard: FlightStats
export const flightStats = pgTable("flight_stats", {
  id: uuid("id").primaryKey().defaultRandom(),
  totalTime: text("total_time").notNull(),
  pic: text("pic").notNull(),
  monthlyTime: text("monthly_time").notNull(),
  last30Days: integer("last_30_days").notNull(),
});

// Dashboard: AircraftStatus
export const aircraftStatus = pgTable("aircraft_status", {
  id: uuid("id").primaryKey().defaultRandom(),
  total: integer("total").notNull().default(0),
  airworthy: integer("airworthy").notNull().default(0),
  maintenance: integer("maintenance").notNull().default(0),
  maintenanceSoon: integer("maintenance_soon").notNull().default(0),
});

// Dashboard: DutyCompliance
export const dutyCompliance = pgTable("duty_compliance", {
  id: uuid("id").primaryKey().defaultRandom(),
  activeDuty: integer("active_duty").notNull(),
  monthlyHours: text("monthly_hours").notNull(),
  remainingDuty: text("remaining_duty").notNull(),
  nextRest: text("next_rest").notNull(),
});

// Dashboard: MaintenanceAlert
export const maintenanceAlert = pgTable("maintenance_alert", {
  id: uuid("id").primaryKey().defaultRandom(),
  aircraftId: text("aircraft_id").notNull(),
  type: text("type").notNull(),
  dueInHours: integer("due_in_hours"),
  dueInDays: integer("due_in_days"),
  urgent: boolean("urgent").notNull(),
});

// Dashboard: RecentFlight
export const recentFlight = pgTable("recent_flight", {
  id: uuid("id").primaryKey().defaultRandom(),
  date: text("date").notNull(),
  route: text("route").notNull(),
  aircraft: text("aircraft").notNull(),
  duration: text("duration").notNull(),
  type: text("type").notNull(),
});

// Compliance: Duty Log
export const dutyEntry = pgTable("duty_entry", {
  id: uuid("id").primaryKey().defaultRandom(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time"),
  type: text("type").notNull(),
  description: text("description").notNull(),
  duration: text("duration").notNull(),
  status: text("status").notNull(),
});

// Compliance: ReportType
export const reportType = pgTable("report_type", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  estimatedTime: text("estimated_time").notNull(),
  requiredData: text("required_data").array().notNull(),
  category: text("category").notNull(),
});

// ------------------------------------------------------

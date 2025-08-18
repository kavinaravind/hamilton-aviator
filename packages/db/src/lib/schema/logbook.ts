import {
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { LogbookFlightTypeEnum } from "@hamilton/validators/lib/logbook";

export const logbookFlightTypeEnum = pgEnum(
  "logbook_flight_type_enum",
  LogbookFlightTypeEnum.enum,
);

export const Logbook = pgTable("logbook", {
  id: uuid("id").primaryKey().defaultRandom(),
  flightType: logbookFlightTypeEnum("flight_type").notNull(),
  date: timestamp("date").notNull(),
  aircraft: text("aircraft").notNull(),
  tailNumber: text("tail_number").notNull(),
  route: text("route").notNull(),
  duration: numeric("duration").notNull(),
  departureAirport: text("departure_airport").notNull(),
  departureTime: timestamp("departure_time").notNull(),
  arrivalAirport: text("arrival_airport").notNull(),
  arrivalTime: timestamp("arrival_time").notNull(),
  flightTimeTotal: numeric("flight_time_total").notNull(),
  flightTimePic: numeric("flight_time_pic").notNull(),
  flightTimeSic: numeric("flight_time_sic").notNull(),
  flightTimeSolo: numeric("flight_time_solo").notNull(),
  flightTimeDual: numeric("flight_time_dual").notNull(),
  conditionDay: numeric("condition_day").notNull(),
  conditionNight: numeric("condition_night").notNull(),
  conditionActualInstrument: numeric("condition_actual_instrument").notNull(),
  conditionSimulatedInstrument: numeric(
    "condition_simulated_instrument",
  ).notNull(),
  conditionCrossCountry: numeric("condition_cross_country").notNull(),
  landingsDay: integer("landings_day").notNull(),
  landingsNight: integer("landings_night").notNull(),
  approaches: integer("approaches").notNull(),
  holds: integer("holds").notNull(),
  remarks: text("remarks"),
  instructor: text("instructor"),
});

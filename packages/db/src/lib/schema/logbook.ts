import { integer, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { LogbookFlightTypeEnum } from "@hamilton/validators/lib/logbook";

export const logbookFlightTypeEnum = pgEnum(
  "logbook_flight_type_enum",
  LogbookFlightTypeEnum.enum,
);

export const Logbook = pgTable("logbook", {
  id: uuid("id").primaryKey().defaultRandom(),
  date: text("date").notNull(),
  route: text("route").notNull(),
  aircraft: text("aircraft").notNull(),
  duration: text("duration").notNull(),
  tailNumber: text("tail_number").notNull(),
  departureAirport: text("departure_airport").notNull(),
  departureTime: text("departure_time").notNull(),
  arrivalAirport: text("arrival_airport").notNull(),
  arrivalTime: text("arrival_time").notNull(),
  flightTimeTotal: text("flight_time_total").notNull(),
  flightTimePic: text("flight_time_pic").notNull(),
  flightTimeSic: text("flight_time_sic").notNull(),
  flightTimeSolo: text("flight_time_solo").notNull(),
  flightTimeDual: text("flight_time_dual").notNull(),
  conditionDay: text("condition_day").notNull(),
  conditionNight: text("condition_night").notNull(),
  conditionActualInstrument: text("condition_actual_instrument").notNull(),
  conditionSimulatedInstrument: text(
    "condition_simulated_instrument",
  ).notNull(),
  conditionCrossCountry: text("condition_cross_country").notNull(),
  landingsDay: integer("landings_day").notNull(),
  landingsNight: integer("landings_night").notNull(),
  approaches: integer("approaches").notNull(),
  holds: integer("holds").notNull(),
  remarks: text("remarks").notNull(),
  instructor: text("instructor"),
  flightType: logbookFlightTypeEnum("flight_type").notNull(),
});

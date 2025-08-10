import { pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";

import {
  AircraftOwnershipEnum,
  AircraftStatusEnum,
} from "@hamilton/validators/lib/aircraft";

export const aircraftStatusEnum = pgEnum(
  "aircraft_status_enum",
  AircraftStatusEnum.enum,
);

export const aircraftOwnershipEnum = pgEnum(
  "aircraft_ownership_enum",
  AircraftOwnershipEnum.enum,
);

export const Aircraft = pgTable("aircraft", {
  id: uuid("id").primaryKey().defaultRandom(),
  tailNumber: text("tail_number").notNull(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: text("year").notNull(),
  status: aircraftStatusEnum("status").notNull(),
  ownership: aircraftOwnershipEnum("ownership").notNull(),
  totalTime: text("total_time").notNull(),
  engineMake: text("engine_make").notNull(),
  engineModel: text("engine_model").notNull(),
  engineTotalTime: text("engine_total_time").notNull(),
  propellerMake: text("propeller_make").notNull(),
  propellerModel: text("propeller_model").notNull(),
  propellerTotalTime: text("propeller_total_time").notNull(),
  annualDue: text("annual_due").notNull(),
  lastMaintenance: text("last_maintenance").notNull(),
  insuranceCompany: text("insurance_company").notNull(),
  insuranceExpires: text("insurance_expires").notNull(),
  insurancePolicyNumber: text("insurance_policy_number").notNull(),
  registrationExpires: text("registration_expires").notNull(),
  registrationCategory: text("registration_category").notNull(),
  registrationClass: text("registration_class").notNull(),
});

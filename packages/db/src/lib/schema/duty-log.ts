import {
  doublePrecision,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import {
  DutyLogStatusEnum,
  DutyLogTrainingTypeEnum,
  DutyLogTypeEnum,
} from "@hamilton/validators/lib/compliance";

export const dutyLogTypeEnum = pgEnum(
  "duty_log_type_enum",
  DutyLogTypeEnum.enum,
);
export const dutyLogStatusEnum = pgEnum(
  "duty_log_status_enum",
  DutyLogStatusEnum.enum,
);
export const dutyLogTrainingTypeEnum = pgEnum(
  "duty_log_training_type_enum",
  DutyLogTrainingTypeEnum.enum,
);

export const DutyLog = pgTable("duty_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: dutyLogTypeEnum("type").notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  duration: doublePrecision("duration"),
  status: dutyLogStatusEnum("status").notNull(),
  location: text("location"),
  crew: text("crew"),
  aircraft: text("aircraft"),
  flightNumber: text("flight_number"),
  instructor: text("instructor"),
  trainingType: dutyLogTrainingTypeEnum("training_type"),
  notes: text("notes"),
});

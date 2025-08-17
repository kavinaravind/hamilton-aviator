import { z } from "zod/v4";

export const DutyLogTypeEnum = z.enum([
  "flight-duty",
  "training",
  "standby",
  "maintenance",
]);
export type DutyLogType = z.infer<typeof DutyLogTypeEnum>;

export const DutyLogStatusEnum = z.enum(["completed", "active"]);
export type DutyLogStatus = z.infer<typeof DutyLogStatusEnum>;

export const DutyLogTrainingTypeEnum = z.enum([
  "simulator",
  "checkride",
  "recurrent",
  "initial",
  "ground-school",
  "flight-review",
]);
export type DutyLogTrainingType = z.infer<typeof DutyLogTrainingTypeEnum>;

export const DutyLogSummarySchema = z.object({
  id: z.string(),
  type: DutyLogTypeEnum,
  description: z.string().nullable(),
  startTime: z.date(),
  endTime: z.date().nullable(),
  duration: z.number().nullable(),
  status: DutyLogStatusEnum,
});
export type DutyLogSummary = z.infer<typeof DutyLogSummarySchema>;

export const DutyLogSchema = DutyLogSummarySchema.extend({
  location: z.string().nullable(),
  crew: z.string().nullable(),
  aircraft: z.string().nullable(),
  flightNumber: z.string().nullable(),
  instructor: z.string().nullable(),
  trainingType: DutyLogTrainingTypeEnum.nullable(),
  notes: z.string().nullable(),
});
export type DutyLog = z.infer<typeof DutyLogSchema>;

export const DutyLogCreateSchema = DutyLogSchema.omit({
  id: true,
});
export type DutyLogCreate = z.infer<typeof DutyLogCreateSchema>;

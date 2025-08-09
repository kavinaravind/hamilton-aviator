import { z } from "zod/v4";

export const DutyEntrySchema = z.object({
  id: z.string(),
  startTime: z.string(),
  endTime: z.string().nullable(),
  type: z.enum(["flight-duty", "training", "standby", "maintenance"]),
  description: z.string(),
  duration: z.string(),
  status: z.enum(["completed", "active"]),
});
export type DutyEntry = z.infer<typeof DutyEntrySchema>;

export const DetailedDutyEntrySchema = DutyEntrySchema.extend({
  location: z.string().optional(),
  crew: z.array(z.string()).optional(),
  aircraft: z.string().optional(),
  flightNumber: z.string().optional(),
  instructor: z.string().optional(),
  trainingType: z.string().optional(),
  notes: z.string().optional(),
});
export type DetailedDutyEntry = z.infer<typeof DetailedDutyEntrySchema>;

import { z } from "zod/v4";

export const LogbookFlightTypeEnum = z.enum([
  "training",
  "solo",
  "cross-country",
  "local",
  "commercial",
]);
export type LogbookFlightType = z.infer<typeof LogbookFlightTypeEnum>;

export const LogbookSummarySchema = z.object({
  id: z.string(),
  date: z.string(),
  route: z.string(),
  aircraft: z.string(),
  duration: z.string(),
  tailNumber: z.string(),
});
export type LogbookSummary = z.infer<typeof LogbookSummarySchema>;

export const LogbookSchema = LogbookSummarySchema.extend({
  departure: z.object({
    airport: z.string(),
    time: z.string(),
  }),
  arrival: z.object({
    airport: z.string(),
    time: z.string(),
  }),
  flightTime: z.object({
    total: z.string(),
    pic: z.string(),
    sic: z.string(),
    solo: z.string(),
    dual: z.string(),
  }),
  conditions: z.object({
    day: z.string(),
    night: z.string(),
    actualInstrument: z.string(),
    simulatedInstrument: z.string(),
    crossCountry: z.string(),
  }),
  landings: z.object({
    day: z.number(),
    night: z.number(),
  }),
  approaches: z.number(),
  holds: z.number(),
  remarks: z.string(),
  instructor: z.string().optional(),
  flightType: LogbookFlightTypeEnum,
});
export type Logbook = z.infer<typeof LogbookSchema>;

export const LogbookCreateSchema = LogbookSchema.omit({
  id: true,
});
export type LogbookCreate = z.infer<typeof LogbookCreateSchema>;

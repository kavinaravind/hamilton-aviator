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
  id: z.string({ error: "ID is required" }),
  date: z.date({
    error: "Date is required",
  }),
  route: z.string({ error: "Route is required" }),
  duration: z.number({ error: "Duration is required" }),
  aircraft: z.string({ error: "Aircraft is required" }),
  tailNumber: z.string({ error: "Tail number is required" }),
});
export type LogbookSummary = z.infer<typeof LogbookSummarySchema>;

export const LogbookSchema = LogbookSummarySchema.extend({
  flightType: LogbookFlightTypeEnum,
  departure: z.object({
    airport: z.string({ error: "Departure airport is required" }),
    time: z.date({
      error: "Departure time is required",
    }),
  }),
  arrival: z.object({
    airport: z.string({ error: "Arrival airport is required" }),
    time: z.date({
      error: "Arrival time is required",
    }),
  }),
  flightTime: z.object({
    total: z.number({ error: "Total flight time is required" }),
    pic: z.number({ error: "PIC time is required" }),
    sic: z.number({ error: "SIC time is required" }),
    solo: z.number({ error: "Solo time is required" }),
    dual: z.number({ error: "Dual time is required" }),
  }),
  conditions: z.object({
    day: z.number({
      error: "Day condition time is required",
    }),
    night: z.number({
      error: "Night condition time is required",
    }),
    actualInstrument: z.number({
      error: "Actual instrument time is required",
    }),
    simulatedInstrument: z.number({
      error: "Simulated instrument time is required",
    }),
    crossCountry: z.number({
      error: "Cross country time is required",
    }),
  }),
  landings: z.object({
    day: z.number({
      error: "Day landings are required",
    }),
    night: z.number({
      error: "Night landings are required",
    }),
  }),
  approaches: z.number({
    error: "Approaches are required",
  }),
  holds: z.number({
    error: "Holds are required",
  }),
  remarks: z.string().optional(),
  instructor: z.string().optional(),
});
export type Logbook = z.infer<typeof LogbookSchema>;

export const LogbookCreateSchema = LogbookSchema.omit({
  id: true,
});
export type LogbookCreate = z.infer<typeof LogbookCreateSchema>;

export interface LogbookFilter {
  id: string;
  label: string;
  count: number;
}

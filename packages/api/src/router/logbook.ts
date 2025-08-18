import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import type {
  Logbook as TLogbook,
  LogbookCreate as TLogbookCreate,
} from "@hamilton/validators/lib/logbook";
import { desc, eq } from "@hamilton/db";
import { Logbook } from "@hamilton/db/lib/schema";
import {
  LogbookCreateSchema,
  LogbookFlightTypeEnum,
} from "@hamilton/validators/lib/logbook";

import { protectedProcedure } from "../trpc";

export const logbookRouter = {
  all: protectedProcedure.query(async ({ ctx }) => {
    const results = await ctx.db.query.Logbook.findMany({
      orderBy: desc(Logbook.id),
      limit: 10,
    });
    return results.map(toLogbook);
  }),

  byID: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const results = await ctx.db.query.Logbook.findFirst({
        where: eq(Logbook.id, input.id),
      });
      return results ? toLogbook(results) : null;
    }),

  create: protectedProcedure
    .input(LogbookCreateSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(Logbook).values(fromLogbook(input));
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.delete(Logbook).where(eq(Logbook.id, input));
  }),
} satisfies TRPCRouterRecord;

function toLogbook(row: typeof Logbook.$inferSelect): TLogbook {
  return {
    id: row.id,
    date: row.date,
    route: row.route,
    aircraft: row.aircraft,
    duration: Number(row.duration),
    tailNumber: row.tailNumber,
    departure: {
      airport: row.departureAirport,
      time: row.departureTime,
    },
    arrival: {
      airport: row.arrivalAirport,
      time: row.arrivalTime,
    },
    flightTime: {
      total: Number(row.flightTimeTotal),
      pic: Number(row.flightTimePic),
      sic: Number(row.flightTimeSic),
      solo: Number(row.flightTimeSolo),
      dual: Number(row.flightTimeDual),
    },
    conditions: {
      day: Number(row.conditionDay),
      night: Number(row.conditionNight),
      actualInstrument: Number(row.conditionActualInstrument),
      simulatedInstrument: Number(row.conditionSimulatedInstrument),
      crossCountry: Number(row.conditionCrossCountry),
    },
    landings: {
      day: Number(row.landingsDay),
      night: Number(row.landingsNight),
    },
    approaches: Number(row.approaches),
    holds: Number(row.holds),
    remarks: row.remarks ?? undefined,
    instructor: row.instructor ?? undefined,
    flightType: LogbookFlightTypeEnum.parse(row.flightType),
  };
}

function fromLogbook(input: TLogbookCreate): typeof Logbook.$inferInsert {
  return {
    date: input.date,
    route: input.route,
    aircraft: input.aircraft,
    duration: String(input.duration),
    tailNumber: input.tailNumber,
    departureAirport: input.departure.airport,
    departureTime: input.departure.time,
    arrivalAirport: input.arrival.airport,
    arrivalTime: input.arrival.time,
    flightTimeTotal: String(input.flightTime.total),
    flightTimePic: String(input.flightTime.pic),
    flightTimeSic: String(input.flightTime.sic),
    flightTimeSolo: String(input.flightTime.solo),
    flightTimeDual: String(input.flightTime.dual),
    conditionDay: String(input.conditions.day),
    conditionNight: String(input.conditions.night),
    conditionActualInstrument: String(input.conditions.actualInstrument),
    conditionSimulatedInstrument: String(input.conditions.simulatedInstrument),
    conditionCrossCountry: String(input.conditions.crossCountry),
    landingsDay: Number(input.landings.day),
    landingsNight: Number(input.landings.night),
    approaches: Number(input.approaches),
    holds: Number(input.holds),
    remarks: input.remarks,
    instructor: input.instructor,
    flightType: input.flightType,
  };
}

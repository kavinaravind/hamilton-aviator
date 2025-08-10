import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import type { Logbook as TLogbook } from "@hamilton/validators/lib/logbook";
import { desc, eq } from "@hamilton/db";
import { Logbook } from "@hamilton/db/lib/schema";
import {
  LogbookFlightTypeEnum,
  LogbookSchema,
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

  create: protectedProcedure.input(LogbookSchema).mutation(({ ctx, input }) => {
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
    duration: row.duration,
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
      total: row.flightTimeTotal,
      pic: row.flightTimePic,
      sic: row.flightTimeSic,
      solo: row.flightTimeSolo,
      dual: row.flightTimeDual,
    },
    conditions: {
      day: row.conditionDay,
      night: row.conditionNight,
      actualInstrument: row.conditionActualInstrument,
      simulatedInstrument: row.conditionSimulatedInstrument,
      crossCountry: row.conditionCrossCountry,
    },
    landings: {
      day: row.landingsDay,
      night: row.landingsNight,
    },
    approaches: row.approaches,
    holds: row.holds,
    remarks: row.remarks,
    instructor: row.instructor ?? undefined,
    flightType: LogbookFlightTypeEnum.parse(row.flightType),
  };
}

function fromLogbook(input: TLogbook): typeof Logbook.$inferInsert {
  return {
    id: input.id,
    date: input.date,
    route: input.route,
    aircraft: input.aircraft,
    duration: input.duration,
    tailNumber: input.tailNumber,
    departureAirport: input.departure.airport,
    departureTime: input.departure.time,
    arrivalAirport: input.arrival.airport,
    arrivalTime: input.arrival.time,
    flightTimeTotal: input.flightTime.total,
    flightTimePic: input.flightTime.pic,
    flightTimeSic: input.flightTime.sic,
    flightTimeSolo: input.flightTime.solo,
    flightTimeDual: input.flightTime.dual,
    conditionDay: input.conditions.day,
    conditionNight: input.conditions.night,
    conditionActualInstrument: input.conditions.actualInstrument,
    conditionSimulatedInstrument: input.conditions.simulatedInstrument,
    conditionCrossCountry: input.conditions.crossCountry,
    landingsDay: input.landings.day,
    landingsNight: input.landings.night,
    approaches: input.approaches,
    holds: input.holds,
    remarks: input.remarks,
    instructor: input.instructor,
    flightType: input.flightType,
  };
}

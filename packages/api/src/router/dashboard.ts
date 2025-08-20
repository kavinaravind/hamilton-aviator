import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import {
  count,
  desc,
  eq,
  gte,
  inArray,
  isNotNull,
  sql,
  sum,
} from "@hamilton/db";
import { Aircraft, DutyLog, Logbook } from "@hamilton/db/lib/schema";

import { protectedProcedure } from "../trpc";

export const dashboardRouter = {
  flightStatistics: protectedProcedure
    .input(
      z.object({
        period: z.enum(["week", "month", "year"]).default("week"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .select({
          totalTime: sum(Logbook.flightTimeTotal),
          pic: sum(Logbook.flightTimePic),
          periodTime: sql`SUM(CASE WHEN ${Logbook.date} >= DATE_TRUNC(${input.period}, NOW()) THEN ${Logbook.flightTimeTotal} ELSE 0 END)`,
          periodFlights: sql`COUNT(CASE WHEN ${Logbook.date} >= DATE_TRUNC(${input.period}, NOW()) THEN 1 ELSE NULL END)`,
        })
        .from(Logbook);

      return {
        totalTime: Number(result?.totalTime ?? 0).toFixed(1),
        pic: Number(result?.pic ?? 0).toFixed(1),
        periodTime: Number(result?.periodTime ?? 0).toFixed(1),
        periodFlights: Number(result?.periodFlights ?? 0),
      };
    }),

  aircraftStatus: protectedProcedure.query(async ({ ctx }) => {
    const [result] = await ctx.db
      .select({
        total: count(),
        airworthy: sql`sum(case when ${eq(Aircraft.status, "airworthy")} then 1 else 0 end)`,
        maintenance: sql`sum(case when ${inArray(Aircraft.status, ["maintenance-due", "maintenance-soon"])} then 1 else 0 end)`,
      })
      .from(Aircraft);

    return {
      total: Number(result?.total ?? 0),
      airworthy: Number(result?.airworthy ?? 0),
      maintenance: Number(result?.maintenance ?? 0),
    };
  }),

  dutyCompliance: protectedProcedure.query(async ({ ctx }) => {
    const [result] = await ctx.db
      .select({
        activeDutyCount: sql`sum(case when ${eq(DutyLog.status, "active")} then 1 else 0 end)`,
        totalDuration: sum(DutyLog.duration),
      })
      .from(DutyLog)
      .where(gte(DutyLog.startTime, sql`NOW() - INTERVAL '30 days'`));

    const totalHours = parseFloat(result?.totalDuration ?? "0");
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);

    return {
      activeDuty: Number(result?.activeDutyCount ?? 0),
      monthlyHours: `${hours}h ${minutes}m`,
      remainingDuty: "72.5", // TODO: calculate based on rules
    };
  }),

  maintenanceAlerts: protectedProcedure.query(async ({ ctx }) => {
    const alerts = await ctx.db
      .select({
        id: Aircraft.id,
        tailNumber: Aircraft.tailNumber,
        type: sql<string>`'Annual Inspection'`,
        dueInDays:
          sql<number>`${Aircraft.annualDue}::date - CURRENT_DATE`.mapWith(
            Number,
          ),
        urgent: sql<boolean>`(${Aircraft.annualDue}::date - CURRENT_DATE) <= 30`,
      })
      .from(Aircraft)
      .where(isNotNull(Aircraft.annualDue))
      .orderBy(Aircraft.annualDue, desc(Aircraft.lastMaintenance))
      .limit(5);

    return alerts;
  }),

  recentFlights: protectedProcedure.query(async ({ ctx }) => {
    const flights = await ctx.db
      .select({
        id: Logbook.id,
        date: Logbook.date,
        route: Logbook.route,
        aircraft: Logbook.aircraft,
        duration: Logbook.duration,
        type: Logbook.flightType,
      })
      .from(Logbook)
      .orderBy(desc(Logbook.date))
      .limit(5);

    return flights;
  }),
} satisfies TRPCRouterRecord;

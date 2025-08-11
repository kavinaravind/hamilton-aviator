import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { desc, gte, sql } from "@hamilton/db";
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
      // Get the current date and calculate the start date for the selected period
      const now = new Date();
      let periodDays = 30;
      if (input.period === "week") periodDays = 7;
      if (input.period === "year") periodDays = 365;
      const periodStart = new Date(
        now.getTime() - 1000 * 60 * 60 * 24 * periodDays,
      ).toISOString();

      // Aggregate totalTime and pic for all time
      const [totals] = await ctx.db
        .select({
          totalTime: sql`SUM(CAST(${Logbook.duration} AS float))`.as(
            "totalTime",
          ),
          pic: sql`SUM(CAST(${Logbook.flightTimePic} AS float))`.as("pic"),
        })
        .from(Logbook);

      // Aggregate periodTime and periodFlights for the selected period
      const [periodAgg] = await ctx.db
        .select({
          periodTime: sql`SUM(CAST(${Logbook.duration} AS float))`.as(
            "periodTime",
          ),
          periodFlights: sql`COUNT(${Logbook.id})`.as("periodFlights"),
        })
        .from(Logbook)
        .where(gte(Logbook.date, periodStart));

      return {
        totalTime: (totals?.totalTime ?? 0).toFixed(1),
        pic: (totals?.pic ?? 0).toFixed(1),
        periodTime: (periodAgg?.periodTime ?? 0).toFixed(1),
        periodFlights: Number(periodAgg?.periodFlights ?? 0),
      };
    }),

  aircraftStatus: protectedProcedure.query(async ({ ctx }) => {
    const [result] = await ctx.db
      .select({
        total: sql`COUNT(*)`.as("total"),
        airworthy:
          sql`SUM(CASE WHEN ${Aircraft.status} = 'airworthy' THEN 1 ELSE 0 END)`.as(
            "airworthy",
          ),
        maintenance:
          sql`SUM(CASE WHEN ${Aircraft.status} IN ('maintenance-due', 'maintenance-soon') THEN 1 ELSE 0 END)`.as(
            "maintenance",
          ),
      })
      .from(Aircraft);
    return {
      total: Number(result?.total ?? 0),
      airworthy: Number(result?.airworthy ?? 0),
      maintenance: Number(result?.maintenance ?? 0),
    };
  }),

  dutyCompliance: protectedProcedure.query(async ({ ctx }) => {
    // Example: active duty logs, monthly hours, remaining, next rest
    const now = new Date();
    const monthAgo = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30);
    const logs = await ctx.db.query.DutyLog.findMany({
      where: gte(DutyLog.startTime, monthAgo.toISOString()),
    });
    const activeDuty = logs.filter((l) => l.status === "active").length;
    const monthlyHours = logs.reduce(
      (acc, l) => acc + parseFloat(l.duration || "0"),
      0,
    );
    // For demo, remainingDuty and nextRest are placeholders
    return {
      activeDuty,
      monthlyHours: monthlyHours.toFixed(1),
      remainingDuty: "72.5", // TODO: calculate based on rules
      nextRest: "14:30", // TODO: calculate based on rules
    };
  }),

  maintenanceAlerts: protectedProcedure.query(async ({ ctx }) => {
    const aircraft = await ctx.db.query.Aircraft.findMany({
      orderBy: [Aircraft.annualDue, desc(Aircraft.lastMaintenance)],
      limit: 5,
    });
    const now = new Date();
    return aircraft.map((a) => {
      let dueInDays = null;
      let urgent = false;
      if (a.annualDue) {
        const dueDate = new Date(a.annualDue);
        dueInDays = Math.ceil(
          (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
        );
        urgent = dueInDays <= 30;
      }
      return {
        id: a.id,
        tailNumber: a.tailNumber,
        type: "Annual Inspection",
        dueInDays,
        urgent,
      };
    });
  }),

  recentFlights: protectedProcedure.query(async ({ ctx }) => {
    const flights = await ctx.db.query.Logbook.findMany({
      orderBy: desc(Logbook.date),
      limit: 5,
    });
    return flights.map((f) => ({
      id: f.id,
      date: f.date,
      route: f.route,
      aircraft: f.aircraft,
      duration: f.duration,
      type: f.flightType,
    }));
  }),
} satisfies TRPCRouterRecord;

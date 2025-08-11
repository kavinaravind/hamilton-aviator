import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { desc, gte, sql } from "@hamilton/db";
import { DutyLog, Logbook } from "@hamilton/db/lib/schema";

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
    const all = await ctx.db.query.Aircraft.findMany();
    const total = all.length;
    const airworthy = all.filter((a) => a.status === "airworthy").length;
    const maintenance = all.filter(
      (a) => a.status === "maintenance-due",
    ).length;
    const maintenanceSoon = all.filter(
      (a) => a.status === "maintenance-soon",
    ).length;
    return { total, airworthy, maintenance, maintenanceSoon };
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
    const all = await ctx.db.query.Aircraft.findMany();
    // Example: due if annualDue or lastMaintenance is within 30 days or 10 hours
    const now = new Date();
    const soon = all.filter((a) => {
      // Parse dates, check if due soon (placeholder logic)
      const dueDate = new Date(a.annualDue);
      return dueDate.getTime() - now.getTime() < 1000 * 60 * 60 * 24 * 30;
    });
    return soon.map((a) => ({
      id: a.id,
      aircraftId: a.tailNumber,
      type: "Annual Inspection",
      dueInDays: Math.ceil(
        (new Date(a.annualDue).getTime() - now.getTime()) /
          (1000 * 60 * 60 * 24),
      ),
      urgent: true,
    }));
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

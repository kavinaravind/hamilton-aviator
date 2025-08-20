import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { desc, eq } from "@hamilton/db";
import { DutyLog } from "@hamilton/db/lib/schema";
import { DutyLogCreateSchema } from "@hamilton/validators/lib/compliance";

import { protectedProcedure } from "../trpc";

export const dutyLogRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.DutyLog.findMany({
      orderBy: desc(DutyLog.id),
      limit: 10,
    });
  }),

  byID: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.DutyLog.findFirst({
        where: eq(DutyLog.id, input.id),
      });
    }),

  create: protectedProcedure
    .input(DutyLogCreateSchema)
    .mutation(({ ctx, input }) => {
      if (input.endTime) {
        const start = input.startTime.getTime();
        const end = input.endTime.getTime();
        if (!isNaN(start) && !isNaN(end) && end > start) {
          const rawDuration = (end - start) / (1000 * 60 * 60);
          input.duration = Math.round(rawDuration * 100) / 100;
        }
      }
      return ctx.db.insert(DutyLog).values(input);
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.delete(DutyLog).where(eq(DutyLog.id, input));
  }),
} satisfies TRPCRouterRecord;

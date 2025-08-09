import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { desc, eq } from "@hamilton/db";
import { Aircraft } from "@hamilton/db/lib/schema";
import { CreateAircraftSchema } from "@hamilton/validators/lib/aircraft";

import { protectedProcedure, publicProcedure } from "../trpc";

export const aircraftRouter = {
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.Aircraft.findMany({
      orderBy: desc(Aircraft.id),
      limit: 20,
    });
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.Aircraft.findFirst({
        where: eq(Aircraft.id, input.id),
      });
    }),

  create: protectedProcedure
    .input(CreateAircraftSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(Aircraft).values(input);
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.delete(Aircraft).where(eq(Aircraft.id, input));
  }),
} satisfies TRPCRouterRecord;

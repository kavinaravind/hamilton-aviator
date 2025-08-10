import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import type { Aircraft as TAircraft } from "@hamilton/validators/lib/aircraft";
import { desc, eq } from "@hamilton/db";
import { Aircraft } from "@hamilton/db/lib/schema";
import {
  AircraftOwnershipEnum,
  AircraftSchema,
  AircraftStatusEnum,
} from "@hamilton/validators/lib/aircraft";

import { protectedProcedure } from "../trpc";

export const aircraftRouter = {
  all: protectedProcedure.query(async ({ ctx }) => {
    const results = await ctx.db.query.Aircraft.findMany({
      orderBy: desc(Aircraft.id),
      limit: 10,
    });
    return results.map(toAircraft);
  }),

  byID: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const results = await ctx.db.query.Aircraft.findFirst({
        where: eq(Aircraft.id, input.id),
      });
      return results ? toAircraft(results) : null;
    }),

  create: protectedProcedure
    .input(AircraftSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(Aircraft).values(fromAircraft(input));
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.delete(Aircraft).where(eq(Aircraft.id, input));
  }),
} satisfies TRPCRouterRecord;

function toAircraft(row: typeof Aircraft.$inferSelect): TAircraft {
  return {
    id: row.id,
    tailNumber: row.tailNumber,
    make: row.make,
    model: row.model,
    status: AircraftStatusEnum.parse(row.status),
    ownership: AircraftOwnershipEnum.parse(row.ownership),
    year: row.year,
    totalTime: row.totalTime,
    engine: {
      make: row.engineMake,
      model: row.engineModel,
      totalTime: row.engineTotalTime,
    },
    propeller: {
      make: row.propellerMake,
      model: row.propellerModel,
      totalTime: row.propellerTotalTime,
    },
    annualDue: row.annualDue,
    lastMaintenance: row.lastMaintenance,
    insurance: {
      company: row.insuranceCompany,
      expires: row.insuranceExpires,
      policyNumber: row.insurancePolicyNumber,
    },
    registration: {
      expires: row.registrationExpires,
      category: row.registrationCategory,
      class: row.registrationClass,
    },
  };
}

function fromAircraft(input: TAircraft): typeof Aircraft.$inferInsert {
  return {
    ...input,
    engineMake: input.engine.make,
    engineModel: input.engine.model,
    engineTotalTime: input.engine.totalTime,
    propellerMake: input.propeller.make,
    propellerModel: input.propeller.model,
    propellerTotalTime: input.propeller.totalTime,
    insuranceCompany: input.insurance.company,
    insuranceExpires: input.insurance.expires,
    insurancePolicyNumber: input.insurance.policyNumber,
    registrationExpires: input.registration.expires,
    registrationCategory: input.registration.category,
    registrationClass: input.registration.class,
  };
}

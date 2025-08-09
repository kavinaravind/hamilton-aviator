import { z } from "zod/v4";

export const AircraftStatusEnum = z.enum([
  "airworthy",
  "maintenance-soon",
  "maintenance-due",
]);
export type AircraftStatus = z.infer<typeof AircraftStatusEnum>;

export const AircraftOwnershipEnum = z.enum(["owned", "rented"]);
export type AircraftOwnership = z.infer<typeof AircraftOwnershipEnum>;

export const AircraftSchema = z.object({
  id: z.string(),
  tailNumber: z.string(),
  make: z.string(),
  model: z.string(),
  status: AircraftStatusEnum,
  ownership: AircraftOwnershipEnum,
});
export type Aircraft = z.infer<typeof AircraftSchema>;

export const DetailedAircraftSchema = AircraftSchema.extend({
  year: z.string(),
  totalTime: z.string(),
  engine: z.object({
    make: z.string(),
    model: z.string(),
    totalTime: z.string(),
  }),
  propeller: z.object({
    make: z.string(),
    model: z.string(),
    totalTime: z.string(),
  }),
  annualDue: z.string(),
  lastMaintenance: z.string(),
  insurance: z.object({
    company: z.string(),
    expires: z.string(),
    policyNumber: z.string(),
  }),
  registration: z.object({
    expires: z.string(),
    category: z.string(),
    class: z.string(),
  }),
});
export type DetailedAircraft = z.infer<typeof DetailedAircraftSchema>;

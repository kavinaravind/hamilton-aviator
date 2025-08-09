import { z } from "zod/v4";

export const ComplianceReportSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  type: z.enum(["duty-log", "flight-time", "rest-period"]),
  status: z.enum(["pending", "approved", "rejected"]),
  notes: z.string().optional(),
});
export type ComplianceReport = z.infer<typeof ComplianceReportSchema>;

import { z } from "zod/v4";

export const ReportTypeSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  color: z.string(),
  estimatedTime: z.string(),
  requiredData: z.array(z.string()),
  category: z.string(),
});
export type ReportType = z.infer<typeof ReportTypeSchema>;

export const ReportCreateSchema = ReportTypeSchema.omit({
  id: true,
});
export type ReportCreate = z.infer<typeof ReportCreateSchema>;

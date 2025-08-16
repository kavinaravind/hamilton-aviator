import type { TRPCRouterRecord } from "@trpc/server";
import PDFDocument from "pdfkit";
import { z } from "zod/v4";

import { desc, eq } from "@hamilton/db";
import { Report } from "@hamilton/db/lib/schema";
import { ReportCreateSchema } from "@hamilton/validators/lib/compliance";

import { protectedProcedure } from "../trpc";

export const reportRouter = {
  generatePDF: protectedProcedure.mutation(() => {
    return new Promise<Uint8Array>((resolve, reject) => {
      const buffers: Buffer[] = [];

      const doc = new PDFDocument({ bufferPages: true });

      doc.on("data", (chunk: Buffer) => buffers.push(chunk));
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        resolve(new Uint8Array(pdfData));
      });
      doc.on("error", reject);

      doc.text("Hamilton Aviator - Sample PDF", {
        align: "center",
      });

      doc.end();
    });
  }),
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.Report.findMany({
      orderBy: desc(Report.id),
      limit: 10,
    });
  }),

  byID: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.Report.findFirst({
        where: eq(Report.id, input.id),
      });
    }),

  create: protectedProcedure
    .input(ReportCreateSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(Report).values(input);
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.delete(Report).where(eq(Report.id, input));
  }),
} satisfies TRPCRouterRecord;

import { aircraftRouter } from "./router/aircraft";
import { authRouter } from "./router/auth";
import { dutyLogRouter } from "./router/duty-log";
import { logbookRouter } from "./router/logbook";
import { reportRouter } from "./router/report";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  aircraft: aircraftRouter,
  logbook: logbookRouter,
  dutyLog: dutyLogRouter,
  report: reportRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

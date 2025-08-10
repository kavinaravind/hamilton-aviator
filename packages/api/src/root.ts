import { aircraftRouter } from "./router/aircraft";
import { authRouter } from "./router/auth";
import { logbookRouter } from "./router/logbook";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  aircraft: aircraftRouter,
  logbook: logbookRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

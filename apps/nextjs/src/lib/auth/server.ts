import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { env } from "@/env";

import { initAuth } from "@hamilton/auth";

let baseUrl: string;
switch (env.VERCEL_ENV) {
  case "production":
    baseUrl = `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
    break;
  case "preview":
    baseUrl = `https://${env.VERCEL_URL}`;
    break;
  default:
    baseUrl = "http://localhost:3000";
    break;
}

export const auth = initAuth({
  baseUrl,
  productionUrl: baseUrl,
  trustedOrigins: [baseUrl, `${env.AUTH_EXPO_ORIGIN}`],
  secret: env.AUTH_SECRET,
  discordClientId: env.AUTH_DISCORD_ID,
  discordClientSecret: env.AUTH_DISCORD_SECRET,
});

export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);

import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { env } from "@/env";

import type { InitAuthOptions } from "@hamilton/auth";
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

const config: InitAuthOptions = {
  baseUrl,
  productionUrl: baseUrl,
  secret: env.AUTH_SECRET,
  providers: {
    google: {
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    },
    github: {
      clientId: env.AUTH_GITHUB_ID,
      clientSecret: env.AUTH_GITHUB_SECRET,
    },
  },
  trustedOrigins: [baseUrl, `${env.AUTH_EXPO_ORIGIN}`],
};

export const auth = initAuth(config);

export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);

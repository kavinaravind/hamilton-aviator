import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { env } from "@/env";

import type { InitAuthOptions } from "@hamilton/auth";
import { initAuth } from "@hamilton/auth";

let baseUrl: string;
if (env.BASE_URL) {
  baseUrl = env.BASE_URL;
} else {
  baseUrl = `http://localhost:${process.env.PORT ?? 3000}`;
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
  trustedOrigins: ["expo://"],
};

export const auth = initAuth(config);

export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);

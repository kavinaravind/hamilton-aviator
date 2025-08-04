import type { BetterAuthOptions } from "better-auth";
import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { oAuthProxy } from "better-auth/plugins";

import { db } from "@hamilton/db/client";

export interface InitAuthOptions {
  baseUrl: string;
  productionUrl: string;
  secret: string | undefined;
  providers: {
    google: {
      clientId: string;
      clientSecret: string;
    };
    github: {
      clientId: string;
      clientSecret: string;
    };
    discord: {
      clientId: string;
      clientSecret: string;
    };
  };
  trustedOrigins: string[];
}

export function initAuth(options: InitAuthOptions) {
  const config: BetterAuthOptions = {
    database: drizzleAdapter(db, {
      provider: "pg",
    }),
    baseURL: options.baseUrl,
    secret: options.secret,
    plugins: [
      oAuthProxy({
        /**
         * Auto-inference blocked by https://github.com/better-auth/better-auth/pull/2891
         */
        currentURL: options.baseUrl,
        productionURL: options.productionUrl,
      }),
      expo(),
    ],
    socialProviders: {
      google: {
        clientId: options.providers.google.clientId,
        clientSecret: options.providers.google.clientSecret,
        redirectURI: `${options.productionUrl}/api/auth/callback/google`,
      },
      github: {
        clientId: options.providers.google.clientId,
        clientSecret: options.providers.google.clientSecret,
        redirectURI: `${options.productionUrl}/api/auth/callback/github`,
      },
      discord: {
        clientId: options.providers.discord.clientId,
        clientSecret: options.providers.discord.clientSecret,
        redirectURI: `${options.productionUrl}/api/auth/callback/discord`,
      },
    },
    trustedOrigins: options.trustedOrigins,
  };

  return betterAuth(config);
}

export type Auth = ReturnType<typeof initAuth>;
export type Session = Auth["$Infer"]["Session"];

import * as SecureStore from "expo-secure-store";
import { getBaseUrl } from "@/lib/auth/base-url";
import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
  plugins: [
    expoClient({
      scheme: "expo",
      storagePrefix: "expo",
      storage: SecureStore,
    }),
  ],
});

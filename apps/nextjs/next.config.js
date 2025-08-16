import path from "node:path";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);
// Import env files to validate at build time. Use jiti so we can load .ts files in here.
await jiti.import("./src/env");

/** @type {import("next").NextConfig} */
const config = {
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@hamilton/api",
    "@hamilton/auth",
    "@hamilton/db",
    "@hamilton/ui",
    "@hamilton/validators",
  ],

  /** Packages that should be treated as external to the server */
  serverExternalPackages: ["pdfkit"],

  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  /** https://nextjs.org/docs/pages/api-reference/config/next-config-js/output#automatically-copying-traced-files */
  output: "standalone",
  outputFileTracingRoot: path.join(
    path.dirname(new URL(import.meta.url).pathname),
    "../../",
  ),
};

export default config;

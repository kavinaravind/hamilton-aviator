import baseConfig, { restrictEnvAccess } from "@hamilton/eslint-config/base";
import nextjsConfig from "@hamilton/eslint-config/nextjs";
import reactConfig from "@hamilton/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];

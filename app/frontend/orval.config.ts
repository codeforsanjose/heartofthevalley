import { defineConfig } from "orval";

if (!process.env.API_SPEC) {
  throw new Error("API_SPEC environment variable is not set");
}

export default defineConfig({
  api: {
    input: { target: process.env.API_SPEC },
    output: {
      target: "./lib/api-client.ts",
      baseUrl: process.env.VITE_API_URL!,
      client: "react-query",
    },
    hooks: {
      afterAllFilesWrite: "prettier --write",
    },
  },
});

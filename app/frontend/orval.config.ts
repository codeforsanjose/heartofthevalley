import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: { target: process.env.API_SPEC || "../../openapi.yaml" },
    output: {
      target: "./lib/api-client.ts",
      baseUrl: process.env.VITE_API_URL || "http://localhost:8080",
      client: "react-query",
    },
    hooks: {
      afterAllFilesWrite: "prettier --write",
    },
  },
});

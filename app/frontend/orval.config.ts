import { defineConfig } from "orval";

if (!process.env.API_SPEC) {
  throw new Error("API_SPEC environment variable is not set");
}

export default defineConfig({
  api: {
    input: { target: process.env.API_SPEC },
    output: {
      target: "./lib/api-client.ts",
      baseUrl: {
        getBaseUrlFromSpecification: true,
        index: process.env.NODE_ENV === "production" ? 0 : 1,
      },
      client: "react-query",
      mode: "split",
      override: {
        operations: {
          listFeatures: {
            query: {
              useInfinite: true,
              useInfiniteQueryParam: "lastFeatureId",
            },
          },
        },
      },
    },
  },
});

import { defineConfig } from "orval";

if (!process.env.API_SPEC) {
  throw new Error("API_SPEC environment variable is not set");
}

export default defineConfig({
  api: {
    input: { target: process.env.API_SPEC },
    output: {
      target: "./lib/api-client.ts",
      baseUrl: process.env.API_URL,
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
        ...(!process.env.API_URL && {
          mutator: {
            path: "./lib/dev-axios-config.ts",
            name: "myAxios",
          },
        }),
      },
      ...(process.env.API_URL && { baseUrl: process.env.API_URL }),
    },
  },
});

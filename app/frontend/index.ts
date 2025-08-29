import { Hono } from "hono";
import { apply } from "vike-server/hono";
import { serve } from "vike-server/hono/serve";
import { handle } from "hono/aws-lambda";

const app = new Hono();
apply(app, {
  static: {
    root: "/var/task/client",
  },
});

const startServer = async () => {
  return serve(app, {
    port: 3000,
    hostname: "localhost",
  });
};

if (import.meta.main) {
  await startServer();
}

export const handler = handle(app);

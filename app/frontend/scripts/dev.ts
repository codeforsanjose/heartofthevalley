import orval from "orval";
import path from "path";
import { dev } from "vike/api";

console.log("Generating API client...");
await orval(path.resolve(__dirname, "../orval.config.ts"));

console.log("Starting dev server...");
const { viteServer } = await dev();
await viteServer.listen();
viteServer.printUrls();

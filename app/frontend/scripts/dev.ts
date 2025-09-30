import orval from "orval";
import path from "path";
import { build, preview } from "vike/api";

console.log("Generating API client...");
await orval(path.resolve(__dirname, "../orval.config.ts"));

console.log("Starting build...");
await build();

console.log("Starting dev server...");
const { viteServer } = await preview();
viteServer?.printUrls();

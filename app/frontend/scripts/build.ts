import orval from "orval";
import path from "path";
import { build } from "vike/api";

console.log("Generating API client...");
await orval(path.resolve(__dirname, "../orval.config.ts"));

console.log("Building...");
await build();

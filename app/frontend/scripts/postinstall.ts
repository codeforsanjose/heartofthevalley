import orval from "orval";
import path from "path";

console.log("Generating API client...");
await orval(path.resolve(__dirname, "../orval.config.ts"));

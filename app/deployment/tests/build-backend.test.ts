import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import fs from "fs";
import path from "path";
import { buildBackend } from "../scripts/build-backend";

describe("buildBackend integration test", () => {
  const outputDir = path.resolve(__dirname, "../dist/backend");
  const bootstrapFile = path.join(outputDir, "bootstrap");

  beforeEach(() => {
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { force: true, recursive: true });
    }
  });

  afterEach(() => {
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { force: true, recursive: true });
    }
  });

  it("should build backend and create bootstrap binary", async () => {
    await buildBackend({ verbose: true });

    expect(fs.existsSync(outputDir)).toBe(true);
    expect(fs.existsSync(bootstrapFile)).toBe(true);

    // Verify the bootstrap file is executable (has some size)
    const stats = fs.statSync(bootstrapFile);
    expect(stats.size).toBeGreaterThan(0);

    console.log(
      `Bootstrap binary created: ${bootstrapFile} (${stats.size} bytes)`,
    );
  }, 600000); // 10 minute timeout for Rust compilation
});

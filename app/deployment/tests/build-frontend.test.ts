import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import fs from "fs";
import path from "path";
import { buildFrontend } from "../scripts/build-frontend";

describe("buildFrontend integration test", () => {
  const outputDir = path.resolve(__dirname, "../dist/frontend");

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

  it("should build frontend and create output files", async () => {
    // Use the staging API endpoint for testing
    await buildFrontend(
      "https://00bv7ia0ab.execute-api.us-west-2.amazonaws.com",
      { verbose: true },
    );

    expect(fs.existsSync(outputDir)).toBe(true);

    const outputFiles = fs.readdirSync(outputDir);
    expect(outputFiles).toContain("client");
  }, 30000);
});

import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

type BuildFrontendConfig = {
  verbose?: boolean;
};

const defaultConfig: Required<BuildFrontendConfig> = {
  verbose: false,
};

export const buildFrontend = async (cfgOverride: BuildFrontendConfig) => {
  const cfg = { ...defaultConfig, ...cfgOverride };
  const { verbose } = cfg;
  if (verbose) {
    console.log("Starting frontend build with configuration:", cfg);
  }

  // Build the frontend
  const buildProcess = Bun.spawnSync({
    cmd: ["bun", "run", "build"],
    cwd: path.resolve(__dirname, "../../frontend"),
    stdout: "pipe",
    stderr: "pipe",
  });
  if (verbose) {
    console.log("Build process output:", buildProcess.stdout.toString());
  }
  if (buildProcess.exitCode !== 0) {
    console.error("Build failed with error:", buildProcess.stderr.toString());
    throw new Error("Frontend build failed");
  }

  // Move the built files to the dist directory
  const outPath = path.resolve(__dirname, "../dist/frontend");
  const currentPath = path.resolve(__dirname, "../../frontend/dist");
  const moveProcess = Bun.spawnSync({
    cmd: ["mv", currentPath, outPath],
    stdout: "pipe",
    stderr: "pipe",
  });
  if (moveProcess.exitCode !== 0) {
    console.error("Failed to move built files:", moveProcess.stderr.toString());
    throw new Error("Frontend build failed");
  }
};

if (require.main === module) {
  const argv = yargs(hideBin(process.argv))
    .option("verbose", {
      type: "boolean",
      description: "Enable verbose output",
      default: false,
    })
    .parseSync();

  await buildFrontend(argv);
}

import { spawnSync } from "child_process";
import { mkdirSync, copyFileSync } from "fs";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

type BuildBackendConfig = {
  verbose?: boolean;
};

const defaultConfig: Required<BuildBackendConfig> = {
  verbose: false,
};

export const buildBackend = async (cfgOverride: BuildBackendConfig) => {
  const cfg = { ...defaultConfig, ...cfgOverride };
  const { verbose } = cfg;

  if (verbose) {
    console.log("Starting backend build with configuration:", cfg);
  }

  // Set up paths
  const projectRoot = path.resolve(__dirname, "../../..");
  const distDir = path.join(projectRoot, "app/deployment/dist");
  const backendBuildScript = path.join(
    projectRoot,
    "app/backend/xtask/build_project.rs",
  );
  const sourceBinary = path.join(
    projectRoot,
    "app/backend/target/release/backend",
  );
  const targetBinary = path.join(distDir, "backend/bootstrap");

  // Ensure dist directories exist
  mkdirSync(path.join(distDir, "backend"), { recursive: true });

  if (verbose) {
    console.log("Building backend...");
  }
  const buildArgs = verbose ? ["--verbose"] : [];
  const buildResult = spawnSync(
    "cargo",
    ["run", "--bin", "build_project", "--", ...buildArgs],
    {
      cwd: path.join(projectRoot, "app/backend/xtask"),
      stdio: verbose ? "inherit" : "pipe",
      encoding: "utf8",
    },
  );

  if (buildResult.error) {
    throw new Error(
      `Failed to execute backend build script: ${buildResult.error.message}`,
    );
  }

  if (buildResult.status !== 0) {
    const errorOutput =
      buildResult.stderr || buildResult.stdout || "Unknown error";
    throw new Error(
      `Backend build script failed with status ${buildResult.status}: ${errorOutput}`,
    );
  }

  if (verbose) {
    console.log("Copying backend binary to dist directory...");
  }

  // Copy the backend binary to the dist directory
  try {
    copyFileSync(sourceBinary, targetBinary);
  } catch (error) {
    throw new Error(
      `Failed to copy backend binary: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  console.log("✅ Backend deployment build completed successfully");
};

if (require.main === module) {
  const argv = yargs(hideBin(process.argv))
    .option("verbose", {
      type: "boolean",
      description: "Enable verbose output",
      default: false,
    })
    .parseSync();

  await buildBackend({ verbose: argv.verbose });
}

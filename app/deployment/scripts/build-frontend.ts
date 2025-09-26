import {
  copyFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  renameSync,
  rmSync,
} from "fs";
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

  // Install dependencies
  const installProcess = Bun.spawnSync({
    cmd: ["bun", "install"],
    cwd: path.resolve(__dirname, "../../frontend"),
    stdout: "pipe",
    stderr: "pipe",
    env: {
      ...process.env,
      API_SPEC: path.resolve(__dirname, "../../../openapi.yaml"),
      NODE_ENV: "production",
    },
  });
  if (verbose) {
    console.log("Install process output:", installProcess.stdout.toString());
  }
  if (installProcess.exitCode !== 0) {
    console.error(
      "Dependency installation failed with error:",
      installProcess.stderr.toString()
    );
    throw new Error("Frontend build failed");
  }

  // Build the frontend
  const buildProcess = Bun.spawnSync({
    cmd: ["bun", "run", "build"],
    cwd: path.resolve(__dirname, "../../frontend"),
    stdout: "pipe",
    stderr: "pipe",
    env: {
      ...process.env,
      API_SPEC: path.resolve(__dirname, "../../../openapi.yaml"),
      NODE_ENV: "production",
    },
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
  if (existsSync(outPath)) rmSync(outPath, { force: true, recursive: true });
  mkdirSync(path.dirname(outPath), { recursive: true });
  renameSync(currentPath, outPath);
  if (verbose) {
    console.log(`Built frontend moved to ${outPath}`);
    console.log("Frontend build completed successfully.");
  }

  // // Copy node_modules to dist for server-side rendering
  // const nodeModulesSrc = path.resolve(__dirname, "../../frontend/node_modules");
  // const nodeModulesDest = path.resolve(
  //   __dirname,
  //   "../dist/frontend/node_modules"
  // );
  // if (existsSync(nodeModulesDest))
  //   rmSync(nodeModulesDest, { force: true, recursive: true });
  // cpSync(nodeModulesSrc, nodeModulesDest, { recursive: true });
  // if (verbose) {
  //   console.log(`node_modules moved to ${nodeModulesDest}`);
  // }
};

if (require.main === module) {
  const argv = yargs(hideBin(process.argv))
    .option("verbose", {
      type: "boolean",
      description: "Enable verbose output",
      default: false,
      alias: "v",
    })
    .parseSync();

  await buildFrontend(argv);
}

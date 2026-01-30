import { existsSync, mkdirSync, renameSync, rmSync } from "fs";
import path from "path";

type BuildFrontendConfig = {
  verbose?: boolean;
};

const defaultConfig: Required<BuildFrontendConfig> = {
  verbose: false,
};

export const buildFrontend = async (
  apiUrl: string,
  cfgOverride: BuildFrontendConfig,
) => {
  const cfg = { ...defaultConfig, ...cfgOverride };
  const { verbose } = cfg;
  if (verbose) {
    console.log("Starting frontend build with configuration:", cfg);
  }

  const installProcess = Bun.spawnSync({
    cmd: ["bun", "install"],
    cwd: path.resolve(__dirname, "../../frontend"),
    stdout: verbose ? "inherit" : "pipe",
    stderr: verbose ? "inherit" : "pipe",
    env: {
      ...process.env,
      API_SPEC: path.resolve(__dirname, "../../../openapi-spec/openapi.yaml"),
      API_URL: apiUrl,
      NODE_ENV: "production",
    },
  });

  if (installProcess.exitCode !== 0) {
    console.error(
      "Dependency installation failed with error:",
      installProcess.stderr?.toString(),
    );
    throw new Error("Frontend build failed");
  }

  // Build the frontend
  const buildProcess = Bun.spawnSync({
    cmd: ["bun", "run", "build"],
    cwd: path.resolve(__dirname, "../../frontend"),
    stdout: verbose ? "inherit" : "pipe",
    stderr: verbose ? "inherit" : "pipe",
    env: {
      ...process.env,
      API_SPEC: path.resolve(__dirname, "../../../openapi-spec/openapi.yaml"),
      API_URL: apiUrl,
      NODE_ENV: "production",
    },
  });
  if (buildProcess.exitCode !== 0) {
    console.error("Build failed with error:", buildProcess.stderr?.toString());
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
  }

  console.log("Frontend build completed successfully.");
};

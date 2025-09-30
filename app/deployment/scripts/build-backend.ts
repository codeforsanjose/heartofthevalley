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

  // Generate the Go client from the OpenAPI spec
  const genProcess = Bun.spawnSync({
    cmd: ["go", "generate", "./..."],
    stdout: "pipe",
    stderr: "pipe",
    cwd: path.resolve(__dirname, "../../backend"),
    env: {
      ...process.env,
      API_SPEC: path.resolve(__dirname, "../../../openapi.yaml"),
    },
  });

  if (verbose) {
    console.log("Generate process output:", genProcess.stdout.toString());
  }
  if (genProcess.exitCode !== 0) {
    console.error(
      "Client generation failed with error:",
      genProcess.stderr.toString()
    );
    throw new Error("Backend build failed");
  }

  // Build the backend
  const buildProcess = Bun.spawnSync({
    cmd: [
      "go",
      "build",
      "-tags",
      "lambda.norpc",
      "-o",
      path.resolve(__dirname, `../dist/backend/bootstrap`),
      path.resolve(__dirname, `../../backend/main.go`),
    ],
    stdout: "pipe",
    stderr: "pipe",
    cwd: path.resolve(__dirname, "../../backend"),
  });

  if (verbose) {
    console.log("Build process output:", buildProcess.stdout.toString());
  }

  if (buildProcess.exitCode !== 0) {
    console.error("Build failed with error:", buildProcess.stderr.toString());
    throw new Error("Backend build failed");
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

  await buildBackend(argv);
}

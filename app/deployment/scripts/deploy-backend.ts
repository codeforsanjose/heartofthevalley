export const deployBackend = async (opts: { verbose: boolean }) => {
  const { verbose } = opts;

  if (verbose) {
    console.log("Deploying backend...");
  }

  const deployProcess = Bun.spawn(
    ["cdk", "deploy", "--app", "bun run bin/deployment.ts"],
    {
      stdout: "inherit",
      stderr: "inherit",
    }
  );

  const exitCode = await deployProcess.exited;
  if (exitCode !== 0) {
    throw new Error(`Deployment failed with exit code ${exitCode}`);
  }
  if (verbose) {
    console.log("Backend deployed successfully.");
  }
};

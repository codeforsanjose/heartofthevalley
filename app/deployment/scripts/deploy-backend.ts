type BackendDeploymentConfig = {
  requireApproval: boolean;
  verbose: boolean;
};

export const deployBackend = async ({
  requireApproval,
  verbose,
}: BackendDeploymentConfig): Promise<{
  s3BucketUri: `s3://${string}`;
  apiUrl: string;
}> => {
  if (verbose) {
    console.log("Deploying backend...");
  }

  const deployArgs = ["cdk", "deploy"];
  if (!requireApproval) {
    deployArgs.push("--require-approval=never");
  }
  if (verbose) {
    deployArgs.push("--verbose");
  }
  const deployProcess = Bun.spawnSync(deployArgs, {
    stdout: verbose ? "inherit" : "pipe",
    stderr: verbose ? "inherit" : "pipe",
  });
  const exitCode = deployProcess.exitCode;

  if (exitCode !== 0) {
    console.error(
      deployProcess.stderr?.toString() || deployProcess.stdout?.toString(),
    );
    throw new Error(`Deployment failed with exit code ${exitCode}`);
  }
  if (verbose) {
    console.log("Backend deployed successfully.");
  }

  const stackOutputsProcess = Bun.spawn(
    [
      "aws",
      "cloudformation",
      "describe-stacks",
      `--stack-name=HeartOfTheValleyStack${process.env.DEPLOYMENT_SUFFIX}`,
    ],
    { stdout: "pipe", stderr: "pipe" },
  );
  const outputsExitCode = await stackOutputsProcess.exited;
  if (outputsExitCode !== 0) {
    throw new Error(
      `Failed to get stack outputs with exit code ${outputsExitCode}`,
    );
  }
  const outputsJson = await stackOutputsProcess.stdout.text();
  const outputs = JSON.parse(outputsJson);

  console.log("✅ Backend deployment completed successfully");
  return {
    s3BucketUri: `s3://${
      outputs.Stacks[0].Outputs.find(
        (o: any) => o.OutputKey === "FrontendBucketName",
      ).OutputValue
    }`,
    apiUrl: outputs.Stacks[0].Outputs.find((o: any) => o.OutputKey === "ApiUrl")
      .OutputValue,
  };
};

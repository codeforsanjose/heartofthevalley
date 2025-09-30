export const deployBackend = async ({
  verbose,
}: {
  verbose: boolean;
}): Promise<`s3://${string}`> => {
  if (verbose) {
    console.log("Deploying backend...");
  }

  // Use AWS CDK to deploy the backend infrastructure

  const deployProcess = Bun.spawn(
    ["cdk", "deploy", "--require-approval=never"],
    {
      stdout: "inherit",
      stderr: "inherit",
    }
  );

  // Wait for the deployment process to complete
  const exitCode = await deployProcess.exited;

  // Check if the deployment was successful
  if (exitCode !== 0) {
    throw new Error(`Deployment failed with exit code ${exitCode}`);
  }
  if (verbose) {
    console.log("Backend deployed successfully.");
  }

  // Get stack oututs
  const stackOutputsProcess = Bun.spawn(
    [
      "aws",
      "cloudformation",
      "describe-stacks",
      `--stack-name=HeartOfTheValleyStack${process.env.DEPLOYMENT_SUFFIX}`,
    ],
    { stdout: "pipe", stderr: "pipe" }
  );
  const outputsExitCode = await stackOutputsProcess.exited;
  if (outputsExitCode !== 0) {
    throw new Error(
      `Failed to get stack outputs with exit code ${outputsExitCode}`
    );
  }
  const outputsJson = await stackOutputsProcess.stdout.text();
  const outputs = JSON.parse(outputsJson);

  return `s3://${
    outputs.Stacks[0].Outputs.find(
      (o: any) => o.OutputKey === "FrontendBucketName"
    ).OutputValue
  }`;
};

import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

// Deploys the contents of app/deployment/dist/frontend to AWS S3 and CloudFront
export const deployStaticSite = async (
  s3BucketUrl: `s3://${string}`,
  { verbose }: { verbose?: boolean } = {}
) => {
  const frontEndDir = path.resolve(__dirname, "../dist/frontend/client");
  console.log(`Deploying static site from ${frontEndDir}...`);

  const deployProcess = Bun.spawn(
    ["aws", "s3", "sync", frontEndDir, s3BucketUrl, "--delete"],
    {
      stdout: verbose ? "inherit" : "pipe",
      stderr: "inherit",
    }
  );
  const deployExitCode = await deployProcess.exited;

  if (deployExitCode !== 0) {
    throw new Error("Static site deployment failed");
  }

  console.log("Static site deployed successfully.");
};

if (require.main === module) {
  const argv = yargs(hideBin(process.argv))
    .option("s3BucketUrl", {
      type: "string",
      description: "The S3 bucket URL to deploy the static site to",
      demandOption: true,
    })
    .option("verbose", {
      type: "boolean",
      description: "Enable verbose output",
      default: false,
    })
    .parseSync();

  await deployStaticSite(argv.s3BucketUrl as `s3://${string}`, {
    verbose: argv.verbose,
  });
}

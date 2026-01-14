import yargs from "yargs";
import { buildBackend } from "./build-backend";
import { buildFrontend } from "./build-frontend";
import { hideBin } from "yargs/helpers";
import { deployBackend } from "./deploy-backend";
import { deployStaticSite } from "./deploy-static-site";

type DeploymentOptions = {
  requireApproval: boolean;
  verbose: boolean;
};

export const deploy = async (opts: DeploymentOptions) => {
  const { requireApproval, verbose } = opts;

  await buildBackend({ verbose });
  const { apiUrl, s3BucketUri } = await deployBackend({
    requireApproval,
    verbose,
  });
  await buildFrontend(apiUrl, { verbose });
  await deployStaticSite(s3BucketUri, { verbose });

  if (verbose) {
    console.log("Deployment completed successfully.");
  }
};

if (require.main === module) {
  const argv = yargs(hideBin(process.argv))
    .option("require-approval", {
      type: "boolean",
      description: "Require approval for security-related changes",
      default: true,
    })
    .option("verbose", {
      type: "boolean",
      description: "Enable verbose output",
      default: false,
    })
    .parseSync();

  await deploy(argv);
}

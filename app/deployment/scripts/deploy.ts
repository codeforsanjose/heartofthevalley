import yargs from "yargs";
import { buildBackend } from "./build-backend";
import { buildFrontend } from "./build-frontend";
import { hideBin } from "yargs/helpers";
import { deployBackend } from "./deploy-backend";
import { deployStaticSite } from "./deploy-static-site";

type DeploymentOptions = {
  verbose: boolean;
};

export const deploy = async (opts: DeploymentOptions) => {
  const { verbose } = opts;

  await buildBackend({ verbose });
  const frontendBucketUrl = await deployBackend({ verbose });
  await buildFrontend({ verbose });
  await deployStaticSite(frontendBucketUrl, { verbose });

  if (verbose) {
    console.log("Deployment completed successfully.");
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

  await deploy(argv);
}

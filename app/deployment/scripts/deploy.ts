import yargs from "yargs";
import { build } from "./build";
import { hideBin } from "yargs/helpers";
import { deployBackend } from "./deploy-backend";
import { deployStaticSite } from "./deploy-static-site";

type DeploymentOptions = {
  build: boolean;
  verbose: boolean;
};

export const deploy = async (opts: DeploymentOptions) => {
  const { build: shouldBuild, verbose } = opts;

  if (shouldBuild) {
    if (verbose) {
      console.log("Building...");
    }
    await build({ verbose });
  }
  if (verbose) {
    console.log("Starting deployment...");
  }

  const frontendBucketUrl = await deployBackend({ verbose });
  await deployStaticSite(frontendBucketUrl, { verbose });
  if (verbose) {
    console.log("Deployment completed successfully.");
  }
};

if (require.main === module) {
  const argv = yargs(hideBin(process.argv))
    .option("build", {
      type: "boolean",
      description: "Build the project before deployment",
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

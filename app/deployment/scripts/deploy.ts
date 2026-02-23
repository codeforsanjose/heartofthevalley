import yargs from "yargs";
import { buildBackend } from "./build-backend";
import { buildFrontend } from "./build-frontend";
import { hideBin } from "yargs/helpers";
import { deployBackend } from "./deploy-backend";
import { deployStaticSite } from "./deploy-static-site";

type DeploymentOptions = {
  build: boolean;
  buildBackend: boolean;
  buildFrontend: boolean;
  verbose: boolean;
};

export const deploy = async (opts: DeploymentOptions) => {
  const {
    build: buildFlag,
    buildBackend: buildBackendFlag,
    buildFrontend: buildFrontendFlag,
    verbose,
  } = opts;

  if (buildBackendFlag && buildFlag) {
    await buildBackend({ verbose });
  }

  const { apiUrl, s3BucketUri } = await deployBackend({
    verbose,
  });
  if (buildFrontendFlag && buildFlag) {
    await buildFrontend(apiUrl, { verbose });
  }
  await deployStaticSite(s3BucketUri, { verbose });

  if (verbose) {
    console.log("Deployment completed successfully.");
  }
};

if (require.main === module) {
  const argv = yargs(hideBin(process.argv))
    .option("aws-profile", {
      type: "string",
      description: "AWS CLI profile to use for deployment",
    })
    .option("build", {
      type: "boolean",
      description:
        "Build both backend and frontend. If set to false, overrides individual build flags and skips the build step.",
      default: true,
    })
    .option("build-backend", {
      type: "boolean",
      description: "Build the backend",
      default: true,
    })
    .option("build-frontend", {
      type: "boolean",
      description: "Build the frontend",
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

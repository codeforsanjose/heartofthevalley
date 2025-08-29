import yargs from "yargs";
import { buildBackend } from "./build-backend";
import { buildFrontend } from "./build-frontend";
import { hideBin } from "yargs/helpers";

export const build = async ({ verbose }: { verbose: boolean }) => {
  await buildFrontend({ verbose });
  await buildBackend({ verbose });
};

if (require.main === module) {
  const argv = yargs(hideBin(process.argv))
    .option("verbose", {
      type: "boolean",
      description: "Enable verbose output",
      default: false,
    })
    .parseSync();

  await build({ verbose: argv.verbose });
}

use anyhow::Result;
use clap::{Arg, Command};

use xtask::generate_openapi;

fn main() -> Result<()> {
    let matches = Command::new("openapi_generate")
        .about("Generate OpenAPI code from specification")
        .arg(
            Arg::new("verbose")
                .long("verbose")
                .short('v')
                .action(clap::ArgAction::SetTrue)
                .help("Enable verbose output"),
        )
        .get_matches();

    let verbose = matches.get_flag("verbose");

    generate_openapi::generate_openapi(verbose)?;

    Ok(())
}

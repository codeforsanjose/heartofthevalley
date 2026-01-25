use std::env;

use anyhow::{Context, Result};
use clap::{Arg, Command};

use xtask::generate_openapi;

fn main() -> Result<()> {
    let matches = Command::new("build_project")
        .about("Build the project, including generating OpenAPI code")
        .arg(
            Arg::new("verbose")
                .long("verbose")
                .short('v')
                .action(clap::ArgAction::SetTrue)
                .help("Enable verbose output"),
        )
        .get_matches();

    let verbose = matches.get_flag("verbose");

    build_project(verbose)?;
    Ok(())
}

fn build_project(verbose: bool) -> Result<()> {
    which::which("docker").context("Docker is not installed")?;

    // This binary should be run from project_root/app/backend/xtask
    let backend_dir = generate_openapi::normalize_path(env::current_dir().context("Failed to get current directory")?
        .parent() // backend
        .context("Expected to run from `project_root/app/backend/xtask`, but could not find `backend` directory above `xtask`")?
        .to_path_buf());

    if verbose {
        println!("Backend directory: {}", backend_dir.display());
        println!("Generating OpenAPI code...");
    }
    generate_openapi::generate_openapi(verbose)?;

    if verbose {
        println!("Building Rust project...");
    }
    let mut docker_cmd = std::process::Command::new("docker");
    docker_cmd.args(&[
        "run",
        "--rm",
        "-v",
        &format!("{}:/app", &backend_dir.display()),
        "-w",
        "/app",
        "amazonlinux:2023",
        "bash",
        "-c",
        "dnf install -y gcc gcc-c++ openssl-devel rust cargo && cargo build --release",
    ]);

    if !verbose {
        docker_cmd.stdout(std::process::Stdio::null());
        docker_cmd.stderr(std::process::Stdio::null());
    }
    let status = docker_cmd
        .status()
        .context("Failed to execute Docker command for building the project")?;
    if !status.success() {
        return Err(anyhow::anyhow!("Failed to build Rust project using Docker"));
    }
    Ok(())
}

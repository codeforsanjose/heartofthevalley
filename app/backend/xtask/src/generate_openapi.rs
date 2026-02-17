use std::{
    env, fs,
    path::{Component, PathBuf},
    process::{Command, Stdio},
};

use anyhow::{Context, Result};
use fs_extra::dir::{CopyOptions, copy};

pub fn generate_openapi(verbose: bool) -> Result<()> {
    if which::which("docker").is_err() {
        eprintln!("❌ Docker is required but not installed.");
        std::process::exit(1);
    }

    // This binary should be run from project_root/app/backend/xtask
    let project_root = normalize_path(env::current_dir().context("Failed to get current directory")?
        .parent() // backend
        .context("Expected to run from `project_root/app/backend/xtask`, but could not find `backend` directory above current directory")?
        .parent() // app
        .context("Expected to run from `project_root/app/backend/xtask`, but could not find `app` directory above `backend`")?
        .parent() // project_root
        .context("Expected to run from `project_root/app/backend/xtask`, but could not ascend to project root")?.to_path_buf());
    let source_dir = project_root.join("openapi-spec");
    let outdir = project_root.join("app/backend/openapi");

    if verbose {
        println!("Deleting existing OpenAPI directory: {}", outdir.display());
    }
    if outdir.exists() {
        fs::remove_dir_all(&outdir)
            .with_context(|| format!("Failed to remove existing directory {}", outdir.display()))?;
    }

    if verbose {
        println!("Creating OpenAPI directory: {}", outdir.display());
    }
    fs::create_dir_all(&outdir)
        .with_context(|| format!("Failed to create directory {}", outdir.display()))?;

    if verbose {
        println!("Using OpenAPI spec from {}", source_dir.display());
    }
    copy(&source_dir, &outdir, &CopyOptions::new()).with_context(|| {
        format!(
            "Failed to copy from {} to {}",
            source_dir.to_str().unwrap(),
            outdir.to_str().unwrap()
        )
    })?;

    let uid = unsafe { libc::getuid() };
    let gid = unsafe { libc::getgid() };
    let user_spec = format!("{}:{}", uid, gid);

    if verbose {
        println!("Running OpenAPI generator...");
    }

    let mut docker_cmd = Command::new("docker");
    docker_cmd.args([
        "run",
        "--rm",
        "-u",
        &user_spec,
        "-v",
        &format!("{}:/local", outdir.display()),
        "openapitools/openapi-generator-cli:v7.18.0",
        "generate",
        "-i",
        "/local/openapi-spec/openapi.yaml",
        "-g",
        "rust-axum",
        "-o",
        "/local",
    ]);

    if !verbose {
        docker_cmd.stdout(Stdio::null()).stderr(Stdio::null());
    }

    let status = docker_cmd
        .status()
        .context("Failed to execute docker command")?;

    if !status.success() {
        anyhow::bail!(
            "Docker command failed with exit code: {:?}",
            status.code().unwrap()
        );
    }

    println!("✅ OpenAPI generation completed successfully");
    Ok(())
}

pub fn normalize_path(path: PathBuf) -> PathBuf {
    let mut components = Vec::new();
    for component in path.components() {
        match component {
            Component::ParentDir => {
                components.pop();
            }
            Component::CurDir => {
                // Skip current directory components
            }
            other => {
                components.push(other);
            }
        }
    }
    components.into_iter().collect()
}

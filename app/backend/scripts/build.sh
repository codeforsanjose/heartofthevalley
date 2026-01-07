#!/bin/bash
set -euo pipefail

# Parse command line arguments
VERBOSE=false
while [[ $# -gt 0 ]]; do
  case $1 in
    --verbose|-v)
      VERBOSE=true
      shift
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 [--verbose|-v]"
      exit 1
      ;;
  esac
done

if ! command -v cargo >/dev/null 2>&1; then
  echo "❌ cargo is required but not installed."
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CARGO_TOML_PATH="$SCRIPT_DIR/../Cargo.toml"

if [ "$VERBOSE" = true ]; then
  echo "Generating OpenAPI code..."
  "$SCRIPT_DIR/openapi-generate.sh" --verbose
  echo "Building Rust project..."
  cargo build --release --manifest-path "$CARGO_TOML_PATH"
else
  "$SCRIPT_DIR/openapi-generate.sh"
  cargo build --release --manifest-path "$CARGO_TOML_PATH" > /dev/null 2>&1
fi

echo "✅ Build completed successfully"
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

# Set output redirection based on verbose flag
if [ "$VERBOSE" = true ]; then
  REDIRECT=""
else
  REDIRECT=">/dev/null 2>&1"
fi

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
OPENAPI_DIR="$PROJECT_ROOT/app/backend/src/openapi"

if ! command -v docker >/dev/null 2>&1; then
  echo "❌ Docker is required but not installed."
  exit 1
fi

if [ "$VERBOSE" = true ]; then
  echo "Creating OpenAPI directory: $OPENAPI_DIR"
fi
mkdir -p "$OPENAPI_DIR"

if [ "$VERBOSE" = true ]; then
  echo "Copying openapi.yaml to $OPENAPI_DIR"
fi
cp "$PROJECT_ROOT/openapi.yaml" "$OPENAPI_DIR/openapi.yaml"

if [ "$VERBOSE" = true ]; then
  echo "Running OpenAPI generator..."
  docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v "$OPENAPI_DIR:/local" \
    openapitools/openapi-generator-cli:v7.18.0 generate \
    -i /local/openapi.yaml \
    -g rust-axum \
    -o /local
else
  docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v "$OPENAPI_DIR:/local" \
    openapitools/openapi-generator-cli:v7.18.0 generate \
    -i /local/openapi.yaml \
    -g rust-axum \
    -o /local >/dev/null 2>&1
fi

echo "✅ OpenAPI generation completed successfully"
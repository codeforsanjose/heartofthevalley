set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
OPENAPI_DIR="$PROJECT_ROOT/app/backend/src/openapi"

if ! command -v docker >/dev/null 2>&1; then
  echo "❌ Docker is required but not installed."
  exit 1
fi

mkdir -p "$OPENAPI_DIR"

cp "$PROJECT_ROOT/openapi.yaml" "$OPENAPI_DIR/openapi.yaml"

docker run --rm \
  -u "$(id -u):$(id -g)" \
  -v "$OPENAPI_DIR:/local" \
  openapitools/openapi-generator-cli:v7.18.0 generate \
  -i /local/openapi.yaml \
  -g rust-axum \
  -o /local \
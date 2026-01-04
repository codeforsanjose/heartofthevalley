set -euo pipefail

if ! command -v cargo >/dev/null 2>&1; then
  echo "❌ cargo is required but not installed."
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

"$SCRIPT_DIR/openapi-generate.sh"

cargo build --release
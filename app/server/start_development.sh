#!/bin/sh

# Create Symlink
ln -s /usr/src/cache/node_modules /app/node_modules

exec "$@"

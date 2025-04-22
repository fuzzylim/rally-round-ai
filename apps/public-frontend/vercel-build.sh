#!/bin/bash

# Enhanced build script for Vercel deployments with Turborepo best practices
# This script is designed to be run from the project's root directory

set -e # Exit immediately if a command exits with a non-zero status

echo "============================================"
echo "Starting Vercel build with Turborepo"
echo "============================================"

# Get the current directory where this script is located
CURRENT_DIR=$(pwd)
ROOT_DIR="$CURRENT_DIR/../../"

# First, ensure all workspace dependencies are built
echo "Building workspace dependencies..."
cd "$ROOT_DIR"

# Install dependencies if needed (Vercel should handle this, but just in case)
if [ -z "$CI" ]; then
  echo "Installing dependencies..."
  pnpm install
fi

# Build all dependencies of public-frontend
echo "Building workspace dependencies with Turborepo..."
pnpm turbo run build --filter=public-frontend^...

# Return to the app directory for the main build
cd "$CURRENT_DIR"
echo "Building public-frontend app..."
pnpm next build

echo "============================================"
echo "Build completed successfully"
echo "============================================"

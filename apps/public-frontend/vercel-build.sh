#!/bin/bash

# This script prepares workspace packages for Vercel deployment

# Create packages directory if it doesn't exist
mkdir -p packages

# Copy all workspace packages
echo "Copying workspace packages..."
cp -r ../../packages/* ./packages/

# Create symbolic links to ensure proper resolution
echo "Setting up package resolution..."
cd packages
for d in */; do
  cd "$d"
  # Create package.json with absolute paths
  sed 's/workspace:\*/latest/g' package.json > package.json.tmp
  mv package.json.tmp package.json
  cd ..
done
cd ..

# Run the original build command
echo "Running build..."
cd ../..
turbo run build --filter=public-frontend

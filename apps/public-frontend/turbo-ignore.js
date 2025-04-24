#!/usr/bin/env node

/**
 * Custom turbo-ignore implementation for Vercel deployment
 * 
 * This script examines changes to determine whether the public-frontend app
 * needs to be rebuilt, considering workspace dependencies.
 */

const { execSync } = require('child_process');
const path = require('path');

const WORKSPACE_NAME = 'public-frontend';

// Exit with 0 to proceed with the build, 1 to skip
function exitWithStatus(shouldBuild) {
  process.exit(shouldBuild ? 0 : 1);
}

// Always build if we're on the main branch
try {
  const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  if (currentBranch === 'main' || currentBranch === 'master') {
    console.log('✅ Building because we are on the main branch');
    exitWithStatus(true);
  }
} catch (error) {
  console.log('⚠️ Could not determine current branch, proceeding with build');
  exitWithStatus(true);
}

// Get files changed since last deployment
try {
  // Find the latest commit that was successfully deployed
  // This will depend on your deployment tracking method
  // For this example, we'll compare with the default branch
  const changedFiles = execSync('git diff --name-only origin/main...HEAD').toString().trim().split('\n');
  
  // Always build if there are changes to the app or its dependencies
  if (changedFiles.some(file => {
    return (
      // Changes in the app itself
      file.startsWith(`apps/${WORKSPACE_NAME}/`) || 
      // Changes in the db or auth package
      file.startsWith('packages/db/') ||
      file.startsWith('packages/auth/') ||
      // Changes to global config files
      file === 'package.json' ||
      file === 'pnpm-lock.yaml' ||
      file === 'turbo.json' ||
      file === 'vercel.json'
    );
  })) {
    console.log('✅ Building because relevant files were changed');
    exitWithStatus(true);
  }
  
  console.log('⏭️ Skipping build because no relevant files were changed');
  exitWithStatus(false);
  
} catch (error) {
  console.error('⚠️ Error determining changed files:', error);
  // Default to building if we can't determine changes
  exitWithStatus(true);
}

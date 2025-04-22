// Simplified Vercel preparation script that follows best practices
const fs = require('fs');
const path = require('path');

/**
 * This script prepares the project for deployment on Vercel.
 * It ensures that workspace dependencies are properly referenced.
 * Following Turborepo/Vercel best practices, we rely on Vercel's built-in
 * Turborepo support to handle workspace dependencies correctly.
 */

console.log('Running Vercel prepare script for RallyRound app...');

// Function to read package.json and ensure workspace references are explicit versions
function ensureExplicitVersions(filePath) {
  console.log(`Processing ${filePath}...`);
  
  try {
    const pkg = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let modified = false;
    
    // Process dependencies
    if (pkg.dependencies) {
      Object.keys(pkg.dependencies).forEach(dep => {
        if (pkg.dependencies[dep].startsWith('workspace:')) {
          // Replace workspace: with explicit version
          pkg.dependencies[dep] = pkg.dependencies[dep].replace('workspace:', '');
          if (pkg.dependencies[dep] === '*') {
            pkg.dependencies[dep] = '0.1.0';
          }
          modified = true;
          console.log(`  Modified dependency: ${dep} -> ${pkg.dependencies[dep]}`);
        }
      });
    }
    
    // Only write if changes were made
    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(pkg, null, 2), 'utf8');
      console.log(`  Updated package.json with explicit versions`);
    } else {
      console.log(`  No changes needed - all versions are already explicit`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// Process the package.json for the app
const appPackageJsonPath = path.resolve(process.cwd(), 'package.json');
ensureExplicitVersions(appPackageJsonPath);

console.log('Vercel preparation completed successfully');


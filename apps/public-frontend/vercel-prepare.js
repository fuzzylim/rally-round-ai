// This script resolves workspace dependencies for Vercel deployment
const fs = require('fs');
const path = require('path');

// Function to read package.json and modify workspace references
function processPackageJson(filePath) {
  console.log(`Processing ${filePath}...`);
  
  try {
    const pkg = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let modified = false;
    
    // Process dependencies
    if (pkg.dependencies) {
      Object.keys(pkg.dependencies).forEach(dep => {
        if (pkg.dependencies[dep].startsWith('workspace:')) {
          // Replace workspace: with actual version
          pkg.dependencies[dep] = pkg.dependencies[dep].replace('workspace:', '');
          if (pkg.dependencies[dep] === '*') {
            pkg.dependencies[dep] = '0.1.0'; // Use the actual version from your workspace package
          }
          modified = true;
          console.log(`  Modified dependency: ${dep} -> ${pkg.dependencies[dep]}`);
        }
      });
    }
    
    // Only write if changes were made
    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(pkg, null, 2), 'utf8');
      console.log(`  Saved changes to ${filePath}`);
    } else {
      console.log(`  No changes needed for ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// Process the public-frontend package.json
const appPackageJsonPath = path.resolve(__dirname, 'package.json');
processPackageJson(appPackageJsonPath);

console.log('Workspace preparation completed successfully');

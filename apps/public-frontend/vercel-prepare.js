// This script resolves workspace dependencies for Vercel deployment
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define the workspace packages we need to prepare
const workspacePackages = ['ui', 'auth', 'rbac'];

// Map of package name to their relative path from public-frontend
const packagePaths = {
  ui: '../../packages/ui',
  auth: '../../packages/auth',
  rbac: '../../packages/rbac',
};

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

// Create node_modules/@rallyround directory if it doesn't exist
const rallyRoundDir = path.join(process.cwd(), 'node_modules', '@rallyround');
if (!fs.existsSync(rallyRoundDir)) {
  fs.mkdirSync(rallyRoundDir, { recursive: true });
  console.log('Created @rallyround directory in node_modules');
}

// Process each workspace package
workspacePackages.forEach(pkg => {
  const packageDir = path.resolve(process.cwd(), packagePaths[pkg]);
  const destDir = path.join(rallyRoundDir, pkg);
  
  console.log(`Processing ${pkg} package at ${packageDir}...`);
  
  // Copy the package to node_modules/@rallyround/{pkg}
  try {
    // Remove existing directory if it exists
    if (fs.existsSync(destDir)) {
      fs.rmSync(destDir, { recursive: true, force: true });
      console.log(`Removed existing ${pkg} directory`);
    }
    
    // Create the package directory
    fs.mkdirSync(destDir, { recursive: true });
    
    // Copy package files
    console.log(`Copying ${pkg} files to ${destDir}...`);
    const files = fs.readdirSync(packageDir);
    
    files.forEach(file => {
      // Skip node_modules and other unnecessary directories
      if (file !== 'node_modules' && file !== '.turbo' && file !== '.next') {
        const srcPath = path.join(packageDir, file);
        const destPath = path.join(destDir, file);
        
        if (fs.lstatSync(srcPath).isDirectory()) {
          // Use execSync to copy directories recursively
          execSync(`cp -r "${srcPath}" "${destPath}"`, { stdio: 'inherit' });
        } else {
          // Copy files directly
          fs.copyFileSync(srcPath, destPath);
        }
      }
    });
    
    console.log(`Successfully copied ${pkg} package`);
  } catch (error) {
    console.error(`Error copying ${pkg} package:`, error);
  }
});

console.log('Workspace preparation completed successfully');

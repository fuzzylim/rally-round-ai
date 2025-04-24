// Enhanced Vercel preparation script for monorepo deployments
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * This script prepares the project for deployment on Vercel.
 * It solves the common issue with Vercel not resolving monorepo 
 * workspace dependencies correctly by:
 * 1. Ensuring dependencies have explicit versions, not workspace: references
 * 2. Copying the actual package files into node_modules
 */

console.log('📦 Running Vercel preparation script for RallyRound app...');

// Function to read package.json and ensure workspace references are explicit versions
function ensureExplicitVersions(filePath) {
  console.log(`🔎 Processing ${filePath}...`);
  
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

// Function to copy workspace packages directly into node_modules
function copyWorkspaceDependencies() {
  const appDir = process.cwd();
  const rootDir = path.resolve(appDir, '../..');
  
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(appDir, 'package.json'), 'utf8'));
    const dependencies = pkg.dependencies || {};
    
    // Find all @rallyround/* dependencies
    const workspaceDeps = Object.keys(dependencies).filter(dep => 
      dep.startsWith('@rallyround/'));
    
    if (workspaceDeps.length === 0) {
      console.log('No workspace dependencies found.');
      return;
    }
    
    console.log(`📋 Found ${workspaceDeps.length} workspace dependencies to process:`, workspaceDeps);
    
    // Ensure node_modules exists
    const nodeModulesDir = path.join(appDir, 'node_modules');
    const rallyModulesDir = path.join(nodeModulesDir, '@rallyround');
    
    if (!fs.existsSync(nodeModulesDir)) {
      fs.mkdirSync(nodeModulesDir);
    }
    
    if (!fs.existsSync(rallyModulesDir)) {
      fs.mkdirSync(rallyModulesDir);
    }
    
    // Process each workspace dependency
    workspaceDeps.forEach(dep => {
      // Extract package name without the scope
      const packageName = dep.replace('@rallyround/', '');
      const sourceDir = path.join(rootDir, 'packages', packageName);
      const targetDir = path.join(rallyModulesDir, packageName);
      
      if (!fs.existsSync(sourceDir)) {
        console.error(`Source directory not found for ${dep}: ${sourceDir}`);
        return;
      }
      
      // Copy the built package to node_modules
      console.log(`🔄 Copying ${dep} from ${sourceDir} to ${targetDir}`);
      
      // Create the target directory if it doesn't exist
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      // Copy package.json
      const packageJson = path.join(sourceDir, 'package.json');
      if (fs.existsSync(packageJson)) {
        fs.copyFileSync(packageJson, path.join(targetDir, 'package.json'));
      }
      
      // Copy dist directory
      const distDir = path.join(sourceDir, 'dist');
      if (fs.existsSync(distDir)) {
        // Create the target dist directory
        const targetDistDir = path.join(targetDir, 'dist');
        if (!fs.existsSync(targetDistDir)) {
          fs.mkdirSync(targetDistDir, { recursive: true });
        }
        
        // Copy all files from dist
        copyDirRecursive(distDir, targetDistDir);
        console.log(`  ✅ Copied dist directory for ${dep}`);
      } else {
        console.error(`  ❌ No dist directory found for ${dep}`);
      }
    });
  } catch (error) {
    console.error('Error copying workspace dependencies:', error);
  }
}

// Helper function to recursively copy a directory
function copyDirRecursive(source, target) {
  // Create the target directory if it doesn't exist
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  // Get all files in the source directory
  const entries = fs.readdirSync(source, { withFileTypes: true });

  // Process each entry
  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);

    if (entry.isDirectory()) {
      // Recursively copy the directory
      copyDirRecursive(sourcePath, targetPath);
    } else {
      // Copy the file
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

// Process the package.json for the app
const appPackageJsonPath = path.resolve(process.cwd(), 'package.json');
ensureExplicitVersions(appPackageJsonPath);

// Copy workspace dependencies to node_modules
copyWorkspaceDependencies();

// Check if a specific dependency exists
function verifyDependency(dep) {
  try {
    const depPath = require.resolve(dep);
    console.log(`✅ Successfully resolved ${dep} at ${depPath}`);
    return true;
  } catch (e) {
    console.error(`❌ Failed to resolve ${dep}: ${e.message}`);
    return false;
  }
}

// Verify important dependencies
verifyDependency('@rallyround/db');

console.log('✅ Vercel preparation completed successfully');


# Vercel Deployment Configuration for RallyRound Monorepo

This document outlines the configuration for deploying the RallyRound Next.js application from a Turborepo monorepo to Vercel.

## Key Configuration Files

### Root-level vercel.json

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "pnpm turbo run build --filter=public-frontend...",
  "installCommand": "pnpm install",
  "outputDirectory": "apps/public-frontend/.next",
  "framework": "nextjs",
  "ignoreCommand": "npx turbo-ignore --filter=public-frontend"
}
```

### Next.js Configuration

In `apps/public-frontend/next.config.js`:

```js
transpilePackages: [
  "@rallyround/ui",
  "@rallyround/auth",
  "@rallyround/rbac"
]
```

### Package Manager Configuration

In `.npmrc`:

```
shamefully-hoist=true
link-workspace-packages=true
```

## Vercel Project Settings

- **Root Directory**: Set to the repository root (blank or "/")
- **Framework Preset**: Next.js
- **Build Command**: Automatically uses the one from vercel.json
- **Output Directory**: Automatically uses the one from vercel.json

## Deployment Process

1. Vercel clones the repository and runs commands from the repository root
2. `pnpm install` installs all dependencies including workspace packages
3. `pnpm turbo run build --filter=public-frontend...` builds the app and all its dependencies
4. Vercel serves the output from `apps/public-frontend/.next`

## Build Optimization

The `ignoreCommand` ensures that Vercel only rebuilds when changes affect the `public-frontend` app or its dependencies.

## Troubleshooting

If you encounter deployment issues:

1. Verify that the "Root Directory" in Vercel project settings is set to the repository root
2. Check that all workspace packages have explicit versions in package.json files
3. Ensure the .npmrc file contains the necessary configuration
4. Confirm that next.config.js has the correct transpilePackages configuration

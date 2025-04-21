/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@rallyround/ui",
    "@rallyround/auth",
    "@rallyround/rbac"
  ],
  // Ensure proper output directory is used
  distDir: '.next',
  // Add output export configuration
  output: 'standalone',
};

module.exports = nextConfig;

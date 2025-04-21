/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@rallyround/ui",
    "@rallyround/auth",
    "@rallyround/rbac"
  ],
};

module.exports = nextConfig;

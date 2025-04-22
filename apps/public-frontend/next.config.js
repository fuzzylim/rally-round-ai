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
  // Add async redirects for auth
  async redirects() {
    return [
      {
        source: '/auth/callback',
        has: [
          {
            type: 'query',
            key: 'error',
          },
        ],
        permanent: false,
        destination: '/login?error=auth',
      },
    ];
  },
};

module.exports = nextConfig;

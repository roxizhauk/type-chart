/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  // productionBrowserSourceMaps: true,
  trailingSlash: true,
  basePath: process.env.GITHUB_ACTIONS && "/type-chart",
};

module.exports = nextConfig;

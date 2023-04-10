/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  // productionBrowserSourceMaps: true,
  output: "export",
  trailingSlash: true,
  basePath: process.env.GITHUB_ACTIONS && "/type-chart",
};

module.exports = nextConfig;

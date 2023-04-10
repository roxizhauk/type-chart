/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/type-chart",
  experimental: {
    appDir: true,
  },
  trailingSlash: true,
};

module.exports = nextConfig;

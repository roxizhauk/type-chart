/** @type {import('next').NextConfig} */
module.exports = {
  output: "export",
  basePath: process.env.GITHUB_ACTIONS && "/type-chart",
  trailingSlash: true,
};

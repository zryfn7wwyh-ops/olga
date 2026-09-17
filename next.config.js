/** @type {import('next').NextConfig} */
// GITHUB_PAGES=true (set by the deploy workflow) builds a static export served
// from https://<owner>.github.io/olga/ — a GitHub Pages project site lives under
// a /olga path, so the base path and asset prefix are only added for that build.
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig = {
  reactStrictMode: true,
  ...(isGithubPages && {
    output: "export",
    basePath: "/olga",
    assetPrefix: "/olga/",
  }),
};

module.exports = nextConfig;

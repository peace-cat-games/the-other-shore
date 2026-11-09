import type { NextConfig } from "next";

/** Security headers for every page. The game loads no third-party scripts. */
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'" },
  { key: "X-Frame-Options", value: "DENY" },
];

/**
 * The game is served at peacecatgames.com/the-other-shore: the site rewrites
 * that path to this deployment, so every page and asset lives under the same
 * base path here too.
 */
const BASE_PATH = "/the-other-shore";

const nextConfig: NextConfig = {
  basePath: BASE_PATH,
  poweredByHeader: false,
  async redirects() {
    // The deployment's own root sends visitors to the game.
    return [{ source: "/", destination: BASE_PATH, basePath: false, permanent: false }];
  },
  devIndicators: false,
  async headers() {
    return [{ source: "/(.*)", headers: SECURITY_HEADERS }];
  },
  // This directory is the project, whatever lockfiles sit in the directories above it.
  turbopack: { root: process.cwd() },
};

export default nextConfig;

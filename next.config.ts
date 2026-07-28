import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  outputFileTracingIncludes: {
    "/**": ["prisma/dev.db"],
  },
};

export default nextConfig;

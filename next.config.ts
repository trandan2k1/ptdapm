import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "standalone",
  transpilePackages: [
    'rc-util',
    "rc-picker",
    "rc-pagination",
    'rc-tree',
    'rc-table',
    "@ant-design/icons-svg"
  ]
};

export default nextConfig;
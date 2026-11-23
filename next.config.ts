import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 启用 standalone 产物，供容器化最小运行时直接启动。
  output: "standalone",
};

export default nextConfig;

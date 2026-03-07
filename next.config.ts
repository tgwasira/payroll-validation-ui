import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  devIndicators: false,
  reactStrictMode: false,
};

//export default nextConfig;

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);

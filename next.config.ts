import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    'puppeteer-extra', 
    'puppeteer-extra-plugin-stealth', 
    'puppeteer'
  ],
  
  reactCompiler: true,
};

export default nextConfig;

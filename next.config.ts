import type { NextConfig } from "next";
import os from "os";

// Dynamically get all local IPv4 addresses to automatically allow them in development
const getLocalIPs = (): string[] => {
  const interfaces = os.networkInterfaces();
  const ips: string[] = [];
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name] || []) {
      if (net.family === "IPv4" && !net.internal) {
        ips.push(net.address);
        // Also allow with common dev ports
        ips.push(`${net.address}:3000`);
        ips.push(`${net.address}:4000`);
        ips.push(`${net.address}:8000`);
      }
    }
  }
  return ips;
};

const nextConfig: NextConfig = {
  reactCompiler: true,
  agentRules: false,
  allowedDevOrigins: [
    ...getLocalIPs(),
    "localhost",
    "127.0.0.1",
    "*.trycloudflare.com",
  ]
};

export default nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración para exportación estática (Electron)
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'out',
  images: {
    unoptimized: true
  },
  // Deshabilitar ESLint durante la construcción
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Deshabilitar TypeScript check durante la construcción
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;

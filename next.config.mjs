/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    outputFileTracingExcludes: {
      "*": ["./Design Assets/**/*", "./Images/**/*"],
    },
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ignored: [
          "**/node_modules/**",
          "**/.git/**",
          "**/.next/**",
          "**/Design Assets/**",
          "**/Images/**",
          "**/public/**",
        ],
        aggregateTimeout: 300,
      };
    }
    return config;
  },
  async headers() {
    const cspHeader = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https:",
      "frame-src 'self' https://challenges.cloudflare.com",
      "connect-src 'self' https://challenges.cloudflare.com data:",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader,
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Robots-Tag",
            value: "noai, noimageai",
          },
        ],
      },
      {
        source: "/admin/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive, noai",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

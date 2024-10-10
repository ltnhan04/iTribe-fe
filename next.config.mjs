/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "shopdunk.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

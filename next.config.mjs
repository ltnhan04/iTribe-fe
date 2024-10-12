/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.allen.ac.in",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

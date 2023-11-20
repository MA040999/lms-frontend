/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.educative.io",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      }
    ],
  }
}

module.exports = nextConfig

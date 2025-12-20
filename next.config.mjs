/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [process.env.NEXT_PUBLIC_ALLOWED_ORIGIN],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig

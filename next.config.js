/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only optimize images from these known hosts.
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.scdn.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.fbcdn.net' }
    ],
  },
};

module.exports = nextConfig;

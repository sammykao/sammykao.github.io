/** @type {import('next').NextConfig} */
const nextConfig = {
  // Export the app as fully static HTML
  images: {
    domains: ['i.scdn.co'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.fbcdn.net' }
    ],
  },
};

module.exports = nextConfig; 
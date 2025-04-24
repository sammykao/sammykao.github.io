export const baseUrl = 'https://sammykao.vercel.app'

export default async function sitemap() {
  // Now that we're only using Medium, we don't generate blog post pages in our sitemap
  
  let routes = ['', '/blog'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes]
}

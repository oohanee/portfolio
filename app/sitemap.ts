import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://portfolio.vercel.app'

  return [
    {
      url: `${baseUrl}/building-for-web`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/building-for-mobile`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/working-with-data`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/designing-experiences`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/infrastructure-stuff`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/others`,
      lastModified: new Date(),
    }
  ]
}
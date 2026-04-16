/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://folio-showcase.vercel.app'

  const { data: projects, error } = await supabase
    .from('projects')
    .select(`
      slug,
      categories (slug)
    `)

  if (error) console.error(error)

  const projectUrls =
    projects?.map((project: any) => ({
      url: `${baseUrl}/${project.categories?.slug}/${project.slug}`,
      lastModified: new Date(),
    })) ?? []

  const uniqueCategories = Array.from(
    new Set(
      projects
        ?.map((p: any) => p.categories?.slug)
        .filter(Boolean)
    )
  )

  const categoryUrls = uniqueCategories.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
  }))

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/explore`, lastModified: new Date() },

    ...categoryUrls,
    ...projectUrls,
  ]
}
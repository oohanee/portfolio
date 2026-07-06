import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import FilterSidebar from '@/components/filterpanel'
import { aggregateOptions, applyFilters, hasActiveFilters, parseFilters, type Project } from '@/lib/filters'

export const revalidate = 60

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const filters = parseFilters(sp)

  const [{ data: projects }, { data: categories }] = await Promise.all([
    supabase.from('projects').select('*, categories (*)').returns<Project[]>(),
    supabase.from('categories').select('id, name, slug').order('id'),
  ])

  const allProjects = projects ?? []
  const { techs, tags } = aggregateOptions(allProjects)
  const filteredProjects = applyFilters(allProjects, filters)
  const filtersActive = hasActiveFilters(filters)

  return (
    <div className="p-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Project Finder</h1>
        <p className="text-[#B3B3B3]">{filteredProjects.length} projects</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <FilterSidebar categories={categories ?? []} techs={techs} tags={tags} />

        {/* Results */}
        <div className="flex-1 min-w-0">
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div key={project.id} className="group">
                  <div className="bg-[#181818] rounded-lg overflow-hidden hover:bg-[#282828] transition-colors">
                    {/* Thumbnail */}
                    <div className="aspect-video bg-gradient-to-br from-indigo-500 via-violet-400 to-teal-100 relative overflow-hidden">
                      <Image src={project.thumbnail} alt={project.title} fill className="object-cover" />
                    </div>

                    {/* Project info */}
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1 w-full sm:w-auto">
                          {project.icon && (
                            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-indigo-500 via-violet-400 to-teal-100 flex-shrink-0 overflow-hidden relative">
                              <Image src={project.icon} alt={`${project.title} logo`} fill className="object-cover" />
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold mb-1 transition-all group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:via-violet-400 group-hover:to-teal-100 group-hover:bg-clip-text group-hover:text-transparent">
                              {project.title}
                            </h3>

                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs text-[#B3B3B3] bg-white/5 px-2 py-0.5 rounded-full">
                                {project.categories.name}
                              </span>

                              {project.tags && project.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 text-xs text-[#B3B3B3]">
                                  {project.tags.map((tg: string, i: number) => (
                                    <span key={i}>
                                      {tg}
                                      {i < project.tags!.length - 1 && ' · '}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <Link
                          href={`/${project.categories.slug}/${project.slug}`}
                          className="bg-gradient-to-br from-indigo-500 via-violet-400 to-teal-100 text-white px-6 py-2 rounded-full text-sm font-normal hover:scale-105 transition-transform whitespace-nowrap w-full sm:w-auto"
                        >
                          View more
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-[#B3B3B3]">
              <p className="text-lg">
                {filtersActive ? 'No projects match these filters' : 'No projects found'}
              </p>
              {filtersActive && (
                <Link
                  href="/discover"
                  className="mt-4 inline-block text-sm text-violet-400 hover:text-violet-300 transition-colors"
                >
                  ← Clear filters
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
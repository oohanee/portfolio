import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { redirect } from 'next/navigation'

export const revalidate = 60

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ tech?: string; tag?: string; year?: number }>
}) {
  const { tech, tag, year } = await searchParams

  // Fetch all projects with their category
  const { data: projects } = await supabase
    .from('projects')
    .select(`*, categories (*)`)
    .order('id', { ascending: false })

  // Filter
  const filteredProjects = projects?.filter((p) => {
    if (tech) {
      return p.tech_stack?.some(
        (t: { name: string }) => t.name.toLowerCase() === tech.toLowerCase()
      )
    }
    if (tag) {
      return p.tags?.some(
        (tg: string) => tg.toLowerCase() === tag.toLowerCase()
      )
    }
    if (year) {
      return p.year === Number(year)
    }
    if (!tech && !tag) {
      redirect('/')
    }
    return false
  })

  const activeFilter = tech ? `Tech: ${tech}` : tag ? `Tag: ${tag}` : year ? `Year: ${year}` : null

  return (
    <div className="p-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Discover</h1>

        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-[#B3B3B3]">
            {filteredProjects?.length || 0} projects
          </p>

          {activeFilter && (
            <div className="flex items-center gap-2 bg-[#181818] px-3 py-1 rounded-full text-sm">
              <span className="text-[#B3B3B3]">{activeFilter}</span>
              <Link
                href="/"
                className="text-[#B3B3B3] hover:text-white transition-colors ml-1"
                aria-label="Clear filter"
              >
                ✕
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Projects grid */}
      {filteredProjects && filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              href={`/${project.categories.slug}/${project.slug}`}
              className="group"
            >
              <div className="bg-[#181818] rounded-lg overflow-hidden hover:bg-[#282828] transition-colors">
                {/* Thumbnail */}
                <div className="aspect-video bg-gradient-to-br from-indigo-500 via-violet-400 to-teal-100 relative overflow-hidden">
                  <Image
                    src={project.thumbnail}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Project info */}
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

                    <div className="flex items-center gap-4 flex-1 w-full sm:w-auto">
                      {project.icon && (
                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-indigo-500 via-violet-400 to-teal-100 flex-shrink-0 overflow-hidden relative">
                          <Image
                            src={project.icon}
                            alt={`${project.title} logo`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold mb-1 transition-all group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:via-violet-400 group-hover:to-teal-100 group-hover:bg-clip-text group-hover:text-transparent">
                          {project.title}
                        </h3>

                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Category badge */}
                          <span className="text-xs text-[#B3B3B3] bg-white/5 px-2 py-0.5 rounded-full">
                            {project.categories.name}
                          </span>

                          {/* Tags */}
                          {project.tags && project.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 text-xs text-[#B3B3B3]">
                              {project.tags.map((tg: string, i: number) => (
                                <span key={i}>
                                  {tg}
                                  {i < project.tags.length - 1 && ' · '}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <button className="bg-gradient-to-br from-indigo-500 via-violet-400 to-teal-100 text-white px-6 py-2 rounded-full text-sm font-normal hover:scale-105 transition-transform whitespace-nowrap w-full sm:w-auto">
                      View more
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-[#B3B3B3]">
          <p className="text-lg">
            {activeFilter
              ? `No projects found for "${activeFilter.split(': ')[1]}"`
              : 'No projects found'}
          </p>
          {activeFilter && (
            <Link
              href="/"
              className="mt-4 inline-block text-sm text-violet-400 hover:text-violet-300 transition-colors"
            >
              ← Home
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
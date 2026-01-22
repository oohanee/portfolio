import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
    const { data: categories } = await supabase
        .from('categories')
        .select('slug')

    return categories?.map((cat) => ({
        category: cat.slug,
    })) || []
}

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ category: string }>
}) {
    const { category } = await params

    // fetch category data
    const { data: categoryData } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', category)
        .single()

    if (!categoryData) {
        notFound()
    }

    // fetch projects in this category
    const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('category_id', categoryData.id)
        .order('id', { ascending: false })

    return (
        <div className="p-12">
            {/* category header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">{categoryData.name}</h1>
                <p className="text-[#B3B3B3]">
                    {projects?.length || 0} projects
                </p>
            </div>

            {/* projects grid */}
            {projects && projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((project) => (
                        <Link
                            key={project.id}
                            href={`/${category}/${project.slug}`}
                            className="group">
                            <div className="bg-[#181818] rounded-lg overflow-hidden hover:bg-[#282828] transition-colors">
                                {/* thumbnail */}
                                <div className="aspect-video bg-gradient-to-br from-green-400/20 to-green-600/20 relative overflow-hidden">
                                        <Image
                                            src={project.thumbnail}
                                            alt={project.title}
                                            fill
                                            className="object-cover"
                                        />
                                </div>

                                {/* project info */}
                                <div className="p-6">
                                    <div className="flex items-center justify-between gap-4">

                                        {/* icon + info */}
                                        <div className="flex items-center gap-4 flex-1">

                                            {/* icon */}
                                            {project.icon && (
                                                <div className="w-16 h-16 rounded-lg bg-green-500 flex-shrink-0 overflow-hidden relative">
                                                    <Image
                                                        src={project.icon}
                                                        alt={`${project.title} logo`}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            )}

                                            {/* title & tags */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-xl font-bold mb-1 group-hover:text-green-400 transition-colors">
                                                    {project.title}
                                                </h3>

                                                {project.tags && project.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 text-xs text-[#B3B3B3]">
                                                        {project.tags.map((tag: string, i: number) => (
                                                            <span key={i}>
                                                                {tag}
                                                                {i < project.tags.length - 1 && ' · '}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* button */}
                                        <button className="bg-green-500 text-white px-6 py-2 rounded-full text-sm font-normal hover:scale-105 transition-transform whitespace-nowrap">
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
                    <p className="text-lg">No projects yet in this category</p>
                </div>
            )}
        </div>
    )
}
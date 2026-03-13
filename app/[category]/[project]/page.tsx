/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Slider from '@/components/slider'

export const revalidate = 60

export async function generateStaticParams() {
    const { data: projects } = await supabase
        .from('projects')
        .select(`
      slug,
      categories (slug)
    `)

    return projects?.map((project: any) => ({
        category: project.categories.slug,
        project: project.slug,
    })) || []
}

export default async function ProjectDetailPage({
    params,
}: {
    params: Promise<{ category: string; project: string }>
}) {
    const { category, project: projectSlug } = await params

    // Fetch project data dengan category
    const { data: project } = await supabase
        .from('projects')
        .select(`
      *,
      categories (*)
    `)
        .eq('slug', projectSlug)
        .single()

    if (!project || project.categories.slug !== category) {
        notFound()
    }

    const hasAction = typeof project.action === 'string' && project.action.trim().length > 0

    return (
        <div className="max-w-5xl mx-auto p-12">

            {/* Project Header */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-4 md:gap-0">

                    {/* Logo */}
                    {project.icon && (
                    <div className="flex items-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 via-violet-400 to-teal-100 rounded-2xl flex items-center justify-center">
                            <Image
                                src={project.icon}
                                alt={project.title}
                                width={96}
                                height={96}
                                className="rounded-2xl"
                            />
                        </div>
                    </div>
                    )}

                    {/* Name, Category, Year */}
                    <div className="flex-1 md:px-6 text-center md:text-left">
                        <h1 className="text-3xl font-bold mb-2">
                            {project.title}
                        </h1>

                        {project.tags && project.tags.length > 0 && (
                            <p className="text-[#B3B3B3] mb-1">
                                {project.tags.join(' · ')}
                            </p>
                        )}

                        <p className="text-[#B3B3B3]">
                            {project.year}
                        </p>
                    </div>

                    {/* Button */}
                    <div className="relative flex items-center justify-center md:justify-end group">
                        {hasAction ? (
                            <a
                                href={project.action}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gradient-to-br from-indigo-500 via-violet-400 to-teal-100 text-white px-8 py-3 rounded-full hover:scale-105 transition-transform inline-block"
                            >
                                Open Project
                            </a>
                        ) : (
                            <a
                                href={`mailto:hanamaliyyaa@gmail.com?subject=Request Demo – ${project.title}&body=Hi,%0A%0AI’d like to request a demo for the project "${project.title}".`}
                                className="bg-black text-white px-8 py-3 rounded-full hover:scale-105 transition-transform inline-block">
                                Request Demo
                            </a>
                        )}
                        {!hasAction && (
                            <div
                                className="absolute top-full right-0 mb-3 w-72 bg-[#181818] text-[#B3B3B3] text-xs p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                This demo runs on a private environment. Clicking this will open your default email app to request a demo.
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Screenshots Section */}
            {project.screenshots && project.screenshots.length > 0 && (
                <Slider
                    screenshots={project.screenshots}
                    title={project.title}
                />
            )}

            {/* About Section */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold mb-4">About this project</h2>
                <div className="bg-[#181818] rounded-lg p-6">
                    <p className="text-[#B3B3B3] leading-relaxed whitespace-pre-line">
                        {project.description || 'No description available.'}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* What I Did Section */}
                {project.what_i_did && project.what_i_did.length > 0 && (
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold mb-4">What did I do</h2>
                        <div className="bg-[#181818] rounded-lg p-6">
                            <ul className="space-y-3 text-[#B3B3B3]">
                                {project.what_i_did.map((task: string, i: number) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <span className="bg-gradient-to-br from-indigo-500 via-violet-400 to-teal-100 bg-clip-text text-transparent">•</span>
                                        <span>{task}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Tech Stack Section */}
                {project.tech_stack && project.tech_stack.length > 0 && (
                    <div className="lg:col-span-1">
                        <h2 className="text-2xl font-bold mb-4">Tech stack and libraries</h2>
                        <div className="bg-[#181818] rounded-lg p-6">
                            <ul className="flex gap-2 flex-wrap items-center">
                                {project.tech_stack.map((tech: string, i: number) => (
                                    <li key={i} className="h-[48px] px-3 bg-[#181818] rounded-lg flex items-center justify-center">
                                        <Image
                                            src={tech}
                                            alt={`${project.title} tech stack ${i + 1}`}
                                            width={100}
                                            height={100}
                                            className="w-full h-full object-contain"
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
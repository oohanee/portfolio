import Link from 'next/link'
import Image from 'next/image'
//import ProfileTab from '@/components/profiletab'
import { supabase } from '@/lib/supabase'

export const revalidate = 60

export default async function AboutPage() {
  // Fetch all projects to aggregate tech stack and tags
  const { data: projects } = await supabase
    .from('projects')
    .select('tech_stack, tags')

  // Aggregate unique tech stacks
  const techMap = new Map<string, { name: string; icon: string }>()
  projects?.forEach((p) => {
    p.tech_stack?.forEach((t: { name: string; icon: string }) => {
      if (!techMap.has(t.name)) techMap.set(t.name, t)
    })
  })
  const allTechs = Array.from(techMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
  )

  // Aggregate unique tags
  const tagSet = new Set<string>()
  projects?.forEach((p) => {
    p.tags?.forEach((tag: string) => tagSet.add(tag))
  })
  const allTags = Array.from(tagSet).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: 'base' })
  )

  return (
    <div className="p-12">

      {/* Bio */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-1">About me</h1>
        <div className="h-[3px] w-20 bg-gradient-to-r from-indigo-500 via-violet-500 to-teal-500 rounded-full mb-4"></div>
        <p className="text-[#B3B3B3] text-justify leading-relaxed">
          Hi! I&apos;m Hana, a recent graduate in Software Engineering Technology with a strong interest in building reliable and impactful applications.
          I have hands-on experience working across the end-to-end SDLC from understanding user requirements, designing system solutions, to implementation, and even end-user training.
          I enjoy solving problems, collaborating with teams, and continuously learning new technologies to improve my skills.
        </p>
      </div>
      {/* 
      {/* Currently}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Currently</h2>
        <div className="bg-[#181818] rounded-lg p-6 space-y-3">
          {[
            { label: 'Status', value: 'Final year student, open to opportunities' },
            { label: 'Focus', value: 'Web development & UI/UX Design' },
            { label: 'Based in', value: 'Bogor, Indonesia' },
             I am known for being detail-oriented, structured in my work, and having strong analytical thinking. 
          ].map((item) => (
            <div key={item.label} className="flex gap-4">
              <span className="text-[#B3B3B3] w-24 shrink-0">{item.label}</span>
              <span>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
       **/}

      {/* Education 
      <ProfileTab /> */}

      {/* Tech Stack */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-1">Tech I&apos;ve<span className='bg-gradient-to-r from-indigo-400 via-violet-400 to-teal-400 bg-clip-text text-transparent'> worked with</span></h2>
        <p className="text-[#B3B3B3] text-sm mb-4">
          Click any to discover related projects
        </p>
        <div className="bg-[#181818] rounded-lg p-6">
          <ul className="flex flex-wrap gap-2">
            {allTechs.map((tech) => (
              <li key={tech.name}>
                <div className="group p-[2px] rounded-lg transition-all hover:bg-gradient-to-br hover:from-indigo-500 hover:via-violet-400 hover:to-teal-100">
                  <Link
                    href={`/discover?tech=${encodeURIComponent(tech.name)}`}
                    className="h-[48px] bg-[#181818] rounded-lg flex items-center justify-center tooltip-wrapper"
                    title={tech.name}
                  >
                    <Image
                      src={tech.icon}
                      alt={tech.name}
                      width={100}
                      height={100}
                      className="w-full h-full object-contain"
                    />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Topics */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-1">Topics I&apos;ve<span className='bg-gradient-to-r from-indigo-400 via-violet-400 to-teal-400 bg-clip-text text-transparent'> discovered</span></h2>
        <p className="text-[#B3B3B3] text-sm mb-4">
          Click any to discover related projects
        </p>
        <div className="bg-[#181818] rounded-lg p-6">
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Link
                key={tag}
                href={`/discover?tag=${encodeURIComponent(tag)}`}
                className="px-3 py-1.5 bg-[#282828] rounded-full text-sm text-[#B3B3B3] hover:text-white hover:ring-2 hover:bg-gradient-to-br hover:from-indigo-500 hover:via-violet-400 hover:to-teal-100 transition-all"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
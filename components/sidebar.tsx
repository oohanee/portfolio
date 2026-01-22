'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase, type Category } from '@/lib/supabase'

export default function Sidebar() {
  const pathname = usePathname()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('id', { ascending: true })

      if (data && !error) {
        setCategories(data)
      }
      setLoading(false)
    }

    fetchCategories()
  }, [])

  const isActive = (slug: string) => {
    return pathname === `/${slug}` || pathname.startsWith(`/${slug}/`)
  }

  return (
    <aside className="w-64 bg-black border-r border-white/10 flex flex-col">
      {/* Logo */}
      <div className="p-8 border-b border-white/10">
        <Link href="/" className="text-2xl font-bold">
          Portfolio
        </Link>
      </div>

      {/* Categories */}
      <nav className="flex-1 p-4">
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 bg-white/5 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <ul className="space-y-1">
            {categories.map((category) => {
              const active = isActive(category.slug)

              return (
                <li key={category.id}>
                  <Link
                    href={`/${category.slug}`}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${active
                      ? 'bg-white/10 text-white'
                      : 'text-[#B3B3B3] hover:text-white hover:bg-white/5'
                      }`}
                  >
                    {(category.icon || category.icon_active) && (
                      <span
                        className="w-6 h-6 inline-flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5 [&>svg]:block"
                        dangerouslySetInnerHTML={{
                          __html: active && category.icon_active
                            ? category.icon_active
                            : category.icon!
                        }}
                      />
                    )}
                    <span className="text-sm font-medium">
                      {category.name}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </nav>

    </aside>
  )
}
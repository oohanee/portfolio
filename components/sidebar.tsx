'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase, type Category } from '@/lib/supabase'

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
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
    <>
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-black flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Close menu">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
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
    </>
  )
}
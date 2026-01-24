'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {

  const socials = [
    { name: 'LinkedIn', url: 'https://linkedin.com/in/maliyyaa', icon: 'in' },
    { name: 'Figma', url: 'https://figma.com/@oohana', icon: 'fig' },
    { name: 'GitHub', url: 'https://github.com/oohanee', icon: 'gh' }
  ]

  const router = useRouter()

  return (
    <nav className="bg-black/50 backdrop-blur-sm border-b border-white/10 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-40">
      {/* Left side - Hamburger + Navigation arrows */}
      <div className="flex items-center gap-4">
        {/* Hamburger menu */}
        <button
          onClick={onMenuClick}
          className="lg:hidden w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
          aria-label="Open menu">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Navigation arrows */}
        <div className="hidden sm:flex items-center gap-2 md:gap-4">
          {/* back */}
          <button
            onClick={() => router.back()}
            className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors disabled:opacity-30"
            aria-label="Go back">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* forward */}
          <button
            onClick={() => window.history.forward()}
            className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors disabled:opacity-30"
            aria-label="Go forward">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Social links */}
      <div className="flex items-center md:gap-4 gap-6">
        {socials.map((social) => (
          <Link
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#B3B3B3] hover:text-white transition-colors text-sm font-medium"
          >
            {social.name}
          </Link>
        ))}
      </div>
    </nav>
  )
}
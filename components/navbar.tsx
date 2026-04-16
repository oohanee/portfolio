'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const socials = [
    { name: 'LinkedIn', url: 'https://linkedin.com/in/maliyyaa', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 128 128"><path fill="#0076b2" d="M116 3H12a8.91 8.91 0 0 0-9 8.8v104.42a8.91 8.91 0 0 0 9 8.78h104a8.93 8.93 0 0 0 9-8.81V11.77A8.93 8.93 0 0 0 116 3" /><path fill="#fff" d="M21.06 48.73h18.11V107H21.06zm9.06-29a10.5 10.5 0 1 1-10.5 10.49a10.5 10.5 0 0 1 10.5-10.49m20.41 29h17.36v8h.24c2.42-4.58 8.32-9.41 17.13-9.41C103.6 47.28 107 59.35 107 75v32H88.89V78.65c0-6.75-.12-15.44-9.41-15.44s-10.87 7.36-10.87 15V107H50.53z" /></svg>) },
    { name: 'Figma', url: 'https://figma.com/@oohana', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32"><path fill="#f4511e" d="M12 4h4v8h-4a4 4 0 0 1-4-4a4 4 0 0 1 4-4" /><path fill="#ff8a65" d="M20 12h-4V4h4a4 4 0 0 1 4 4a4 4 0 0 1-4 4" /><rect width="8" height="8" x="16" y="12" fill="#29b6f6" rx="4" transform="rotate(180 20 16)" /><path fill="#7c4dff" d="M12 12h4v8h-4a4 4 0 0 1-4-4a4 4 0 0 1 4-4" /><path fill="#00e676" d="M12 20h4v4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4" /></svg>) },
    { name: 'GitHub', url: 'https://github.com/oohanee', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 12 12"><path fill="currentColor" d="M6 0C2.687 0 0 2.754 0 6.152c0 2.718 1.719 5.024 4.103 5.837c.3.057.41-.133.41-.296c0-.146-.005-.533-.008-1.046c-1.669.371-2.021-.825-2.021-.825c-.273-.711-.666-.9-.666-.9c-.545-.382.04-.374.04-.374c.603.044.92.634.92.634c.535.94 1.404.668 1.746.511c.055-.397.21-.669.381-.822c-1.332-.155-2.733-.683-2.733-3.04c0-.672.234-1.221.618-1.651c-.062-.156-.268-.781.058-1.629c0 0 .504-.165 1.65.631A5.6 5.6 0 0 1 6 2.975a5.6 5.6 0 0 1 1.502.207c1.146-.796 1.649-.63 1.649-.63c.327.847.121 1.472.06 1.628c.384.43.616.979.616 1.65c0 2.364-1.403 2.884-2.74 3.036c.216.19.408.565.408 1.14c0 .821-.007 1.485-.007 1.687c0 .164.108.356.412.296c2.382-.816 4.1-3.12 4.1-5.837C12 2.754 9.313 0 6 0" /></svg>) },
  ]

  const router = useRouter()

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <nav className="bg-black/50 backdrop-blur-sm border-b border-white/10 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-40">
      {/* Left side - Hamburger + Navigation arrows */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
          aria-label="Open menu">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="hidden sm:flex items-center gap-2 md:gap-4">
          <button onClick={() => router.back()} className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={() => window.history.forward()} className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Right side - Social dropdown */}
      <div className="flex items-center gap-5">
        {/* About — navigasi internal, pakai pill */}
        <Link
          href="/about"
          className="text-sm font-medium text-white px-3 py-1 rounded-full bg-white/8 border border-white/15 hover:bg-white/15 transition-colors"
        >
          About
        </Link>

        {/* Divider */}
        <div className="w-px h-4 bg-white/15" />
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Social links">
            <Image
              src="/favicon.ico"
              alt="menu"
              width={36}
              height={36}
              className="rounded-sm"
            />
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-44 bg-[#1a1a1a] border border-white/15 rounded-xl overflow-hidden z-50 shadow-xl">
              <p className="text-[10px] text-white/30 uppercase tracking-widest px-4 pt-3 pb-1">Socials</p>
              {socials.map((social) => (
                <Link
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-[#B3B3B3] hover:text-white hover:bg-white/7 transition-colors text-sm"
                >
                  <span className="text-xs w-5 text-center">{social.icon}</span>
                  {social.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
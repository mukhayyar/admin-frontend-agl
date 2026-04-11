'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const links = [
  { label: 'Dashboard', path: '/admin/dashboard' },
  { label: 'Apps', path: '/admin/apps' },
  { label: 'Users', path: '/admin/users' },
  { label: 'Analytics', path: '/admin/analytics' },
  { label: 'Reports', path: '/admin/reports' },
  { label: 'Settings', path: '/admin/settings' },
]

const demoLinks = [
  { label: 'Health', path: '/admin/system-health' },
  { label: 'History', path: '/admin/review-history' },
  { label: 'Ratings', path: '/admin/ratings' },
]

export default function AdminTopNavLayout({
  children,
  title = 'App Store Admin',
}: {
  children: React.ReactNode
  title?: string
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const isActive = (path: string) => pathname === path

  const allLinks = [...links, ...demoLinks]

  return (
    <div className="min-h-screen bg-brand-gray">
      <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="text-lg md:text-xl font-bold flex items-center gap-2">
          <span className="text-2xl">*</span>
          <span className="hidden sm:inline">{title}</span>
          <span className="sm:hidden">Admin</span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-4 text-sm font-medium text-gray-600">
          {links.map((link) => (
            <Link key={link.path} href={link.path} className={isActive(link.path) ? 'text-brand-dark' : 'hover:text-brand-dark'}>
              {link.label}
            </Link>
          ))}
          <div className="h-4 w-px bg-gray-300 mx-1" />
          {demoLinks.map((link) => (
            <Link key={link.path} href={link.path} className={`text-xs ${isActive(link.path) ? 'text-brand-dark font-bold' : 'text-gray-400 hover:text-brand-dark'}`}>
              ({link.label})
            </Link>
          ))}
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-xs overflow-hidden border border-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
          </div>
        </nav>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)} className="lg:hidden text-gray-600 hover:text-gray-900 p-1">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Mobile dropdown nav */}
      {open && (
        <div className="lg:hidden bg-white border-b border-gray-200 shadow-md">
          <nav className="flex flex-col px-4 py-3 gap-1">
            {allLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path) ? 'bg-gray-100 text-brand-dark' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      <main className="p-4 md:p-8 max-w-7xl mx-auto">{children}</main>
    </div>
  )
}

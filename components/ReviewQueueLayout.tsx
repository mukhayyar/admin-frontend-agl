import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Dashboard', path: '/review-queue' },
  { label: 'Apps', path: '#' },
  { label: 'Analytics', path: '#' },
  { label: 'Catalog', path: '#' },
  { label: 'Support', path: '#' },
]

export default function ReviewQueueLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-brand-gray">
      <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="flex gap-0.5">
            <div className="w-1.5 h-4 bg-black rounded-full" />
            <div className="w-1.5 h-4 bg-black rounded-full" />
            <div className="w-1.5 h-4 bg-black rounded-full" />
          </div>
          <div className="text-lg md:text-xl font-bold">App Store</div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-gray-600">
          {navLinks.map((link) => (
            <Link key={link.label} to={link.path} className="hover:text-brand-dark">{link.label}</Link>
          ))}
          <Bell size={20} className="text-gray-400" />
          <div className="w-8 h-8 bg-teal-800 rounded-full flex items-center justify-center text-white text-xs">
            <div className="w-4 h-4 border-2 border-white rounded-sm transform rotate-45" />
          </div>
        </nav>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-gray-600 p-1">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Mobile nav */}
      {open && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-md">
          <nav className="flex flex-col px-4 py-3 gap-1">
            {navLinks.map((link) => (
              <Link key={link.label} to={link.path} onClick={() => setOpen(false)} className="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
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

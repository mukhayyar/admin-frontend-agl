import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, Code2 } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../lib/stores'
import { clearToken } from '../lib/api'

const adminLinks = [
  { label: 'Dashboard', path: '/admin/dashboard' },
  { label: 'Submissions', path: '/admin/submissions' },
  { label: 'Users', path: '/admin/users' },
  { label: 'Analytics', path: '/admin/analytics' },
  { label: 'Health', path: '/admin/system-health' },
  { label: 'Ratings', path: '/admin/ratings' },
  { label: 'Settings', path: '/admin/settings' },
]

const devLinks = [
  { label: 'Developer Portal', path: '/developer/portal' },
  { label: 'Developer Guide', path: '/developer/guide' },
]

export default function AdminTopNavLayout({
  children,
  title = 'App Store Admin',
}: {
  children: React.ReactNode
  title?: string
}) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const isActive = (path: string) => pathname.startsWith(path)
  const isDev = pathname.startsWith('/developer')
  const links = isDev ? devLinks : adminLinks

  function handleLogout() {
    clearToken()
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-indigo-600">PensHub</span>
          <span className="text-gray-300">|</span>
          <span className="text-sm font-medium text-gray-600">{title}</span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                isActive(link.path)
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {!isDev && (
            <Link to="/developer/portal" className="ml-1 px-3 py-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center gap-1.5 text-xs">
              <Code2 size={13} /> Dev Portal
            </Link>
          )}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          {user?.display_name && (
            <span className="text-xs text-gray-400">{user.display_name}</span>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors border border-gray-200"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)} className="lg:hidden text-gray-600 hover:text-gray-900 p-1">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Mobile dropdown nav */}
      {open && (
        <div className="lg:hidden bg-white border-b border-gray-200 shadow-md">
          <nav className="flex flex-col px-4 py-3 gap-1">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path) ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="mt-2 flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={15} /> Logout
            </button>
          </nav>
        </div>
      )}

      <main className="p-4 md:p-8 max-w-7xl mx-auto">{children}</main>
    </div>
  )
}

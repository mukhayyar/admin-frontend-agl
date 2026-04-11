import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, AppWindow, Settings, Users, FileText, HelpCircle, Building, Menu, X } from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/ivi/dashboard' },
  { icon: AppWindow, label: 'Apps', path: '/ivi/apps' },
  { icon: FileText, label: 'Submissions', path: '/ivi/submission/1' },
  { icon: Building, label: 'Organizations', path: '/ivi/orgs' },
  { icon: Users, label: 'Users', path: '/ivi/users' },
  { icon: Settings, label: 'Settings', path: '/ivi/settings' },
]

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const isActive = (path: string) => pathname.includes(path)

  const NavContent = () => (
    <>
      <div className="mb-10 flex items-center gap-3">
        <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full">
          <div className="flex gap-0.5">
            <div className="w-1 h-3 bg-gray-500 rounded-full" />
            <div className="w-1 h-3 bg-gray-500 rounded-full" />
            <div className="w-1 h-3 bg-gray-500 rounded-full" />
          </div>
        </div>
        <h1 className="font-semibold">IVI App Store</h1>
      </div>
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive(item.path) ? 'bg-gray-100 text-brand-dark font-medium' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto pt-6 border-t">
        <Link to="/help" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-lg">
          <HelpCircle size={20} /> <span className="text-sm">Help and Docs</span>
        </Link>
      </div>
    </>
  )

  return (
    <div className="flex min-h-screen bg-brand-gray">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 p-6 flex-col fixed h-full z-10">
        <NavContent />
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="relative w-64 bg-white p-6 flex flex-col h-full z-50 shadow-xl">
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
              <X size={20} />
            </button>
            <NavContent />
          </aside>
        </div>
      )}

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button onClick={() => setOpen(true)} className="text-gray-600 hover:text-gray-900">
          <Menu size={22} />
        </button>
        <span className="font-semibold text-sm">IVI App Store</span>
      </div>

      <main className="flex-1 p-4 pt-20 lg:p-8 lg:ml-64">{children}</main>
    </div>
  )
}

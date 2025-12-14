import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, AppWindow, Settings, Users, FileText, Bell, HelpCircle, Building } from 'lucide-react';

// --- Layout for "IVI App Store" (Sidebar) ---
export const SidebarLayout: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname.includes(path);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/ivi/dashboard' },
    { icon: AppWindow, label: 'Apps', path: '/ivi/apps' },
    { icon: FileText, label: 'Submissions', path: '/ivi/submission/1' },
    { icon: Building, label: 'Organizations', path: '/ivi/orgs' },
    { icon: Users, label: 'Users', path: '/ivi/users' },
    { icon: Settings, label: 'Settings', path: '/ivi/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-brand-gray">
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col fixed h-full z-10">
        <div className="mb-10 flex items-center gap-3">
           {/* Mock logo */}
           <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full">
               <div className="flex gap-0.5">
                   <div className="w-1 h-3 bg-gray-500 rounded-full"></div>
                   <div className="w-1 h-3 bg-gray-500 rounded-full"></div>
                   <div className="w-1 h-3 bg-gray-500 rounded-full"></div>
               </div>
           </div>
          <h1 className="font-semibold">IVI App Store</h1>
        </div>
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link to={item.path} key={item.label} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.path) ? 'bg-gray-100 text-brand-dark font-medium' : 'text-gray-500 hover:bg-gray-50'}`}>
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-6 border-t">
            <Link to="/help" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-lg">
                <HelpCircle size={20} /> <span className="text-sm">Help and Docs</span>
            </Link>
        </div>
      </aside>
      <main className="flex-1 p-8 ml-64">
        <Outlet />
      </main>
    </div>
  );
};

// --- Layout for "Admin Console" (Top Nav) ---
interface AdminLayoutProps {
  title?: string;
}

export const AdminTopNavLayout: React.FC<AdminLayoutProps> = ({ title = "App Store Admin" }) => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;
  
    const links = [
      { label: 'Dashboard', path: '/admin/dashboard' },
      { label: 'Apps', path: '/admin/apps' },
      { label: 'Users', path: '/admin/users' }, // Changed to Users based on img
      { label: 'Analytics', path: '/admin/analytics' }, // Added based on img
      { label: 'Reports', path: '/admin/reports' },
      { label: 'Settings', path: '/admin/settings' },
    ];

    // Additional links for demo navigation
    const demoLinks = [
        { label: '(Health)', path: '/admin/system-health' },
        { label: '(History)', path: '/admin/review-history' },
        { label: '(Ratings)', path: '/admin/ratings' },
    ]
  
    return (
      <div className="min-h-screen bg-brand-gray">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="text-xl font-bold flex items-center gap-2">
               <span className="text-2xl">*</span> {title}
            </div>
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
            {links.map(link => (
                 <Link key={link.path} to={link.path} className={isActive(link.path) ? "text-brand-dark" : "hover:text-brand-dark"}>{link.label}</Link>
            ))}
             {/* Small separator for demo links */}
             <div className="h-4 w-px bg-gray-300 mx-2"></div>
             {demoLinks.map(link => (
                 <Link key={link.path} to={link.path} className={`text-xs ${isActive(link.path) ? "text-brand-dark font-bold" : "text-gray-400 hover:text-brand-dark"}`}>{link.label}</Link>
            ))}

            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-xs overflow-hidden border border-gray-200">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
            </div>
          </nav>
        </header>
        <main className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    );
  };

// --- Layout for "Review Queue" (Specific Top Nav) ---
export const ReviewQueueLayout: React.FC = () => {
    return (
      <div className="min-h-screen bg-brand-gray">
         <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
             {/* Mock logo */}
             <div className="flex gap-0.5">
                   <div className="w-1.5 h-4 bg-black rounded-full"></div>
                   <div className="w-1.5 h-4 bg-black rounded-full"></div>
                   <div className="w-1.5 h-4 bg-black rounded-full"></div>
               </div>
            <div className="text-xl font-bold">App Store</div>
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link to="/review-queue" className="text-brand-dark">Dashboard</Link>
            <Link to="#" className="hover:text-brand-dark">Apps</Link>
            <Link to="#" className="hover:text-brand-dark">Analytics</Link>
            <Link to="#" className="hover:text-brand-dark">Catalog</Link>
            <Link to="#" className="hover:text-brand-dark">Support</Link>
            <Bell size={20} className="text-gray-400" />
            <div className="w-8 h-8 bg-teal-800 rounded-full flex items-center justify-center text-white text-xs">
                <div className="w-4 h-4 border-2 border-white rounded-sm transform rotate-45"></div>
            </div>
          </nav>
        </header>
        <main className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    )
}
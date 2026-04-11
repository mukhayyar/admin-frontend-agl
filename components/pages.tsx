'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { reviewHistoryData, backendHealthData, reviewsData } from '@/lib/dummy'
import { Search, FileText, AppWindow, User, Copy, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { getStats, getPendingApps, getHealth, issueDeveloperToken, registerApp } from '@/lib/api'
import type { Stats, PendingApp, TokenResponse } from '@/lib/api'

// --- Landing/Role Selection ---
export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      <header className="px-8 py-6 flex justify-between items-center absolute w-full top-0">
        <div className="text-xl font-bold flex items-center gap-3">
          <div className="flex gap-0.5">
            <div className="w-1.5 h-4 bg-black rounded-full" />
            <div className="w-1.5 h-4 bg-black rounded-full" />
            <div className="w-1.5 h-4 bg-black rounded-full" />
          </div>
          App Store
        </div>
        <nav className="flex gap-6 text-sm font-medium items-center text-gray-600">
          <Link href="#">Dashboard</Link>
          <Link href="#">Apps</Link>
          <Link href="#">Documentation</Link>
          <Link href="#">Support</Link>
          <div className="w-8 h-8 bg-teal-800 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white rounded-sm transform rotate-45" />
          </div>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 mt-20">
        <h1 className="text-4xl font-bold mb-4">Welcome to the App Store</h1>
        <p className="text-gray-600 text-lg mb-12">To get started, please select your role</p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-none">
          <Link href="/admin/dashboard" className="bg-brand-dark text-white w-full sm:w-48 py-3 rounded-lg font-medium hover:opacity-90 transition text-center">Admin</Link>
          <Link href="/developer/portal" className="bg-gray-100 text-brand-dark w-full sm:w-48 py-3 rounded-lg font-medium hover:bg-gray-200 transition text-center">Developer</Link>
        </div>
      </main>
    </div>
  )
}

// --- Settings Page (Sidebar Layout) ---
export const SettingsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      <div className="border-b mb-8 flex flex-wrap gap-4 sm:gap-8 text-sm font-medium text-gray-500">
        <button className="pb-3 border-b-2 border-brand-dark text-brand-dark">Profile</button>
        <button className="pb-3 hover:text-brand-dark transition">Security</button>
        <button className="pb-3 hover:text-brand-dark transition">Notifications</button>
      </div>
      <div className="space-y-12 max-w-2xl">
        <section>
          <h2 className="text-xl font-bold mb-6">Personal Information</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Full name</label>
              <input type="text" className="input-field" defaultValue="Ethan Carter" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Email</label>
              <input type="email" className="input-field" defaultValue="ethan.carter@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Phone number</label>
              <input type="tel" className="input-field" placeholder="+1 555 000 0000" />
            </div>
          </div>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-6">Profile Photo</h2>
          <div className="flex items-center gap-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan" alt="Profile" className="w-24 h-24 rounded-full bg-orange-100" />
            <div>
              <h3 className="font-bold text-lg">Ethan Carter</h3>
              <p className="text-gray-500 mb-4 text-sm">ethan.carter@example.com</p>
              <button className="btn-secondary py-2 px-4 text-sm">Change Photo</button>
            </div>
          </div>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-6">Change Password</h2>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Current password</label>
              <input type="password" className="input-field" placeholder="Enter current password" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">New password</label>
              <input type="password" className="input-field" placeholder="Enter new password" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Confirm new password</label>
              <input type="password" className="input-field" placeholder="Confirm new password" />
            </div>
          </div>
          <button className="bg-brand-dark text-white px-6 py-2 rounded-lg text-sm font-medium">Update Password</button>
        </section>
      </div>
    </div>
  )
}

// --- System Health (Admin Layout) ---
export const SystemHealthPage: React.FC = () => {
  const [health, setHealth] = useState<{ status: string; service: string; version: string } | null>(null)
  const [healthError, setHealthError] = useState(false)

  useEffect(() => {
    getHealth().then(setHealth).catch(() => setHealthError(true))
  }, [])

  const services = [
    { service: 'REST API', status: health ? 'Healthy' : healthError ? 'Unreachable' : 'Checking…', updated: health ? `v${health.version}` : '—' },
    ...backendHealthData.slice(1),
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">System Health</h1>
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-6">UI Latency</h2>
        <div className="card h-80 relative flex flex-col justify-between">
          <div>
            <p className="text-gray-500 mb-1 font-medium">UI Latency</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-bold">20ms</h3>
              <p className="text-sm text-red-500 font-medium bg-red-50 px-2 py-0.5 rounded">Last 7 Days -5%</p>
            </div>
          </div>
          <div className="flex items-end justify-between h-40 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <svg key={i} viewBox="0 0 100 60" className="w-1/4 h-full overflow-visible" preserveAspectRatio="none">
                <path d={`M0,60 Q50,${10 * i} 100,60`} fill="none" stroke="#6b7280" strokeWidth="2" />
              </svg>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold mb-6">Backend Health</h2>
        <div className="card p-0 overflow-hidden border border-gray-200 overflow-x-auto">
          <table className="w-full text-left min-w-[400px]">
            <thead className="bg-white border-b">
              <tr>
                <th className="p-4 pl-6 text-sm font-medium text-gray-500">Service</th>
                <th className="p-4 text-sm font-medium text-gray-500 text-center">Status</th>
                <th className="p-4 text-sm font-medium text-gray-500 hidden sm:table-cell">Info</th>
              </tr>
            </thead>
            <tbody>
              {services.map((item, idx) => (
                <tr key={idx} className="border-b last:border-0 hover:bg-gray-50 transition">
                  <td className="p-4 pl-6 text-sm">{item.service}</td>
                  <td className="p-4 text-center">
                    <span className={`px-8 py-1.5 rounded-full text-xs font-semibold ${item.status === 'Healthy' ? 'bg-green-100 text-green-700' : item.status === 'Unreachable' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-400 font-light hidden sm:table-cell">{item.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

// --- Review History ---
export const ReviewHistoryPage: React.FC = () => {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Review History</h1>
        <p className="text-gray-500 font-light">View past review outcomes, including timestamps and reviewer notes.</p>
      </div>
      <div className="mb-6 relative">
        <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
        <input type="text" placeholder="Search" className="w-full bg-gray-100 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-200" />
      </div>
      <div className="card p-0 overflow-hidden border border-gray-200 overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 pl-6 text-sm font-medium text-gray-900">App Name</th>
              <th className="p-4 text-sm font-medium text-gray-900 hidden md:table-cell">Developer</th>
              <th className="p-4 text-sm font-medium text-gray-900 hidden lg:table-cell">Reviewer</th>
              <th className="p-4 text-sm font-medium text-gray-900 text-center">Outcome</th>
              <th className="p-4 text-sm font-medium text-gray-900 hidden sm:table-cell">Timestamp</th>
              <th className="p-4 text-sm font-medium text-gray-900 w-1/4 hidden lg:table-cell">Notes</th>
            </tr>
          </thead>
          <tbody>
            {reviewHistoryData.map((item) => (
              <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4 pl-6 text-sm text-gray-800">{item.appName}</td>
                <td className="p-4 text-sm text-gray-500 hidden md:table-cell">{item.developer}</td>
                <td className="p-4 text-sm text-gray-500 hidden lg:table-cell">{item.reviewer}</td>
                <td className="p-4 text-center">
                  <span className={`px-4 py-1 rounded-full text-xs font-bold ${item.outcome === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {item.outcome}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-500 whitespace-pre-line hidden sm:table-cell">{item.timestamp.replace(' ', '\n')}</td>
                <td className="p-4 text-sm text-gray-500 hidden lg:table-cell">{item.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// --- Review Queue ---
export const ReviewQueuePage: React.FC = () => {
  const [apiKey] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('admin_api_key') || '' : ''))
  const [apps, setApps] = useState<PendingApp[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    getPendingApps(apiKey)
      .then(setApps)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [apiKey])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Review Queue</h1>
        <p className="text-gray-500">Apps recently submitted or updated — pending review.</p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full text-left min-w-[500px]">
          <thead className="bg-white border-b">
            <tr>
              <th className="p-4 pl-5 text-sm font-medium text-gray-700">Name</th>
              <th className="p-4 text-sm font-medium text-gray-700 hidden sm:table-cell">Developer</th>
              <th className="p-4 text-sm font-medium text-gray-700 hidden md:table-cell">App ID</th>
              <th className="p-4 text-sm font-medium text-gray-700 hidden lg:table-cell">Added</th>
              <th className="p-4 text-sm font-medium text-gray-700 text-right pr-5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={5} className="p-8 text-center text-gray-400"><Loader className="inline animate-spin mr-2" size={16} />Loading…</td></tr>
            )}
            {!loading && error && (
              <tr><td colSpan={5} className="p-8 text-center text-red-500"><AlertCircle className="inline mr-2" size={16} />{error}</td></tr>
            )}
            {!loading && !error && apps.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-gray-400">No pending apps.</td></tr>
            )}
            {!loading && !error && apps.map((item) => (
              <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4 pl-5 font-medium text-gray-800">{item.name || item.id}</td>
                <td className="p-4 text-gray-500 hidden sm:table-cell">{item.developer_name}</td>
                <td className="p-4 font-mono text-xs text-gray-500 hidden md:table-cell">{item.id}</td>
                <td className="p-4 text-gray-500 text-sm hidden lg:table-cell">{item.added_at ? new Date(item.added_at).toLocaleDateString() : '—'}</td>
                <td className="p-4 text-right pr-5">
                  <button className="text-gray-900 font-bold hover:underline text-sm">Review</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// --- Admin Dashboard ---
export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null)
  const [statsError, setStatsError] = useState(false)

  useEffect(() => {
    getStats().then(setStats).catch(() => setStatsError(true))
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-10">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-12">
        {[
          { label: 'Total Apps', value: stats?.total_apps },
          { label: 'Total Users', value: stats?.total_users },
          { label: 'Categories', value: stats?.total_categories },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="text-gray-600 mb-2 font-medium">{label}</p>
            <h2 className="text-4xl font-bold">
              {statsError ? '—' : value !== undefined ? value.toLocaleString() : <Loader className="inline animate-spin" size={28} />}
            </h2>
          </div>
        ))}
      </div>
      <div className="flex gap-4 mb-10">
        <Link href="/developer/portal" className="bg-brand-dark text-white px-6 py-2 rounded-lg text-sm font-medium">Issue Developer Token</Link>
        <Link href="/review-queue" className="bg-gray-200 text-brand-dark px-6 py-2 rounded-lg text-sm font-medium">View Review Queue</Link>
      </div>
      <h2 className="text-xl font-bold mb-6">Activity Feed</h2>
      <div className="relative pl-4">
        <div className="absolute left-6 top-0 bottom-4 w-0.5 bg-gray-200" />
        <div className="space-y-8">
          {[
            { icon: AppWindow, text: 'New app submitted via flat-manager', time: 'recently' },
            { icon: '✓', text: 'Review queue updated', time: 'on sync' },
            { icon: AppWindow, text: 'Backend REST API started on :8002', time: 'on boot' },
            { icon: User, text: 'Developer portal activated', time: 'this session' },
            { icon: FileText, text: 'OSTree repository serving apps', time: 'running' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-4 relative z-10">
              <div className="w-5 h-5 bg-white border border-black rounded flex items-center justify-center text-xs mt-1 shadow-sm">
                {typeof item.icon === 'string' ? item.icon : <div className="w-1 h-1 bg-black rounded-full" />}
              </div>
              <div>
                <p className="font-medium text-gray-900">{item.text}</p>
                <p className="text-gray-400 text-sm">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// --- Analytics ---
export const AnalyticsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-10">App Performance Overview</h1>
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-6">Install Trends</h2>
        <div className="card h-80">
          <p className="text-gray-600 font-medium">App Installs Over Time</p>
          <h3 className="text-4xl font-bold mb-1">—</h3>
          <p className="text-sm text-green-500 font-medium mb-4">Live data coming soon</p>
          <div className="h-40 flex items-end justify-between px-2 gap-4">
            {[20, 40, 30, 60, 50, 90, 70].map((h, i) => (
              <div key={i} className="w-full relative h-full overflow-visible">
                <svg viewBox="0 0 100 100" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
                  <path d={`M0,100 Q50,${100 - h} 100,100`} fill="none" stroke="#6b7280" strokeWidth="2" />
                </svg>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2 border-t pt-2">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
          </div>
        </div>
      </section>
    </div>
  )
}

// --- Login Page ---
export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="px-8 py-6 border-b border-gray-100 flex items-center gap-3">
        <div className="text-2xl font-bold">*</div>
        <div className="font-bold text-lg">App Store Admin</div>
      </header>
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md p-8">
          <h1 className="text-3xl font-bold text-center mb-12">Welcome back</h1>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Email</label>
              <input type="email" className="input-field bg-gray-50 border-gray-100 py-3.5" placeholder="Enter your email" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Password</label>
              <input type="password" className="input-field bg-gray-50 border-gray-100 py-3.5" placeholder="Enter your password" />
            </div>
            <div className="text-center">
              <button type="button" className="text-sm text-gray-400 hover:text-gray-600">Forgot password?</button>
            </div>
            <button className="w-full bg-brand-dark text-white py-4 rounded-xl font-medium hover:opacity-90 transition">Log in</button>
          </form>
        </div>
      </main>
    </div>
  )
}

// --- Submission Details ---
export const SubmissionDetailsPage: React.FC = () => {
  return (
    <div>
      <div className="text-sm text-gray-500 mb-4 font-light">Submissions / In Review / App Details</div>
      <h1 className="text-3xl font-bold mb-2">App Submission Details</h1>
      <p className="text-gray-500 mb-12 font-light">Review the app submission and provide feedback.</p>
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-6 pb-2">App Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-12 max-w-4xl border-t border-gray-200 pt-6">
          <div><h3 className="text-xs text-gray-400 mb-1 uppercase tracking-wide">App Name</h3><p className="font-medium text-gray-900">Streamer Pro</p></div>
          <div><h3 className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Version</h3><p className="font-medium text-gray-900">1.2.3</p></div>
          <div><h3 className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Category</h3><p className="font-medium text-gray-900">Entertainment</p></div>
          <div><h3 className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Developer</h3><p className="font-medium text-gray-900">Tech Innovators Inc.</p></div>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold mb-6">Reviewer Actions</h2>
        <div className="h-48 bg-gray-50 border border-dashed border-gray-300 rounded-lg" />
      </section>
    </div>
  )
}

// --- Ratings & Reviews ---
export const RatingsReviewsPage: React.FC = () => {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Ratings & Reviews</h1>
        <p className="text-gray-500 font-light">Manage and respond to user feedback for your apps.</p>
      </div>
      <section>
        <h2 className="text-xl font-bold mb-6">Reviews</h2>
        <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
          <table className="w-full text-left min-w-[500px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 pl-6 text-sm font-medium text-gray-900">App</th>
                <th className="p-4 text-sm font-medium text-gray-900 hidden sm:table-cell">User</th>
                <th className="p-4 text-sm font-medium text-gray-900">Rating</th>
                <th className="p-4 text-sm font-medium text-gray-900 w-2/5 hidden md:table-cell">Comment</th>
                <th className="p-4 text-sm font-medium text-gray-900 hidden sm:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {reviewsData.map((item) => (
                <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-4 pl-6 font-medium text-gray-800">{item.app}</td>
                  <td className="p-4 text-gray-500 hidden sm:table-cell">{item.user}</td>
                  <td className="p-4 text-gray-500">{item.rating}</td>
                  <td className="p-4 text-gray-500 text-sm hidden md:table-cell">{item.comment}</td>
                  <td className="p-4 text-gray-500 text-sm hidden sm:table-cell">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

// --- Reset Password ---
export const ResetPasswordPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
        <div className="text-xl font-bold flex items-center gap-3">
          <div className="flex gap-0.5">
            <div className="w-1.5 h-4 bg-black rounded-full" />
            <div className="w-1.5 h-4 bg-black rounded-full" />
            <div className="w-1.5 h-4 bg-black rounded-full" />
          </div>
          App Store
        </div>
        <nav className="flex gap-6 text-sm font-medium items-center text-gray-600">
          <Link href="/admin/dashboard">Dashboard</Link>
          <Link href="#">Apps</Link>
        </nav>
      </header>
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8">Reset your password</h1>
          <form className="space-y-6">
            <input type="email" className="input-field bg-gray-100 border-transparent py-4 text-center text-lg" placeholder="Email" />
            <button className="w-full bg-black text-white py-4 rounded-lg font-medium hover:opacity-90 transition">Send reset link</button>
            <div className="text-center">
              <span className="text-gray-500">Remember your password? </span>
              <Link href="/login" className="text-gray-900 font-medium hover:underline">Sign in</Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

// --- Developer Portal ---
export const DeveloperPortalPage: React.FC = () => {
  const [apiKey, setApiKey] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('admin_api_key') || '' : ''))
  const [apiKeySaved, setApiKeySaved] = useState(typeof window !== 'undefined' && !!localStorage.getItem('admin_api_key'))

  const [regAppId, setRegAppId] = useState('')
  const [regDevName, setRegDevName] = useState('')
  const [regDevEmail, setRegDevEmail] = useState('')
  const [regLoading, setRegLoading] = useState(false)
  const [regResult, setRegResult] = useState<string | null>(null)
  const [regError, setRegError] = useState<string | null>(null)

  const [tokenDevName, setTokenDevName] = useState('')
  const [tokenRole, setTokenRole] = useState<'developer' | 'admin'>('developer')
  const [tokenAppId, setTokenAppId] = useState('')
  const [tokenLoading, setTokenLoading] = useState(false)
  const [tokenResult, setTokenResult] = useState<TokenResponse | null>(null)
  const [tokenError, setTokenError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  function saveApiKey() {
    localStorage.setItem('admin_api_key', apiKey)
    setApiKeySaved(true)
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setRegLoading(true)
    setRegResult(null)
    setRegError(null)
    try {
      const res = await registerApp(regAppId, regDevName, regDevEmail || undefined)
      setRegResult(`✓ Registered: ${res.app_id}`)
      setRegAppId('')
    } catch (err: any) {
      setRegError(err.message)
    } finally {
      setRegLoading(false)
    }
  }

  async function handleIssueToken(e: React.FormEvent) {
    e.preventDefault()
    setTokenLoading(true)
    setTokenResult(null)
    setTokenError(null)
    try {
      const res = await issueDeveloperToken(
        { developer_name: tokenDevName, role: tokenRole, app_id: tokenRole === 'developer' ? tokenAppId : undefined },
        apiKey
      )
      setTokenResult(res)
    } catch (err: any) {
      setTokenError(err.message)
    } finally {
      setTokenLoading(false)
    }
  }

  function copyToClipboard(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Developer Portal</h1>
      <p className="text-gray-500 mb-10">Register apps and issue Flatpak publishing tokens for developers.</p>

      <section className="mb-10 bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h2 className="text-lg font-bold mb-4">Admin API Key</h2>
        <p className="text-sm text-gray-500 mb-4">Required for issuing tokens and viewing pending apps. Stored locally in your browser.</p>
        <div className="flex gap-3">
          <input
            type="password"
            className="input-field flex-1"
            placeholder="Enter admin API key"
            value={apiKey}
            onChange={(e) => { setApiKey(e.target.value); setApiKeySaved(false) }}
          />
          <button onClick={saveApiKey} className="bg-brand-dark text-white px-5 py-2 rounded-lg text-sm font-medium whitespace-nowrap">
            {apiKeySaved ? <><CheckCircle className="inline mr-1" size={14} />Saved</> : 'Save Key'}
          </button>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold mb-6">Register New App</h2>
        <form onSubmit={handleRegister} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700">App ID (Flatpak reverse-domain)</label>
            <input type="text" className="input-field" placeholder="com.example.MyApp" value={regAppId} onChange={(e) => setRegAppId(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700">Developer Name</label>
            <input type="text" className="input-field" placeholder="Jane Developer" value={regDevName} onChange={(e) => setRegDevName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700">Developer Email (optional)</label>
            <input type="email" className="input-field" placeholder="jane@example.com" value={regDevEmail} onChange={(e) => setRegDevEmail(e.target.value)} />
          </div>
          {regResult && <p className="text-green-600 text-sm font-medium">{regResult}</p>}
          {regError && <p className="text-red-600 text-sm flex items-center gap-1"><AlertCircle size={14} />{regError}</p>}
          <button type="submit" disabled={regLoading} className="bg-brand-dark text-white px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-50">
            {regLoading ? <><Loader className="inline animate-spin mr-1" size={14} />Registering…</> : 'Register App'}
          </button>
        </form>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold mb-2">Issue Publishing Token</h2>
        <p className="text-sm text-gray-500 mb-6">Generates a flat-manager JWT token for a developer to publish Flatpak apps.</p>
        <form onSubmit={handleIssueToken} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700">Developer Name</label>
            <input type="text" className="input-field" placeholder="Jane Developer" value={tokenDevName} onChange={(e) => setTokenDevName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700">Role</label>
            <select className="input-field" value={tokenRole} onChange={(e) => setTokenRole(e.target.value as 'developer' | 'admin')}>
              <option value="developer">Developer (scoped to one app)</option>
              <option value="admin">Admin (all apps + publish)</option>
            </select>
          </div>
          {tokenRole === 'developer' && (
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700">App ID</label>
              <input type="text" className="input-field" placeholder="com.example.MyApp" value={tokenAppId} onChange={(e) => setTokenAppId(e.target.value)} required />
            </div>
          )}
          {tokenError && <p className="text-red-600 text-sm flex items-center gap-1"><AlertCircle size={14} />{tokenError}</p>}
          <button type="submit" disabled={tokenLoading || !apiKeySaved} className="bg-brand-dark text-white px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-50" title={!apiKeySaved ? 'Save your API key first' : ''}>
            {tokenLoading ? <><Loader className="inline animate-spin mr-1" size={14} />Generating…</> : 'Generate Token'}
          </button>
        </form>

        {tokenResult && (
          <div className="mt-8 space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-green-800">Token Generated</h3>
                <button onClick={() => copyToClipboard(tokenResult.token, 'token')} className="text-xs text-green-700 flex items-center gap-1 hover:underline">
                  {copied === 'token' ? <><CheckCircle size={12} />Copied!</> : <><Copy size={12} />Copy token</>}
                </button>
              </div>
              <code className="block bg-white border border-green-100 rounded-lg p-3 text-xs font-mono break-all text-gray-800">
                {tokenResult.token}
              </code>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-800">Publishing Instructions</h3>
                <button onClick={() => copyToClipboard(tokenResult.instructions, 'instructions')} className="text-xs text-gray-600 flex items-center gap-1 hover:underline">
                  {copied === 'instructions' ? <><CheckCircle size={12} />Copied!</> : <><Copy size={12} />Copy all</>}
                </button>
              </div>
              <pre className="text-xs font-mono text-gray-700 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                {tokenResult.instructions}
              </pre>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

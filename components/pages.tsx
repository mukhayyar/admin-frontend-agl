import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useAuthStore, useSubmissionsStore, useStatsStore, useScanStore } from '../lib/stores'
import {
  Package,
  Users,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  RefreshCw,
  Key,
  Copy,
  Trash2,
  Plus,
  ExternalLink,
  ShieldCheck,
  LayoutDashboard,
  Star,
  ChevronLeft,
  BookOpen,
  Terminal,
  AlertTriangle,
  Send,
  Github,
} from 'lucide-react'
import {
  getToken,
  setToken,
  clearToken,
  loginGitHub,
  getAuthUser,
  acceptPublisherAgreement,
  createDevKey,
  listDevKeys,
  revokeDevKey,
  submitApp,
  listMySubmissions,
  updateSubmission,
  getAdminStats,
  getStats,
  listAdminSubmissions,
  getAdminSubmission,
  approveSubmission,
  rejectSubmission,
  updateUserRole,
  getHealth,
  getCategories,
  loginEmail,
  registerEmail,
  checkEmail,
  forgotPassword,
  resetPasswordApi,
  verifyEmail,
  resendVerification,
  listUsers,
  trustPublisher,
  untrustPublisher,
} from '@/lib/api'
import type { AuthUser, DevKey, AppSubmission, AdminStats, PlatformStats } from '@/lib/types'

// ── Shared helpers ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  }
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${styles[status] ?? 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  )
}

function LoadingPulse({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-10 bg-gray-200 rounded-lg" />
      ))}
    </div>
  )
}

function EmptyState({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-gray-300 mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-700 mb-1">{title}</h3>
      <p className="text-gray-400 text-sm">{desc}</p>
    </div>
  )
}

function fmtDate(iso?: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

// ── Landing Page ──────────────────────────────────────────────────────────────

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center gap-3">
        <div className="flex gap-0.5">
          <div className="w-1.5 h-4 bg-indigo-600 rounded-full" />
          <div className="w-1.5 h-4 bg-indigo-600 rounded-full" />
          <div className="w-1.5 h-4 bg-indigo-600 rounded-full" />
        </div>
        <span className="text-xl font-bold text-gray-900">AGL App Store</span>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-3 text-center">AGL App Store</h1>
        <p className="text-gray-500 text-lg mb-12 text-center">Management Portal</p>

        <div className="grid sm:grid-cols-2 gap-6 w-full max-w-xl">
          <Link
            to="/admin/dashboard"
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md hover:border-indigo-300 transition-all group"
          >
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
              <LayoutDashboard className="text-indigo-600" size={24} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Admin Portal</h2>
            <p className="text-sm text-gray-500">Review submissions, manage apps and users, view analytics.</p>
          </Link>

          <Link
            to="/developer/portal"
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md hover:border-indigo-300 transition-all group"
          >
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
              <Package className="text-emerald-600" size={24} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Developer Portal</h2>
            <p className="text-sm text-gray-500">Submit apps, manage API keys, track your submissions.</p>
          </Link>
        </div>
      </main>
    </div>
  )
}

// ── Login Page ────────────────────────────────────────────────────────────────

export const LoginPage: React.FC = () => {
  const [tab, setTab] = useState<'email' | 'github' | 'register' | 'forgot'>('email')
  const [token, setTokenInput] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [orgInfo, setOrgInfo] = useState<{ is_organization_email: boolean; organization_domain: string | null } | null>(null)
  const navigate = useNavigate()

  async function handleEmailCheck(e: string) {
    setEmail(e)
    if (e.includes('@') && e.includes('.')) {
      try { const info = await checkEmail(e); setOrgInfo(info) } catch {}
    } else { setOrgInfo(null) }
  }

  async function handleEmailLogin() {
    if (!email.trim() || !password.trim()) return
    setLoading(true); setError(null)
    try {
      const res = await loginEmail(email.trim(), password.trim())
      setToken(res.access_token)
      navigate('/admin/dashboard')
    } catch (e) { setError(e instanceof Error ? e.message : 'Login failed') }
    finally { setLoading(false) }
  }

  async function handleGitHubLogin() {
    if (!token.trim()) return
    setLoading(true); setError(null)
    try {
      const res = await loginGitHub(token.trim())
      setToken(res.access_token)
      navigate('/admin/dashboard')
    } catch (e) { setError(e instanceof Error ? e.message : 'Login failed') }
    finally { setLoading(false) }
  }

  async function handleRegister() {
    if (!email.trim() || !password.trim() || !displayName.trim()) return
    if (password !== confirmPassword) { setError('Passwords do not match'); return }
    setLoading(true); setError(null)
    try {
      await registerEmail(email.trim(), password.trim(), displayName.trim())
      setSuccess('Account created! Check your email to verify your account.')
      setTab('email')
    } catch (e) { setError(e instanceof Error ? e.message : 'Registration failed') }
    finally { setLoading(false) }
  }

  async function handleForgotPassword() {
    if (!email.trim()) return
    setLoading(true); setError(null)
    try {
      await forgotPassword(email.trim())
      setSuccess('Password reset email sent! Check your inbox.')
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to send reset email') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">PensHub App Store</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to continue</p>
        </div>

        {tab !== 'register' && tab !== 'forgot' && (
          <div className="flex border border-gray-200 rounded-lg mb-6 overflow-hidden">
            <button onClick={() => { setTab('email'); setError(null); setSuccess(null) }} className={`flex-1 py-2 text-sm font-medium transition-colors ${tab === 'email' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>Email</button>
            <button onClick={() => { setTab('github'); setError(null); setSuccess(null) }} className={`flex-1 py-2 text-sm font-medium transition-colors ${tab === 'github' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>GitHub</button>
          </div>
        )}

        {success && <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700 mb-4">{success}</div>}
        {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 mb-4">{error}</div>}

        {tab === 'email' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => handleEmailCheck(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleEmailLogin()} placeholder="you@example.com" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              {orgInfo?.is_organization_email && <p className="text-xs text-indigo-600 mt-1">🏢 Organization account ({orgInfo.organization_domain})</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleEmailLogin()} placeholder="••••••••" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <button onClick={handleEmailLogin} disabled={loading || !email.trim() || !password.trim()} className="w-full bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
              {loading ? <RefreshCw size={16} className="animate-spin" /> : null}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
            <div className="flex justify-between text-xs text-gray-500">
              <button onClick={() => { setTab('register'); setError(null); setSuccess(null) }} className="hover:text-indigo-600 underline">Create account</button>
              <button onClick={() => { setTab('forgot'); setError(null); setSuccess(null) }} className="hover:text-indigo-600 underline">Forgot password?</button>
            </div>
          </div>
        )}

        {tab === 'github' && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 text-sm text-gray-600">
              <p className="font-semibold text-gray-700 mb-1">How to get a token:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Go to <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer" className="text-indigo-600 underline">github.com/settings/tokens</a></li>
                <li>Click "Generate new token (classic)"</li>
                <li>Select scopes: <code className="bg-gray-200 px-1 rounded">read:user</code>, <code className="bg-gray-200 px-1 rounded">user:email</code></li>
              </ol>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">GitHub Personal Access Token</label>
              <input type="password" value={token} onChange={e => setTokenInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleGitHubLogin()} placeholder="ghp_xxxxxxxxxxxxxxxxxxxx" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <button onClick={handleGitHubLogin} disabled={loading || !token.trim()} className="w-full bg-gray-900 text-white px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
              {loading ? <RefreshCw size={16} className="animate-spin" /> : <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>}
              {loading ? 'Signing in…' : 'Sign in with GitHub'}
            </button>
          </div>
        )}

        {tab === 'register' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <button onClick={() => { setTab('email'); setError(null) }} className="text-gray-500 hover:text-gray-700"><ChevronLeft size={16} /></button>
              <h2 className="font-semibold text-gray-900">Create Account</h2>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Display Name</label>
              <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Your Name" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => handleEmailCheck(e.target.value)} placeholder="you@example.com" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              {orgInfo?.is_organization_email && <p className="text-xs text-indigo-600 mt-1">🏢 Organization account ({orgInfo.organization_domain})</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleRegister()} placeholder="••••••••" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <button onClick={handleRegister} disabled={loading || !email.trim() || !password.trim() || !displayName.trim()} className="w-full bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
              {loading ? <RefreshCw size={16} className="animate-spin" /> : null}
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </div>
        )}

        {tab === 'forgot' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <button onClick={() => { setTab('email'); setError(null) }} className="text-gray-500 hover:text-gray-700"><ChevronLeft size={16} /></button>
              <h2 className="font-semibold text-gray-900">Reset Password</h2>
            </div>
            <p className="text-sm text-gray-600">Enter your email and we'll send a reset link.</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleForgotPassword()} placeholder="you@example.com" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <button onClick={handleForgotPassword} disabled={loading || !email.trim()} className="w-full bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
              {loading ? <RefreshCw size={16} className="animate-spin" /> : null}
              {loading ? 'Sending…' : 'Send Reset Link'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Admin Dashboard Page ──────────────────────────────────────────────────────

export const AdminDashboardPage: React.FC = () => {
  const { stats, setStats, loading: statsLoading, setLoading: setStatsLoading } = useStatsStore()
  const { submissions, setSubmissions } = useSubmissionsStore()
  const [recentSubs, setRecentSubs] = useState<AppSubmission[]>([])
  const [loading, setLoading] = useState(!stats)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const s = await getAdminStats().catch(async () => {
          const ps = await getStats()
          return {
            total_apps: ps.total_apps,
            total_users: ps.total_users,
            pending_submissions: 0,
            total_submissions: 0,
            approved_submissions: 0,
            rejected_submissions: 0,
          } as AdminStats
        })
        setStats(s)
        const subs = await listAdminSubmissions().catch(() => [] as AppSubmission[])
        setSubmissions(subs)
        setRecentSubs(subs.slice(0, 5))
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const cards = stats
    ? [
        { icon: <Package size={24} />, label: 'Total Apps', value: stats.total_apps, color: 'indigo' },
        { icon: <Users size={24} />, label: 'Total Users', value: stats.total_users, color: 'blue' },
        {
          icon: <Clock size={24} />,
          label: 'Pending Submissions',
          value: stats.pending_submissions,
          color: stats.pending_submissions > 0 ? 'amber' : 'gray',
        },
        { icon: <FileText size={24} />, label: 'Total Submissions', value: stats.total_submissions, color: 'emerald' },
      ]
    : []

  const colorMap: Record<string, string> = {
    indigo: 'bg-indigo-100 text-indigo-600',
    blue: 'bg-blue-100 text-blue-600',
    amber: 'bg-amber-100 text-amber-600',
    gray: 'bg-gray-100 text-gray-600',
    emerald: 'bg-emerald-100 text-emerald-600',
  }

  const cardBorderMap: Record<string, string> = {
    amber: 'border-amber-300 bg-amber-50',
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-gray-500 text-sm">Overview of the AGL App Store.</p>
      </div>

      {loading ? (
        <LoadingPulse rows={4} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map(card => (
            <div
              key={card.label}
              className={`bg-white rounded-xl border shadow-sm p-6 ${cardBorderMap[card.color] ?? 'border-gray-200'}`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colorMap[card.color]}`}>
                {card.icon}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-0.5">{card.value}</div>
              <div className="text-sm text-gray-500">{card.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Recent Submissions</h2>
          <Link to="/admin/submissions" className="text-sm text-indigo-600 hover:underline">
            View all
          </Link>
        </div>
        {loading ? (
          <div className="p-6">
            <LoadingPulse rows={5} />
          </div>
        ) : recentSubs.length === 0 ? (
          <EmptyState
            icon={<FileText size={40} />}
            title="No submissions yet"
            desc="Submissions will appear here once developers submit apps."
          />
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">App</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Submitted</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentSubs.map(sub => (
                <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 font-medium text-gray-900">{sub.name}</td>
                  <td className="px-6 py-3"><StatusBadge status={sub.status} /></td>
                  <td className="px-6 py-3 text-gray-500">{fmtDate(sub.submitted_at)}</td>
                  <td className="px-6 py-3 text-right">
                    <Link to={`/admin/submissions/${sub.id}`} className="text-indigo-600 hover:underline text-xs font-medium">
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// ── Submissions List Page ─────────────────────────────────────────────────────

type SubmissionFilter = 'all' | 'pending' | 'approved' | 'rejected'

export const SubmissionsListPage: React.FC = () => {
  const { filter, setFilter, submissions, setSubmissions, loading, setLoading, error, setError } = useSubmissionsStore()

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await listAdminSubmissions(filter === 'all' ? undefined : filter)
      setSubmissions(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load submissions')
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => { load() }, [load])

  const filters: SubmissionFilter[] = ['all', 'pending', 'approved', 'rejected']

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">App Submissions</h1>
        <p className="text-gray-500 text-sm">Review and manage app submissions from developers.</p>
      </div>

      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
              filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {error ? (
          <div className="p-6 text-red-700 bg-red-50 rounded-xl">{error}</div>
        ) : loading ? (
          <div className="p-6"><LoadingPulse rows={6} /></div>
        ) : submissions.length === 0 ? (
          <EmptyState
            icon={<FileText size={40} />}
            title="No submissions found"
            desc={`No ${filter === 'all' ? '' : filter + ' '}submissions at the moment.`}
          />
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">App ID</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Submitted</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {submissions.map(sub => (
                <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 font-mono text-xs text-gray-500">{sub.app_id}</td>
                  <td className="px-6 py-3 font-medium text-gray-900">{sub.name}</td>
                  <td className="px-6 py-3"><StatusBadge status={sub.status} /></td>
                  <td className="px-6 py-3 text-gray-500">{fmtDate(sub.submitted_at)}</td>
                  <td className="px-6 py-3 text-right">
                    <Link
                      to={`/admin/submissions/${sub.id}`}
                      className="text-indigo-600 hover:underline text-xs font-medium"
                    >
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// ── Submission Details Page ───────────────────────────────────────────────────

export const SubmissionDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [sub, setSub] = useState<AppSubmission | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getAdminSubmission(Number(id))
      .then(setSub)
      .catch(e => setError(e instanceof Error ? e.message : 'Failed to load submission'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleApprove() {
    if (!sub) return
    setActionLoading(true)
    try {
      await approveSubmission(sub.id)
      setSub({ ...sub, status: 'approved' })
      setActionSuccess('Submission approved successfully.')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to approve')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleReject() {
    if (!sub || !rejectReason.trim()) return
    setActionLoading(true)
    try {
      await rejectSubmission(sub.id, rejectReason.trim())
      setSub({ ...sub, status: 'rejected', rejection_reason: rejectReason.trim() })
      setActionSuccess('Submission rejected.')
      setRejectOpen(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to reject')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) return <div className="p-8"><LoadingPulse rows={8} /></div>
  if (error) return <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 m-8">{error}</div>
  if (!sub) return null

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {sub.icon ? (
            <img src={sub.icon} alt={sub.name} className="w-16 h-16 rounded-xl border border-gray-200 object-contain bg-white" />
          ) : (
            <div className="w-16 h-16 rounded-xl border border-gray-200 bg-gray-100 flex items-center justify-center text-gray-400">
              <Package size={28} />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{sub.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <code className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500">{sub.app_id}</code>
              <StatusBadge status={sub.status} />
            </div>
          </div>
        </div>
        <Link to="/admin/submissions" className="text-sm text-gray-500 hover:text-gray-700 mt-1">
          ← Back
        </Link>
      </div>

      {actionSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 text-sm flex items-center gap-2">
          <CheckCircle size={16} />
          {actionSuccess}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {sub.summary && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-2">Summary</h2>
              <p className="text-gray-600 text-sm">{sub.summary}</p>
            </div>
          )}

          {sub.description && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-600 text-sm whitespace-pre-wrap">{sub.description}</p>
            </div>
          )}

          {sub.categories.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-3">Categories</h2>
              <div className="flex flex-wrap gap-2">
                {sub.categories.map(cat => (
                  <span key={cat} className="bg-indigo-50 text-indigo-700 text-xs px-3 py-1 rounded-full font-medium">{cat}</span>
                ))}
              </div>
            </div>
          )}

          {sub.screenshots.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-3">Screenshots</h2>
              <div className="grid grid-cols-2 gap-3">
                {sub.screenshots.map((ss, i) => (
                  <div key={i} className="rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                    <img src={ss.url} alt={ss.caption ?? `Screenshot ${i + 1}`} className="w-full object-cover" />
                    {ss.caption && <p className="text-xs text-gray-500 px-2 py-1">{ss.caption}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {sub.rejection_reason && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h2 className="font-semibold text-red-800 mb-2">Rejection Reason</h2>
              <p className="text-red-700 text-sm">{sub.rejection_reason}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Submission Info</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-400 text-xs mb-0.5">Developer (user ID)</dt>
                <dd className="font-medium text-gray-700">{sub.user_id}</dd>
              </div>
              <div>
                <dt className="text-gray-400 text-xs mb-0.5">App Type</dt>
                <dd className="font-medium text-gray-700">{sub.app_type}</dd>
              </div>
              {sub.license && (
                <div>
                  <dt className="text-gray-400 text-xs mb-0.5">License</dt>
                  <dd className="font-medium text-gray-700">{sub.license}</dd>
                </div>
              )}
              <div>
                <dt className="text-gray-400 text-xs mb-0.5">Submitted</dt>
                <dd className="font-medium text-gray-700">{fmtDate(sub.submitted_at)}</dd>
              </div>
              {sub.reviewed_at && (
                <div>
                  <dt className="text-gray-400 text-xs mb-0.5">Reviewed</dt>
                  <dd className="font-medium text-gray-700">{fmtDate(sub.reviewed_at)}</dd>
                </div>
              )}
              {sub.homepage && (
                <div>
                  <dt className="text-gray-400 text-xs mb-0.5">Homepage</dt>
                  <dd>
                    <a href={sub.homepage} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline text-xs flex items-center gap-1">
                      {sub.homepage} <ExternalLink size={10} />
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {sub.status === 'pending' && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
              <h2 className="font-semibold text-gray-900">Actions</h2>
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
              >
                <CheckCircle size={16} />
                {actionLoading ? 'Processing…' : 'Approve'}
              </button>
              <button
                onClick={() => setRejectOpen(!rejectOpen)}
                disabled={actionLoading}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
              >
                <XCircle size={16} />
                Reject
              </button>

              {rejectOpen && (
                <div className="space-y-2">
                  <textarea
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                    placeholder="Reason for rejection…"
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                  />
                  <button
                    onClick={handleReject}
                    disabled={actionLoading || !rejectReason.trim()}
                    className="w-full bg-red-700 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-red-800 disabled:opacity-50 transition-colors"
                  >
                    {actionLoading ? 'Submitting…' : 'Confirm Rejection'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Review Queue Page ─────────────────────────────────────────────────────────

export const ReviewQueuePage: React.FC = () => {
  const [submissions, setSubmissions] = useState<AppSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionId, setActionId] = useState<number | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await listAdminSubmissions('pending')
      setSubmissions(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load queue')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function handleApprove(id: number) {
    setActionId(id)
    try {
      await approveSubmission(id)
      setSubmissions(prev => prev.filter(s => s.id !== id))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to approve')
    } finally {
      setActionId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Review Queue</h1>
          <p className="text-gray-500 text-sm">Pending apps awaiting review.</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div>
      )}

      {loading ? (
        <LoadingPulse rows={6} />
      ) : submissions.length === 0 ? (
        <EmptyState
          icon={<CheckCircle size={48} />}
          title="Queue is empty"
          desc="All submissions have been reviewed. Nice work!"
        />
      ) : (
        <div className="space-y-4">
          {submissions.map(sub => (
            <div key={sub.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900">{sub.name}</div>
                  <div className="text-xs text-gray-400 font-mono mt-0.5">{sub.app_id}</div>
                  <div className="text-xs text-gray-400 mt-1">Submitted {fmtDate(sub.submitted_at)}</div>
                  {sub.summary && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{sub.summary}</p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link
                    to={`/admin/submissions/${sub.id}`}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleApprove(sub.id)}
                    disabled={actionId === sub.id}
                    className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    {actionId === sub.id ? '…' : 'Approve'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Review History Page ───────────────────────────────────────────────────────

export const ReviewHistoryPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<AppSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listAdminSubmissions()
      .then(data => setSubmissions(data.filter(s => s.status !== 'pending')))
      .catch(e => setError(e instanceof Error ? e.message : 'Failed to load history'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Review History</h1>
        <p className="text-gray-500 text-sm">All reviewed submissions.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {error ? (
          <div className="p-6 text-red-700">{error}</div>
        ) : loading ? (
          <div className="p-6"><LoadingPulse rows={6} /></div>
        ) : submissions.length === 0 ? (
          <EmptyState
            icon={<FileText size={40} />}
            title="No reviewed submissions"
            desc="Reviewed submissions will appear here."
          />
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">App Name</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Developer</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Reviewed</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {submissions.map(sub => (
                <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 font-medium text-gray-900">
                    <Link to={`/admin/submissions/${sub.id}`} className="hover:text-indigo-600">{sub.name}</Link>
                  </td>
                  <td className="px-6 py-3 text-gray-500">User {sub.user_id}</td>
                  <td className="px-6 py-3"><StatusBadge status={sub.status} /></td>
                  <td className="px-6 py-3 text-gray-500">{fmtDate(sub.reviewed_at)}</td>
                  <td className="px-6 py-3 text-gray-500 max-w-xs truncate">{sub.rejection_reason ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// ── Analytics Page ────────────────────────────────────────────────────────────

export const AnalyticsPage: React.FC = () => {
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null)
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getStats().catch(() => null),
      getAdminStats().catch(() => null),
    ]).then(([ps, as]) => {
      setPlatformStats(ps)
      setAdminStats(as)
    }).finally(() => setLoading(false))
  }, [])

  const bars = adminStats
    ? [
        { label: 'Approved', value: adminStats.approved_submissions, max: adminStats.total_submissions || 1, color: 'bg-green-500' },
        { label: 'Pending', value: adminStats.pending_submissions, max: adminStats.total_submissions || 1, color: 'bg-amber-400' },
        { label: 'Rejected', value: adminStats.rejected_submissions, max: adminStats.total_submissions || 1, color: 'bg-red-500' },
      ]
    : []

  const bigNumbers = [
    { label: 'Total Apps', value: platformStats?.total_apps ?? adminStats?.total_apps ?? '—' },
    { label: 'Total Users', value: platformStats?.total_users ?? adminStats?.total_users ?? '—' },
    { label: 'Categories', value: platformStats?.total_categories ?? '—' },
    { label: 'Submissions', value: adminStats?.total_submissions ?? '—' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Analytics</h1>
        <p className="text-gray-500 text-sm">Platform statistics and submission metrics.</p>
      </div>

      {loading ? (
        <LoadingPulse rows={4} />
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {bigNumbers.map(n => (
              <div key={n.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="text-4xl font-bold text-gray-900 mb-1">{n.value}</div>
                <div className="text-sm text-gray-500">{n.label}</div>
              </div>
            ))}
          </div>

          {adminStats && adminStats.total_submissions > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-6">Submissions Breakdown</h2>
              <div className="space-y-4">
                {bars.map(bar => {
                  const pct = Math.round((bar.value / bar.max) * 100)
                  return (
                    <div key={bar.label}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-medium text-gray-700">{bar.label}</span>
                        <span className="text-gray-500">{bar.value} ({pct}%)</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${bar.color} transition-all`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ── System Health Page ────────────────────────────────────────────────────────

export const SystemHealthPage: React.FC = () => {
  const [health, setHealth] = useState<{ status: string; service: string; version: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const h = await getHealth()
      setHealth(h)
      setLastChecked(new Date())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Health check failed')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const isOk = health?.status === 'ok' || health?.status === 'healthy'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">System Health</h1>
          <p className="text-gray-500 text-sm">API service status.</p>
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="font-semibold text-red-800">Service Unavailable</span>
          </div>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {health && (
        <div className={`rounded-xl border shadow-sm p-6 ${isOk ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-4 h-4 rounded-full ${isOk ? 'bg-green-500' : 'bg-yellow-400'}`} />
            <span className={`font-semibold text-lg ${isOk ? 'text-green-800' : 'text-yellow-800'}`}>
              {isOk ? 'All Systems Operational' : 'Degraded'}
            </span>
          </div>
          <dl className="grid sm:grid-cols-3 gap-4 text-sm">
            <div>
              <dt className="text-gray-500 text-xs mb-0.5">Status</dt>
              <dd className="font-semibold text-gray-800 capitalize">{health.status}</dd>
            </div>
            <div>
              <dt className="text-gray-500 text-xs mb-0.5">Service</dt>
              <dd className="font-semibold text-gray-800">{health.service}</dd>
            </div>
            <div>
              <dt className="text-gray-500 text-xs mb-0.5">Version</dt>
              <dd className="font-semibold text-gray-800">{health.version}</dd>
            </div>
          </dl>
          {lastChecked && (
            <p className="text-xs text-gray-400 mt-4">Last checked: {lastChecked.toLocaleTimeString()}</p>
          )}
        </div>
      )}
    </div>
  )
}

// ── Developer Portal Page ─────────────────────────────────────────────────────

export const DeveloperPortalPage: React.FC = () => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [ghToken, setGhToken] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  // Agreement
  const [agreementLoading, setAgreementLoading] = useState(false)

  // Keys
  const [keys, setKeys] = useState<DevKey[]>([])
  const [keysLoading, setKeysLoading] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [createdKey, setCreatedKey] = useState<{ token: string; name: string } | null>(null)
  const [keyCreateLoading, setKeyCreateLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  // Submit app
  const [categories, setCategories] = useState<{ name: string; description: string }[]>([])
  const [submitForm, setSubmitForm] = useState({
    app_id: '',
    name: '',
    summary: '',
    description: '',
    icon: '',
    homepage: '',
    license: '',
    app_type: 'desktop',
    categories: [] as string[],
    screenshots: [] as { url: string; caption: string }[],
  })
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [screenshotUrl, setScreenshotUrl] = useState('')

  // My submissions
  const [mySubs, setMySubs] = useState<AppSubmission[]>([])
  const [mySubsLoading, setMySubsLoading] = useState(false)

  // Trust publisher request
  const [trustRequestStatus, setTrustRequestStatus] = useState<string | null>(null)
  const [trustForm, setTrustForm] = useState({ reason: '', github: '', portfolio: '' })
  const [trustFormOpen, setTrustFormOpen] = useState(false)
  const [trustSubmitting, setTrustSubmitting] = useState(false)
  const [trustMsg, setTrustMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const { user: storedAuthUser, setUser: setStoredUser, token } = useAuthStore()

  const loadUser = useCallback(async () => {
    if (!token) { setAuthLoading(false); return }
    if (storedAuthUser) { setUser(storedAuthUser); setAuthLoading(false); return }
    try {
      const u = await getAuthUser()
      setUser(u)
      setStoredUser(u)
    } catch {
      setUser(null)
    } finally {
      setAuthLoading(false)
    }
  }, [token, storedAuthUser])

  const loadKeys = useCallback(async () => {
    setKeysLoading(true)
    try { setKeys(await listDevKeys()) }
    catch { /* ignore */ }
    finally { setKeysLoading(false) }
  }, [])

  const loadMySubs = useCallback(async () => {
    setMySubsLoading(true)
    try { setMySubs(await listMySubmissions()) }
    catch { /* ignore */ }
    finally { setMySubsLoading(false) }
  }, [])

  useEffect(() => {
    loadUser()
    getCategories().then(setCategories).catch(() => [])
  }, [loadUser])

  useEffect(() => {
    if (user) { loadKeys(); loadMySubs() }
  }, [user, loadKeys, loadMySubs])

  async function handleGhLogin() {
    if (!ghToken.trim()) return
    setLoginLoading(true)
    setLoginError(null)
    try {
      const res = await loginGitHub(ghToken.trim())
      setToken(res.access_token)
      const u = await getAuthUser()
      setUser(u)
    } catch (e) {
      setLoginError(e instanceof Error ? e.message : 'Login failed')
    } finally {
      setLoginLoading(false)
    }
  }

  async function handleAcceptAgreement() {
    setAgreementLoading(true)
    try {
      await acceptPublisherAgreement()
      setUser(prev => prev ? { ...prev, accepted_publisher_agreement: true } : prev)
    } catch { /* ignore */ }
    finally { setAgreementLoading(false) }
  }

  async function handleCreateKey() {
    if (!newKeyName.trim()) return
    setKeyCreateLoading(true)
    try {
      const k = await createDevKey(newKeyName.trim())
      setCreatedKey({ token: k.token, name: k.name })
      setNewKeyName('')
      loadKeys()
    } catch { /* ignore */ }
    finally { setKeyCreateLoading(false) }
  }

  async function handleRevokeKey(id: number) {
    try {
      await revokeDevKey(id)
      setKeys(prev => prev.filter(k => k.id !== id))
    } catch { /* ignore */ }
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function toggleCategory(cat: string) {
    setSubmitForm(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat],
    }))
  }

  async function handleTrustSubmit() {
    if (!trustForm.reason.trim()) return
    setTrustSubmitting(true); setTrustMsg(null)
    try {
      await requestTrustedPublisher(trustForm.reason, trustForm.github || undefined, trustForm.portfolio || undefined)
      setTrustRequestStatus('pending')
      setTrustFormOpen(false)
      setTrustMsg({ type: 'ok', text: 'Request submitted! An admin will review it shortly.' })
    } catch (e) {
      setTrustMsg({ type: 'err', text: e instanceof Error ? e.message : 'Submission failed' })
    } finally { setTrustSubmitting(false) }
  }

  function addScreenshot() {
    if (!screenshotUrl.trim()) return
    setSubmitForm(prev => ({
      ...prev,
      screenshots: [...prev.screenshots, { url: screenshotUrl.trim(), caption: '' }],
    }))
    setScreenshotUrl('')
  }

  async function handleSubmitApp() {
    setSubmitLoading(true)
    setSubmitError(null)
    setSubmitSuccess(false)
    try {
      await submitApp({
        ...submitForm,
        screenshots: submitForm.screenshots.map(s => ({ url: s.url, caption: s.caption || undefined })),
      })
      setSubmitSuccess(true)
      setSubmitForm({
        app_id: '', name: '', summary: '', description: '', icon: '',
        homepage: '', license: '', app_type: 'desktop', categories: [], screenshots: [],
      })
      loadMySubs()
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Submission failed')
    } finally {
      setSubmitLoading(false)
    }
  }

  if (authLoading) return <div className="p-8"><LoadingPulse rows={4} /></div>

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Sign in to Developer Portal</h2>
          <p className="text-gray-500 text-sm mb-6">Enter your GitHub Personal Access Token to continue.</p>

          <div className="space-y-3">
            <input
              type="password"
              value={ghToken}
              onChange={e => setGhToken(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleGhLogin()}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {loginError && <p className="text-red-600 text-sm">{loginError}</p>}
            <button
              onClick={handleGhLogin}
              disabled={loginLoading || !ghToken.trim()}
              className="w-full bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {loginLoading ? 'Signing in…' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Welcome */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
          <Users className="text-indigo-600" size={22} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Welcome, {user.display_name}</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium capitalize">{user.role}</span>
            {user.email && <span className="text-xs text-gray-400">{user.email}</span>}
          </div>
        </div>
      </div>

      {/* Quick Start Guide */}
      <section className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl border border-indigo-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="text-indigo-600" size={18} />
          <h2 className="font-semibold text-gray-900">How to publish your app</h2>
        </div>
        <ol className="space-y-3 text-sm">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
            <div>
              <p className="font-medium text-gray-800">Install prerequisites</p>
              <code className="block mt-1 bg-white/80 rounded px-2 py-1 text-xs font-mono text-gray-600">sudo apt install flatpak flatpak-builder<br />flatpak install flathub org.gnome.Platform//45 org.gnome.Sdk//45</code>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
            <div>
              <p className="font-medium text-gray-800">Build your app</p>
              <code className="block mt-1 bg-white/80 rounded px-2 py-1 text-xs font-mono text-gray-600">flatpak-builder --force-clean build-dir com.pens.MyApp.yml</code>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <p className="font-medium text-gray-800">Export to a local repo</p>
                <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-semibold">Required</span>
              </div>
              <code className="block mt-1 bg-white/80 rounded px-2 py-1 text-xs font-mono text-gray-600">flatpak build-export repo build-dir</code>
              <div className="flex items-start gap-1.5 mt-1.5 bg-amber-50 border border-amber-200 rounded px-2 py-1.5">
                <AlertTriangle size={12} className="text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-700">Never use raw <code className="font-mono">ostree commit</code> — it breaks app metadata and the install will fail.</p>
              </div>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
            <div>
              <p className="font-medium text-gray-800">Submit app metadata below, then upload via API</p>
              <code className="block mt-1 bg-white/80 rounded px-2 py-1 text-xs font-mono text-gray-600">flat-manager-client push --token YOUR_API_KEY https://admin.agl-store.cyou/api/v1 stable repo/</code>
            </div>
          </li>
        </ol>
      </section>

      {/* Publisher agreement */}
      {!user.accepted_publisher_agreement && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="text-amber-600 mt-0.5 shrink-0" size={20} />
            <div>
              <h3 className="font-semibold text-amber-900 mb-1">Publisher Agreement Required</h3>
              <p className="text-amber-700 text-sm mb-3">
                You must accept the Publisher Agreement before submitting apps to the AGL App Store.
              </p>
              <button
                onClick={handleAcceptAgreement}
                disabled={agreementLoading}
                className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 disabled:opacity-50 transition-colors"
              >
                {agreementLoading ? 'Accepting…' : 'Accept Publisher Agreement'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API Keys */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2"><Key size={18} /> API Keys</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 flex items-start gap-2 text-sm">
            <Terminal size={14} className="text-blue-500 mt-0.5 shrink-0" />
            <p className="text-blue-700">After creating a key, use it with <code className="font-mono bg-white/70 px-1 rounded text-xs">flat-manager-client push --token &lt;key&gt; https://admin.agl-store.cyou/api/v1 stable repo/</code></p>
          </div>

          {createdKey && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 text-sm font-semibold mb-2">New key created: {createdKey.name}</p>
              <p className="text-green-700 text-xs mb-2">This token is shown only once. Copy it now.</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-white border border-green-200 rounded px-3 py-1.5 text-xs font-mono break-all">{createdKey.token}</code>
                <button
                  onClick={() => handleCopy(createdKey.token)}
                  className="p-2 rounded-lg border border-green-200 text-green-700 hover:bg-green-100"
                >
                  {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                </button>
              </div>
              <button onClick={() => setCreatedKey(null)} className="text-xs text-green-600 hover:underline mt-2">Dismiss</button>
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={newKeyName}
              onChange={e => setNewKeyName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreateKey()}
              placeholder="Key name (e.g. CI/CD)"
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleCreateKey}
              disabled={keyCreateLoading || !newKeyName.trim()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1.5 transition-colors"
            >
              <Plus size={14} />
              Create
            </button>
          </div>

          {keysLoading ? (
            <LoadingPulse rows={3} />
          ) : keys.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No API keys yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Prefix</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Created</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Last Used</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {keys.map(k => (
                  <tr key={k.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-medium text-gray-800">{k.name}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-gray-500">{k.prefix}…</td>
                    <td className="px-4 py-2.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${k.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {k.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-gray-500">{fmtDate(k.created_at)}</td>
                    <td className="px-4 py-2.5 text-gray-500">{fmtDate(k.last_used_at)}</td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        onClick={() => handleRevokeKey(k.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Revoke key"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Publisher Signing Key / Trust Request */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2"><ShieldCheck size={18} /> Publisher Signing Key</h2>
        </div>
        <div className="p-6">
          {user.is_trusted_publisher ? (
            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-sm">
              <ShieldCheck size={16} /> You are a Trusted Publisher. Your apps carry the Verified badge and a personal signing key.
            </div>
          ) : trustRequestStatus === 'pending' ? (
            <div className="flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm">
              <Send size={15} /> Your request is under review. An admin will respond soon.
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Trusted Publishers get a personal GPG signing key, a Verified badge on all apps, and a 1-year listing instead of 1 day.
                Submit a request below — an admin will review it.
              </p>
              {trustMsg && (
                <div className={`rounded-lg px-4 py-3 text-sm ${trustMsg.type === 'ok' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                  {trustMsg.text}
                </div>
              )}
              {!trustFormOpen ? (
                <button
                  onClick={() => setTrustFormOpen(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  <Send size={14} /> Request Trusted Publisher Status
                </button>
              ) : (
                <div className="space-y-3 border border-gray-200 rounded-xl p-5 bg-gray-50">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Why should you be a Trusted Publisher? <span className="text-red-500">*</span></label>
                    <textarea
                      value={trustForm.reason}
                      onChange={e => setTrustForm(p => ({ ...p, reason: e.target.value }))}
                      placeholder="Describe your project, experience, and how you'll use the store (e.g. I am a student at PENS building open-source tools for AGL, my apps are actively maintained...)"
                      rows={4}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none bg-white"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1"><Github size={12} /> GitHub Profile URL</label>
                      <input
                        value={trustForm.github}
                        onChange={e => setTrustForm(p => ({ ...p, github: e.target.value }))}
                        placeholder="https://github.com/yourusername"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Portfolio / Website</label>
                      <input
                        value={trustForm.portfolio}
                        onChange={e => setTrustForm(p => ({ ...p, portfolio: e.target.value }))}
                        placeholder="https://yoursite.com"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleTrustSubmit}
                      disabled={trustSubmitting || !trustForm.reason.trim()}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                    >
                      <Send size={14} /> {trustSubmitting ? 'Submitting…' : 'Submit Request'}
                    </button>
                    <button
                      onClick={() => { setTrustFormOpen(false); setTrustMsg(null) }}
                      className="px-4 py-2 bg-white border border-gray-300 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Submit App */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2"><Package size={18} /> Submit App</h2>
        </div>
        <div className="p-6 space-y-5">
          {submitSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm flex items-center gap-2">
              <CheckCircle size={16} /> App submitted successfully! It's now pending review.
            </div>
          )}
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">{submitError}</div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">App ID <span className="text-red-500">*</span></label>
              <input
                value={submitForm.app_id}
                onChange={e => setSubmitForm(p => ({ ...p, app_id: e.target.value }))}
                placeholder="com.example.MyApp"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Name <span className="text-red-500">*</span></label>
              <input
                value={submitForm.name}
                onChange={e => setSubmitForm(p => ({ ...p, name: e.target.value }))}
                placeholder="My App"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">App Type <span className="text-red-500">*</span></label>
              <select
                value={submitForm.app_type}
                onChange={e => setSubmitForm(p => ({ ...p, app_type: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="desktop">Desktop</option>
                <option value="mobile">Mobile</option>
                <option value="web">Web</option>
                <option value="console">Console</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">License</label>
              <input
                value={submitForm.license}
                onChange={e => setSubmitForm(p => ({ ...p, license: e.target.value }))}
                placeholder="MIT, GPL-3.0, etc."
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Icon URL</label>
              <input
                value={submitForm.icon}
                onChange={e => setSubmitForm(p => ({ ...p, icon: e.target.value }))}
                placeholder="https://example.com/icon.png"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Homepage</label>
              <input
                value={submitForm.homepage}
                onChange={e => setSubmitForm(p => ({ ...p, homepage: e.target.value }))}
                placeholder="https://example.com"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Summary</label>
            <input
              value={submitForm.summary}
              onChange={e => setSubmitForm(p => ({ ...p, summary: e.target.value }))}
              placeholder="Short description of your app"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
            <textarea
              value={submitForm.description}
              onChange={e => setSubmitForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Full description of your app…"
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {categories.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">Categories</label>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => toggleCategory(cat.name)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      submitForm.categories.includes(cat.name)
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">Screenshots</label>
            <div className="flex gap-2 mb-2">
              <input
                value={screenshotUrl}
                onChange={e => setScreenshotUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addScreenshot()}
                placeholder="https://example.com/screenshot.png"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={addScreenshot}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 flex items-center gap-1"
              >
                <Plus size={14} /> Add
              </button>
            </div>
            {submitForm.screenshots.length > 0 && (
              <ul className="space-y-1">
                {submitForm.screenshots.map((ss, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="flex-1 truncate font-mono bg-gray-50 px-2 py-1 rounded border border-gray-200">{ss.url}</span>
                    <button
                      onClick={() => setSubmitForm(p => ({ ...p, screenshots: p.screenshots.filter((_, j) => j !== i) }))}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 size={12} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            onClick={handleSubmitApp}
            disabled={submitLoading || !submitForm.app_id || !submitForm.name}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {submitLoading ? 'Submitting…' : 'Submit App for Review'}
          </button>
        </div>
      </section>

      {/* My Submissions */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2"><FileText size={18} /> My Submissions</h2>
        </div>
        <div className="p-6">
          {mySubsLoading ? (
            <LoadingPulse rows={3} />
          ) : mySubs.length === 0 ? (
            <EmptyState
              icon={<Package size={36} />}
              title="No submissions yet"
              desc="Submit your first app above."
            />
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">App Name</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Submitted</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mySubs.map(sub => (
                  <tr key={sub.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{sub.name}</td>
                    <td className="px-4 py-3"><StatusBadge status={sub.status} /></td>
                    <td className="px-4 py-3 text-gray-500">{fmtDate(sub.submitted_at)}</td>
                    <td className="px-4 py-3 text-right">
                      {sub.status === 'rejected' && (
                        <span className="text-xs text-red-600 mr-3">
                          {sub.rejection_reason ? `Reason: ${sub.rejection_reason}` : 'Rejected'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  )
}

// ── Ratings & Reviews Page ────────────────────────────────────────────────────

export const RatingsReviewsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Ratings & Reviews</h1>
        <p className="text-gray-500 text-sm">App ratings and user reviews.</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-16 flex flex-col items-center justify-center text-center">
        <Star size={56} className="text-gray-200 mb-5" strokeWidth={1.5} />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">App Ratings Coming Soon</h2>
        <p className="text-gray-400 text-sm max-w-sm">
          User ratings and review management will be available in a future release.
        </p>
      </div>
    </div>
  )
}

// ── Settings Page ─────────────────────────────────────────────────────────────

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate()
  const { user: storedUser, setUser: setStoredUser, logout } = useAuthStore()
  const [user, setUser] = useState<AuthUser | null>(storedUser)
  const [loading, setLoading] = useState(!storedUser)
  const [roleInput, setRoleInput] = useState(storedUser?.role ?? '')
  const [roleLoading, setRoleLoading] = useState(false)
  const [roleSuccess, setRoleSuccess] = useState(false)

  useEffect(() => {
    if (!storedUser) {
      getAuthUser()
        .then(u => { setUser(u); setStoredUser(u); setRoleInput(u.role) })
        .catch(() => setUser(null))
        .finally(() => setLoading(false))
    }
  }, [])

  function handleLogout() {
    logout()
    navigate('/')
  }

  async function handleRoleChange() {
    if (!user) return
    setRoleLoading(true)
    try {
      await updateUserRole(user.id, roleInput)
      setUser(prev => prev ? { ...prev, role: roleInput } : prev)
      setRoleSuccess(true)
      setTimeout(() => setRoleSuccess(false), 3000)
    } catch { /* ignore */ }
    finally { setRoleLoading(false) }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Settings</h1>
        <p className="text-gray-500 text-sm">Account and preferences.</p>
      </div>

      {loading ? (
        <LoadingPulse rows={4} />
      ) : !user ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <p className="text-gray-500 text-sm mb-4">You are not signed in.</p>
          <Link to="/login" className="text-indigo-600 hover:underline text-sm font-medium">Sign in</Link>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Profile</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Display name</dt>
                <dd className="font-medium text-gray-800">{user.display_name}</dd>
              </div>
              {user.email && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Email</dt>
                  <dd className="font-medium text-gray-800">{user.email}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-gray-500">Role</dt>
                <dd>
                  <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-medium capitalize">{user.role}</span>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">GitHub login</dt>
                <dd className="font-medium text-gray-800">{user.default_account_login}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Publisher agreement</dt>
                <dd>{user.accepted_publisher_agreement ? <CheckCircle size={16} className="text-green-500" /> : <XCircle size={16} className="text-gray-300" />}</dd>
              </div>
            </dl>
          </div>

          {user.role === 'admin' && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Change Role</h2>
              {roleSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-700 text-sm mb-4 flex items-center gap-2">
                  <CheckCircle size={14} /> Role updated.
                </div>
              )}
              <div className="flex gap-3">
                <select
                  value={roleInput}
                  onChange={e => setRoleInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="admin">admin</option>
                  <option value="developer">developer</option>
                  <option value="user">user</option>
                </select>
                <button
                  onClick={handleRoleChange}
                  disabled={roleLoading || roleInput === user.role}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {roleLoading ? 'Saving…' : 'Update'}
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Session</h2>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ── Reset Password Page (kept for compatibility) ──────────────────────────────

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'idle'>('idle')
  const [message, setMessage] = useState('')
  const [resendEmailVal, setResendEmailVal] = useState('')
  const [resending, setResending] = useState(false)
  const [resendMsg, setResendMsg] = useState('')

  useEffect(() => {
    if (token) {
      setStatus('loading')
      verifyEmail(token)
        .then(res => { setStatus('success'); setMessage(res.message) })
        .catch(e => { setStatus('error'); setMessage(e.message) })
    }
  }, [token])

  async function handleResend() {
    if (!resendEmailVal.trim()) return
    setResending(true)
    try {
      await resendVerification(resendEmailVal.trim())
      setResendMsg('Verification email sent!')
    } catch (e) { setResendMsg(e instanceof Error ? e.message : 'Failed') }
    finally { setResending(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 w-full max-w-md text-center">
        {status === 'loading' && (<><RefreshCw size={32} className="animate-spin text-indigo-500 mx-auto mb-4" /><p className="text-gray-600">Verifying your email…</p></>)}
        {status === 'success' && (
          <>
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Email Verified!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <button onClick={() => navigate('/login')} className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">Sign In</button>
          </>
        )}
        {(status === 'error' || (status === 'idle' && !token)) && (
          <>
            {status === 'error' && <><div className="text-4xl mb-4">❌</div><h2 className="text-xl font-bold text-gray-900 mb-2">Verification Failed</h2><p className="text-red-600 text-sm mb-4">{message}</p></>}
            {status === 'idle' && <><div className="text-4xl mb-4">📧</div><h2 className="text-xl font-bold text-gray-900 mb-2">Verify Your Email</h2><p className="text-gray-600 mb-4">Enter your email to resend the verification link.</p></>}
            <div className="space-y-2">
              <input type="email" value={resendEmailVal} onChange={e => setResendEmailVal(e.target.value)} placeholder="you@example.com" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <button onClick={handleResend} disabled={resending || !resendEmailVal.trim()} className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
                {resending ? 'Sending…' : 'Resend Verification'}
              </button>
              {resendMsg && <p className="text-sm text-green-600">{resendMsg}</p>}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [trustingId, setTrustingId] = useState<number | null>(null)

  useEffect(() => {
    listUsers().then(setUsers).catch(e => setError(e.message)).finally(() => setLoading(false))
  }, [])

  async function handleTrust(userId: number) {
    setTrustingId(userId)
    try {
      await trustPublisher(userId)
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_trusted_publisher: true } : u))
    } catch (e) { alert(e instanceof Error ? e.message : 'Failed') }
    finally { setTrustingId(null) }
  }

  async function handleUntrust(userId: number) {
    setTrustingId(userId)
    try {
      await untrustPublisher(userId)
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_trusted_publisher: false } : u))
    } catch (e) { alert(e instanceof Error ? e.message : 'Failed') }
    finally { setTrustingId(null) }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><RefreshCw size={24} className="animate-spin text-gray-400" /></div>
  if (error) return <div className="text-red-600 p-4">{error}</div>

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-500 text-sm mt-1">{users.length} registered users</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Apps</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Publisher</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900 text-sm">{user.display_name}</div>
                  <div className="text-xs text-gray-400">#{user.id} · {user.auth_provider || 'github'}</div>
                </td>
                <td className="px-4 py-3">
                  {user.email ? (
                    <div>
                      <div className="text-sm text-gray-700 flex items-center gap-1">
                        {user.email}
                        {user.email_verified
                          ? <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">verified</span>
                          : <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-700">unverified</span>}
                      </div>
                      {user.is_organization_email && <div className="text-xs text-indigo-600 mt-0.5">🏢 {user.organization_domain}</div>}
                    </div>
                  ) : <span className="text-xs text-gray-400">—</span>}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${user.role === 'admin' ? 'bg-red-100 text-red-700' : user.role === 'publisher' ? 'bg-blue-100 text-blue-700' : user.role === 'reviewer' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>{user.role || 'user'}</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{user.app_count ?? 0}</td>
                <td className="px-4 py-3">
                  {user.is_trusted_publisher ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-700">✓ Trusted</span>
                  ) : user.trust_request_status === 'pending' ? (
                    <div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700">Requested</span>
                      {user.trust_request_reason && (
                        <p className="text-xs text-gray-500 mt-1 max-w-xs truncate" title={user.trust_request_reason}>{user.trust_request_reason}</p>
                      )}
                      {user.trust_request_github && (
                        <a href={user.trust_request_github} target="_blank" rel="noreferrer" className="text-xs text-indigo-500 hover:underline block mt-0.5 truncate max-w-xs">{user.trust_request_github}</a>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {user.is_trusted_publisher
                    ? <button onClick={() => handleUntrust(user.id)} disabled={trustingId === user.id} className="text-xs px-3 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors">{trustingId === user.id ? '…' : 'Revoke Trust'}</button>
                    : <button onClick={() => handleTrust(user.id)} disabled={trustingId === user.id} className={`text-xs px-3 py-1 rounded-lg border disabled:opacity-50 transition-colors ${user.trust_request_status === 'pending' ? 'border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100 font-semibold' : 'border-indigo-200 text-indigo-600 hover:bg-indigo-50'}`}>{trustingId === user.id ? '…' : user.trust_request_status === 'pending' ? '⚡ Approve Request' : 'Trust Publisher'}</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <div className="text-center py-12 text-gray-400">No users found.</div>}
      </div>
    </div>
  )
}

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleReset() {
    if (!password.trim()) return
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (!token) { setError('Invalid reset link'); return }
    setLoading(true); setError(null)
    try {
      await resetPasswordApi(token, password)
      setSuccess(true)
    } catch (e) { setError(e instanceof Error ? e.message : 'Reset failed') }
    finally { setLoading(false) }
  }

  if (!token) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 w-full max-w-md text-center">
        <div className="text-4xl mb-4">❌</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Invalid Link</h2>
        <p className="text-gray-600 mb-4">This password reset link is invalid or has expired.</p>
        <Link to="/login" className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">Back to Login</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 w-full max-w-md">
        {success ? (
          <div className="text-center">
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Password Reset!</h2>
            <p className="text-gray-600 mb-6">Your password has been updated successfully.</p>
            <button onClick={() => navigate('/login')} className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">Sign In</button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Set New Password</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleReset()} placeholder="••••••••" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>}
              <button onClick={handleReset} disabled={loading || !password.trim()} className="w-full bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                {loading ? <RefreshCw size={16} className="animate-spin" /> : null}
                {loading ? 'Resetting…' : 'Reset Password'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── Developer Guide Page ───────────────────────────────────────────────────────

export const DeveloperGuidePage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          <FileText className="text-blue-600" size={22} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Developer Guide</h1>
          <p className="text-sm text-gray-500 mt-0.5">Everything you need to publish apps on PensHub</p>
        </div>
      </div>

      {/* Section 1: Quick Start */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">1</span>
          Quick Start
        </h2>
        <ol className="space-y-3">
          {[
            <>Register on <a href="https://admin.agl-store.cyou/developer/portal" className="text-blue-600 hover:underline font-medium">admin.agl-store.cyou/developer/portal</a></>,
            'Agree to the developer agreement',
            'Create an API key',
            'Build your flatpak (see below)',
            'Submit via the portal or API',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
              <span className="text-gray-700 text-sm">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Section 2: Building a Flatpak */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">2</span>
          Building a Flatpak
        </h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2 font-medium">Install flatpak-builder</p>
            <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs overflow-x-auto"><code>sudo apt install flatpak-builder</code></pre>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2 font-medium">Create manifest: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">com.yourcompany.AppName.json</code></p>
            <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs overflow-x-auto"><code>{`{
  "app-id": "com.yourcompany.AppName",
  "runtime": "org.freedesktop.Platform",
  "runtime-version": "23.08",
  "sdk": "org.freedesktop.Sdk",
  "command": "your-app",
  "finish-args": ["--share=ipc", "--socket=x11"],
  "modules": [...]
}`}</code></pre>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2 font-medium">Build &amp; export to bundle</p>
            <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs overflow-x-auto"><code>{`# Build
flatpak-builder --force-clean build-dir com.yourcompany.AppName.json

# Export to bundle
flatpak build-export repo build-dir
flatpak build-bundle repo com.yourcompany.AppName.flatpak com.yourcompany.AppName`}</code></pre>
          </div>
        </div>
      </section>

      {/* Section 3: App ID Rules */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">3</span>
          App ID Rules
        </h2>
        <ul className="space-y-2.5">
          <li className="flex items-start gap-2 text-sm text-gray-700">
            <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
            Must be reverse-domain notation: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono ml-1">com.company.AppName</code>
          </li>
          <li className="flex items-start gap-2 text-sm text-gray-700">
            <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
            No spaces — use CamelCase for the last segment
          </li>
          <li className="flex items-start gap-2 text-sm text-gray-700">
            <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
            <span>Example: <code className="bg-green-50 border border-green-200 px-1.5 py-0.5 rounded text-xs font-mono text-green-800">com.pens.AsciiArt</code> ✓ &nbsp; <code className="bg-red-50 border border-red-200 px-1.5 py-0.5 rounded text-xs font-mono text-red-800">com.pens.ascii art</code> ✗</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-gray-700">
            <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
            Must be globally unique
          </li>
        </ul>
      </section>

      {/* Section 4: Common Errors & Solutions */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">4</span>
          Common Errors &amp; Solutions
        </h2>
        <div className="space-y-4">
          {/* Error 1 */}
          <div className="border border-red-200 rounded-lg overflow-hidden">
            <div className="bg-red-50 px-4 py-2.5 flex items-center gap-2">
              <XCircle size={16} className="text-red-600 shrink-0" />
              <span className="text-sm font-semibold text-red-800">"Commit metadata not matching expected metadata"</span>
            </div>
            <div className="p-4 space-y-1.5 text-sm text-gray-700">
              <p><span className="font-medium text-gray-900">Cause:</span> App was built without proper <code className="bg-gray-100 px-1 rounded text-xs font-mono">flatpak build-finish</code> step, or metadata file is missing.</p>
              <p><span className="font-medium text-gray-900">Fix:</span> Ensure <code className="bg-gray-100 px-1 rounded text-xs font-mono">flatpak build-finish</code> is called before export. Re-submit the app.</p>
              <p><span className="font-medium text-gray-900">Prevention:</span> Always use <code className="bg-gray-100 px-1 rounded text-xs font-mono">flatpak-builder</code> (not raw ostree) — it sets <code className="bg-gray-100 px-1 rounded text-xs font-mono">xa.metadata</code> automatically.</p>
            </div>
          </div>

          {/* Error 2 */}
          <div className="border border-red-200 rounded-lg overflow-hidden">
            <div className="bg-red-50 px-4 py-2.5 flex items-center gap-2">
              <XCircle size={16} className="text-red-600 shrink-0" />
              <span className="text-sm font-semibold text-red-800">"No remote refs found for 'penshub'"</span>
            </div>
            <div className="p-4 space-y-1.5 text-sm text-gray-700">
              <p><span className="font-medium text-gray-900">Cause:</span> PensHub remote not added on the device.</p>
              <p><span className="font-medium text-gray-900">Fix:</span></p>
              <pre className="bg-gray-900 text-gray-100 rounded-lg p-3 text-xs overflow-x-auto"><code>flatpak remote-add --user --gpg-import=penshub.gpg penshub https://repo.agl-store.cyou</code></pre>
            </div>
          </div>

          {/* Error 3 */}
          <div className="border border-amber-200 rounded-lg overflow-hidden">
            <div className="bg-amber-50 px-4 py-2.5 flex items-center gap-2">
              <XCircle size={16} className="text-amber-600 shrink-0" />
              <span className="text-sm font-semibold text-amber-800">"SSL certificate error"</span>
            </div>
            <div className="p-4 space-y-1.5 text-sm text-gray-700">
              <p><span className="font-medium text-gray-900">Cause:</span> Outdated CA bundle on device.</p>
              <p><span className="font-medium text-gray-900">Fix:</span></p>
              <pre className="bg-gray-900 text-gray-100 rounded-lg p-3 text-xs overflow-x-auto"><code>sudo update-ca-certificates</code></pre>
            </div>
          </div>

          {/* Error 4 */}
          <div className="border border-amber-200 rounded-lg overflow-hidden">
            <div className="bg-amber-50 px-4 py-2.5 flex items-center gap-2">
              <XCircle size={16} className="text-amber-600 shrink-0" />
              <span className="text-sm font-semibold text-amber-800">"Unable to load summary"</span>
            </div>
            <div className="p-4 space-y-1.5 text-sm text-gray-700">
              <p><span className="font-medium text-gray-900">Cause:</span> Stale remote cache.</p>
              <p><span className="font-medium text-gray-900">Fix:</span></p>
              <pre className="bg-gray-900 text-gray-100 rounded-lg p-3 text-xs overflow-x-auto"><code>flatpak remote-delete penshub && flatpak remote-add --user --gpg-import=penshub.gpg penshub https://repo.agl-store.cyou</code></pre>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Upload via API */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">5</span>
          Upload via API
        </h2>
        <p className="text-sm text-gray-600 mb-3">Get your API key from the developer portal, then:</p>
        <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs overflow-x-auto"><code>{`curl -X POST https://admin.agl-store.cyou/api/developer/submit \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "flatpak=@com.yourcompany.AppName.flatpak" \\
  -F "name=My App" \\
  -F "summary=Short description" \\
  -F "description=Full description" \\
  -F "category=Utility"`}</code></pre>
      </section>

      {/* Section 6: Review Process */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">6</span>
          Review Process
        </h2>
        <ul className="space-y-3">
          {[
            'Submission reviewed within 3–5 business days',
            'Automated security scan (ClamAV + Trivy CVE + checksec ELF)',
            'Manual review by PENS team',
            'Approved apps live within 24h of approval',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

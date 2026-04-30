import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthUser, AppSubmission, AdminStats } from './types'

// ── Auth Store ────────────────────────────────────────────────────────────────

interface AuthState {
  token: string | null
  user: AuthUser | null
  setToken: (token: string) => void
  setUser: (user: AuthUser) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'agl-auth',
      partialize: (s) => ({ token: s.token }),
    }
  )
)

// ── Submissions Store ─────────────────────────────────────────────────────────

type SubmissionFilter = 'all' | 'pending' | 'approved' | 'rejected' | 'revoked'

interface SubmissionsState {
  submissions: AppSubmission[]
  filter: SubmissionFilter
  loading: boolean
  error: string | null
  setSubmissions: (submissions: AppSubmission[]) => void
  setFilter: (filter: SubmissionFilter) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  updateSubmission: (id: number, patch: Partial<AppSubmission>) => void
}

export const useSubmissionsStore = create<SubmissionsState>()((set) => ({
  submissions: [],
  filter: 'all',
  loading: false,
  error: null,
  setSubmissions: (submissions) => set({ submissions }),
  setFilter: (filter) => set({ filter }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  updateSubmission: (id, patch) =>
    set((s) => ({
      submissions: s.submissions.map((sub) =>
        sub.id === id ? { ...sub, ...patch } : sub
      ),
    })),
}))

// ── Admin Stats Store ─────────────────────────────────────────────────────────

interface StatsState {
  stats: AdminStats | null
  loading: boolean
  setStats: (stats: AdminStats) => void
  setLoading: (loading: boolean) => void
}

export const useStatsStore = create<StatsState>()((set) => ({
  stats: null,
  loading: false,
  setStats: (stats) => set({ stats }),
  setLoading: (loading) => set({ loading }),
}))

// ── Scan Store ────────────────────────────────────────────────────────────────

interface ScanFinding {
  severity: string
  category: string
  message: string
  detail: string
}

interface ScanResult {
  verdict: string
  risk_score: number
  summary: string
  findings: ScanFinding[]
  scanned_at: string
}

interface ScanState {
  results: Record<number, ScanResult>  // keyed by submission_id
  scanning: Record<number, boolean>
  setResult: (submissionId: number, result: ScanResult) => void
  setScanning: (submissionId: number, scanning: boolean) => void
  getResult: (submissionId: number) => ScanResult | null
}

export const useScanStore = create<ScanState>()((set, get) => ({
  results: {},
  scanning: {},
  setResult: (submissionId, result) =>
    set((s) => ({ results: { ...s.results, [submissionId]: result } })),
  setScanning: (submissionId, scanning) =>
    set((s) => ({ scanning: { ...s.scanning, [submissionId]: scanning } })),
  getResult: (submissionId) => get().results[submissionId] ?? null,
}))

// ── UI Store ──────────────────────────────────────────────────────────────────

interface UIState {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}))

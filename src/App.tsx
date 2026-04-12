import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import AdminTopNavLayout from "../components/AdminTopNavLayout"
import ReviewQueueLayout from "../components/ReviewQueueLayout"
import {
  LandingPage,
  LoginPage,
  SettingsPage,
  AdminDashboardPage,
  SubmissionsListPage,
  SubmissionDetailsPage,
  AnalyticsPage,
  SystemHealthPage,
  ReviewHistoryPage,
  ReviewQueuePage,
  RatingsReviewsPage,
  DeveloperPortalPage,
  DeveloperGuidePage,
  ResetPasswordPage,
  VerifyEmailPage,
  UsersPage,
  AdminDeveloperProfilePage,
} from "../components/pages"
import { useAuthStore } from "../lib/stores"
import { getAuthUser } from "../lib/api"

// ── Auth Guards ───────────────────────────────────────────────────────────────

function AuthLoader({ children }: { children: React.ReactNode }) {
  const { token, user, setUser } = useAuthStore()
  const [checking, setChecking] = useState(!user && !!token)

  useEffect(() => {
    if (!user && token) {
      getAuthUser()
        .then(setUser)
        .catch(() => {})
        .finally(() => setChecking(false))
    }
  }, [token])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-400 text-sm animate-pulse">Loading…</div>
      </div>
    )
  }
  return <>{children}</>
}

/** Requires any logged-in user. Redirects to /login?next=<path> if not. */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore()
  const location = useLocation()
  if (!token) {
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />
  }
  return <>{children}</>
}

/** Requires role === "admin". Non-admins are sent to developer portal. */
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { token, user } = useAuthStore()
  const location = useLocation()
  if (!token) {
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />
  }
  // If user loaded and not admin — redirect to dev portal
  if (user && user.role !== "admin") {
    return <Navigate to="/developer/portal" replace />
  }
  return <>{children}</>
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <BrowserRouter>
      <AuthLoader>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />

          {/* Admin section — requires admin role */}
          <Route path="/admin/dashboard" element={<AdminRoute><AdminTopNavLayout><AdminDashboardPage /></AdminTopNavLayout></AdminRoute>} />
          <Route path="/admin/submissions" element={<AdminRoute><AdminTopNavLayout><SubmissionsListPage /></AdminTopNavLayout></AdminRoute>} />
          <Route path="/admin/submissions/:id" element={<AdminRoute><AdminTopNavLayout><SubmissionDetailsPage /></AdminTopNavLayout></AdminRoute>} />
          <Route path="/admin/analytics" element={<AdminRoute><AdminTopNavLayout><AnalyticsPage /></AdminTopNavLayout></AdminRoute>} />
          <Route path="/admin/system-health" element={<AdminRoute><AdminTopNavLayout><SystemHealthPage /></AdminTopNavLayout></AdminRoute>} />
          <Route path="/admin/review-history" element={<AdminRoute><AdminTopNavLayout><ReviewHistoryPage /></AdminTopNavLayout></AdminRoute>} />
          <Route path="/admin/ratings" element={<AdminRoute><AdminTopNavLayout><RatingsReviewsPage /></AdminTopNavLayout></AdminRoute>} />
          <Route path="/admin/settings" element={<AdminRoute><AdminTopNavLayout><SettingsPage /></AdminTopNavLayout></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminTopNavLayout><UsersPage /></AdminTopNavLayout></AdminRoute>} />
          <Route path="/admin/users/:id" element={<AdminRoute><AdminTopNavLayout><AdminDeveloperProfilePage /></AdminTopNavLayout></AdminRoute>} />

          {/* Developer section — requires any login */}
          <Route path="/developer/portal" element={<ProtectedRoute><AdminTopNavLayout title="Developer Portal"><DeveloperPortalPage /></AdminTopNavLayout></ProtectedRoute>} />
          <Route path="/developer/guide" element={<ProtectedRoute><AdminTopNavLayout title="Developer Guide"><DeveloperGuidePage /></AdminTopNavLayout></ProtectedRoute>} />

          {/* Review queue — admin only */}
          <Route path="/review-queue" element={<AdminRoute><ReviewQueueLayout><ReviewQueuePage /></ReviewQueueLayout></AdminRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthLoader>
    </BrowserRouter>
  )
}

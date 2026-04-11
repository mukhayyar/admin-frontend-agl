import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminTopNavLayout from '../components/AdminTopNavLayout'
import ReviewQueueLayout from '../components/ReviewQueueLayout'
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
  ResetPasswordPage,
  VerifyEmailPage,
  UsersPage,
} from '../components/pages'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* Admin section */}
        <Route path="/admin/dashboard" element={<AdminTopNavLayout><AdminDashboardPage /></AdminTopNavLayout>} />
        <Route path="/admin/submissions" element={<AdminTopNavLayout><SubmissionsListPage /></AdminTopNavLayout>} />
        <Route path="/admin/submissions/:id" element={<AdminTopNavLayout><SubmissionDetailsPage /></AdminTopNavLayout>} />
        <Route path="/admin/analytics" element={<AdminTopNavLayout><AnalyticsPage /></AdminTopNavLayout>} />
        <Route path="/admin/system-health" element={<AdminTopNavLayout><SystemHealthPage /></AdminTopNavLayout>} />
        <Route path="/admin/review-history" element={<AdminTopNavLayout><ReviewHistoryPage /></AdminTopNavLayout>} />
        <Route path="/admin/ratings" element={<AdminTopNavLayout><RatingsReviewsPage /></AdminTopNavLayout>} />
        <Route path="/admin/settings" element={<AdminTopNavLayout><SettingsPage /></AdminTopNavLayout>} />
        <Route path="/admin/users" element={<AdminTopNavLayout><UsersPage /></AdminTopNavLayout>} />

        {/* Developer section */}
        <Route path="/developer/portal" element={<AdminTopNavLayout title="Developer Portal"><DeveloperPortalPage /></AdminTopNavLayout>} />

        {/* Review queue */}
        <Route path="/review-queue" element={<ReviewQueueLayout><ReviewQueuePage /></ReviewQueueLayout>} />
      </Routes>
    </BrowserRouter>
  )
}

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SidebarLayout from '../components/SidebarLayout'
import AdminTopNavLayout from '../components/AdminTopNavLayout'
import ReviewQueueLayout from '../components/ReviewQueueLayout'
import {
  LandingPage,
  LoginPage,
  SettingsPage,
  AdminDashboardPage,
  AnalyticsPage,
  SystemHealthPage,
  ReviewHistoryPage,
  ReviewQueuePage,
  RatingsReviewsPage,
  SubmissionDetailsPage,
  ResetPasswordPage,
  DeveloperPortalPage,
} from '../components/pages'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Admin section */}
        <Route path="/admin/dashboard" element={<AdminTopNavLayout><AdminDashboardPage /></AdminTopNavLayout>} />
        <Route path="/admin/analytics" element={<AdminTopNavLayout><AnalyticsPage /></AdminTopNavLayout>} />
        <Route path="/admin/system-health" element={<AdminTopNavLayout><SystemHealthPage /></AdminTopNavLayout>} />
        <Route path="/admin/review-history" element={<AdminTopNavLayout><ReviewHistoryPage /></AdminTopNavLayout>} />
        <Route path="/admin/ratings" element={<AdminTopNavLayout><RatingsReviewsPage /></AdminTopNavLayout>} />

        {/* Developer section */}
        <Route path="/developer/portal" element={<AdminTopNavLayout title="Developer Portal"><DeveloperPortalPage /></AdminTopNavLayout>} />

        {/* IVI section */}
        <Route path="/ivi/dashboard" element={<SidebarLayout><AdminDashboardPage /></SidebarLayout>} />
        <Route path="/ivi/settings" element={<SidebarLayout><SettingsPage /></SidebarLayout>} />
        <Route path="/ivi/submission/:id" element={<SidebarLayout><SubmissionDetailsPage /></SidebarLayout>} />

        {/* Review queue */}
        <Route path="/review-queue" element={<ReviewQueueLayout><ReviewQueuePage /></ReviewQueueLayout>} />
      </Routes>
    </BrowserRouter>
  )
}

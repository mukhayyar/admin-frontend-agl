import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SidebarLayout, AdminTopNavLayout, ReviewQueueLayout } from './components/Layouts';
import { 
  LandingPage, LoginPage, SettingsPage, SystemHealthPage, 
  ReviewHistoryPage, ReviewQueuePage, AdminDashboardPage, 
  AnalyticsPage, SubmissionDetailsPage, RatingsReviewsPage 
} from './pages/Pages';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Landing Page (Root) */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Login Page */}
        <Route path="/login" element={<LoginPage />} />

        {/* IVI App Store Routes (Sidebar Layout) */}
        <Route path="/ivi" element={<SidebarLayout />}>
           <Route path="dashboard" element={<div className="text-2xl font-bold text-gray-400 p-8">Dashboard Placeholder</div>} />
           <Route path="settings" element={<SettingsPage />} />
           <Route path="submission/:id" element={<SubmissionDetailsPage />} />
           {/* Fallback */}
           <Route path="*" element={<Navigate to="/ivi/dashboard" replace />} />
        </Route>

        {/* Admin Routes (Top Nav Layout) */}
        <Route path="/admin" element={<AdminTopNavLayout />}>
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="system-health" element={<SystemHealthPage />} />
            <Route path="review-history" element={<ReviewHistoryPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="ratings" element={<RatingsReviewsPage />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>

        {/* Review Queue Route (Special Top Nav Layout) */}
        <Route path="/review-queue" element={<ReviewQueueLayout />}>
             <Route index element={<ReviewQueuePage />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
export interface ReviewHistoryItem {
  id: number
  appName: string
  developer: string
  reviewer: string
  outcome: 'Approved' | 'Rejected'
  timestamp: string
  notes: string
}

export interface ReviewQueueItem {
  id: number
  appName: string
  version: string
  status: 'In Review' | 'Pending'
  submitted: string
}

export interface BackendHealthItem {
  service: string
  status: 'Healthy' | 'Unhealthy'
  updated: string
}

export interface ReviewItem {
  id: number
  app: string
  user: string
  rating: number
  comment: string
  date: string
}

export interface AuthUser {
  id: number
  display_name: string | null
  email: string | null
  role: string
  is_trusted_publisher: boolean
  auth_provider: string
  email_verified: boolean
  accepted_publisher_agreement_at: string | null
}

export interface DevKey {
  id: number
  name: string
  token?: string
  created_at: string
  last_used_at: string | null
}

export interface AppOut {
  id: string
  name: string
  summary: string | null
  description: string | null
  icon: string | null
  runtime: string | null
  developer_name: string | null
  published: boolean
  added_at: string | null
  updated_at: string | null
}

export interface AppSubmission {
  id: number
  app_id: string
  app_name: string
  status: string
  submitted_at: string
  reviewed_at: string | null
  review_notes: string | null
  flatpak_ref: string | null
  version: string | null
}

export interface AdminStats {
  total_apps: number
  total_users: number
  pending_submissions: number
  total_submissions: number
  approved_submissions: number
  rejected_submissions: number
}

export interface PlatformStats {
  total_apps: number
  total_users: number
}

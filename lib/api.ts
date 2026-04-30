import type { AppOut, AuthUser, DevKey, AppSubmission, AdminStats, PlatformStats } from './types'
import { useAuthStore } from './stores'

export const API_URL = import.meta.env.VITE_API_URL || 'https://api.agl-store.cyou'

// Token helpers — delegate to Zustand store (persisted to localStorage via zustand/middleware)
export function getToken(): string | null {
  return useAuthStore.getState().token
}

export function setToken(t: string): void {
  useAuthStore.getState().setToken(t)
}

export function clearToken(): void {
  useAuthStore.getState().logout()
}

// Base fetcher
export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  const res = await fetch(`${API_URL}${path}`, { ...options, headers })
  return res
}

async function apiFetchJson<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await apiFetch(path, options)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { detail?: string }).detail || `Request failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}

// Public endpoints
export async function getHealth(): Promise<{ status: string; service: string; version: string }> {
  return apiFetchJson('/health')
}

export async function getStats(): Promise<PlatformStats> {
  return apiFetchJson('/stats')
}

export async function listApps(params?: {
  search?: string
  category?: string
  limit?: number
  offset?: number
}): Promise<AppOut[]> {
  const qs = new URLSearchParams()
  if (params?.search) qs.set('search', params.search)
  if (params?.category) qs.set('category', params.category)
  if (params?.limit !== undefined) qs.set('limit', String(params.limit))
  if (params?.offset !== undefined) qs.set('offset', String(params.offset))
  const query = qs.toString() ? `?${qs.toString()}` : ''
  return apiFetchJson(`/apps${query}`)
}

export async function getApp(id: string): Promise<AppOut> {
  return apiFetchJson(`/apps/${id}`)
}

export async function getCategories(): Promise<{ name: string; description: string }[]> {
  return apiFetchJson('/categories')
}

// Auth
export async function loginGitHub(accessToken: string): Promise<{
  access_token: string
  token_type: string
  user_id: number
  role: string
  is_new: boolean
}> {
  return apiFetchJson('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ access_token: accessToken }),
  })
}

export async function getAuthUser(): Promise<AuthUser> {
  return apiFetchJson('/auth/user')
}

export async function acceptPublisherAgreement(): Promise<void> {
  await apiFetchJson('/auth/accept-publisher-agreement', { method: 'POST' })
}

// Developer key endpoints
export async function createDevKey(name: string): Promise<{
  id: number
  name: string
  token: string
  prefix: string
  created_at: string
}> {
  return apiFetchJson('/developer/keys', {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
}

export async function listDevKeys(): Promise<DevKey[]> {
  return apiFetchJson('/developer/keys')
}

export async function revokeDevKey(id: number): Promise<void> {
  const res = await apiFetch(`/developer/keys/${id}`, { method: 'DELETE' })
  if (!res.ok && res.status !== 204) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { detail?: string }).detail || `Failed to revoke key: ${res.status}`)
  }
}

// Developer submission endpoints
export async function submitApp(body: {
  app_id: string
  name: string
  summary?: string
  description?: string
  icon?: string
  homepage?: string
  license?: string
  app_type: string
  categories: string[]
  screenshots: { url: string; caption?: string }[]
}): Promise<AppSubmission & { upload_token: string }> {
  return apiFetchJson('/developer/submit', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function listMySubmissions(): Promise<AppSubmission[]> {
  return apiFetchJson('/developer/submissions')
}

export async function updateSubmission(
  id: number,
  body: Partial<{
    name: string
    summary: string
    description: string
    icon: string
    homepage: string
    license: string
    app_type: string
    categories: string[]
    tags: string[]
    screenshots: { url: string; caption?: string }[]
  }>
): Promise<AppSubmission> {
  return apiFetchJson(`/developer/submissions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

// Admin endpoints
export async function getAdminStats(): Promise<AdminStats> {
  return apiFetchJson('/admin/stats')
}

export async function listAdminSubmissions(status?: string): Promise<AppSubmission[]> {
  const qs = status ? `?status=${status}` : ''
  return apiFetchJson(`/admin/submissions${qs}`)
}

export async function getAdminSubmission(id: number): Promise<AppSubmission> {
  return apiFetchJson(`/admin/submissions/${id}`)
}

export async function approveSubmission(id: number): Promise<void> {
  await apiFetchJson(`/admin/submissions/${id}/approve`, { method: 'POST' })
}

export async function rejectSubmission(id: number, reason: string): Promise<void> {
  await apiFetchJson(`/admin/submissions/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  })
}

export async function updateUserRole(userId: number, role: string): Promise<void> {
  await apiFetchJson(`/admin/users/${userId}/role`, {
    method: 'PUT',
    body: JSON.stringify({ role }),
  })
}

// ── Email Auth endpoints ───────────────────────────────────────────────────

export async function checkEmail(email: string): Promise<{
  email: string; is_organization_email: boolean; organization_domain: string | null; account_type: string
}> {
  const res = await fetch(`${API_URL}/auth/check-email?email=${encodeURIComponent(email)}`)
  if (!res.ok) throw new Error('Failed to check email')
  return res.json()
}

export async function registerEmail(email: string, password: string, display_name: string): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, display_name }),
  })
  if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error((err as { detail?: string }).detail || 'Registration failed') }
  return res.json()
}

export async function loginEmail(email: string, password: string): Promise<{ access_token: string; role: string; user_id: number }> {
  const res = await fetch(`${API_URL}/auth/login/email`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error((err as { detail?: string }).detail || 'Login failed') }
  return res.json()
}

export async function verifyEmail(token: string): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/auth/verify-email`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  })
  if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error((err as { detail?: string }).detail || 'Verification failed') }
  return res.json()
}

export async function resendVerification(email: string): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/auth/resend-verification`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  if (!res.ok) throw new Error('Failed to resend')
  return res.json()
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/auth/forgot-password`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

export async function resetPasswordApi(token: string, new_password: string): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/auth/reset-password`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, new_password }),
  })
  if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error((err as { detail?: string }).detail || 'Reset failed') }
  return res.json()
}

export async function listUsers(): Promise<{
  id: number; display_name: string; role: string; email: string | null;
  email_verified: boolean; is_organization_email: boolean; organization_domain: string | null;
  auth_provider: string; is_trusted_publisher: boolean; app_count: number
}[]> {
  return apiFetchJson('/admin/users')
}

export async function trustPublisher(userId: number): Promise<void> {
  await apiFetchJson(`/admin/users/${userId}/trust`, { method: 'POST' })
}

export async function untrustPublisher(userId: number): Promise<void> {
  await apiFetchJson(`/admin/users/${userId}/untrust`, { method: 'POST' })
}

export async function requestTrustedPublisher(reason: string, github_url?: string, portfolio_url?: string) {
  return apiFetchJson('/auth/request-trusted-publisher', {
    method: 'POST',
    body: JSON.stringify({ reason, github_url, portfolio_url }),
  })
}

export async function getMyTrustRequest() {
  return apiFetchJson('/auth/my-trust-request')
}

export async function getSubmissionComments(subId: number) {
  return apiFetchJson<{ id: number; body: string; created_at: string; author: string; role: string }[]>(`/submissions/${subId}/comments`)
}

export async function addSubmissionComment(subId: number, body: string) {
  return apiFetchJson<{ ok: boolean }>(`/submissions/${subId}/comments`, {
    method: "POST",
    body: JSON.stringify({ body }),
  })
}

export async function appealSubmission(subId: number, message: string) {
  return apiFetchJson<{ ok: boolean }>(`/developer/submissions/${subId}/appeal`, {
    method: "POST",
    body: JSON.stringify({ message }),
  })
}

export async function getMySubmission(subId: number) {
  return apiFetchJson<any>(`/developer/submissions/${subId}`)
}

export interface ScanFinding {
  severity: string
  category: string
  message: string
  detail: string
}

export interface ScanResult {
  verdict: string
  risk_score: number
  summary: string
  findings: ScanFinding[]
  scanned_at?: string
  submission_id?: number
}

export async function triggerScan(submissionId: number): Promise<ScanResult> {
  return apiFetchJson<ScanResult>(`/admin/scan/submission/${submissionId}`, { method: "POST" })
}

export async function getScanResult(submissionId: number): Promise<ScanResult> {
  return apiFetchJson<ScanResult>(`/admin/scan/submission/${submissionId}/result`)
}

export interface ScanStatus {
  status: 'idle' | 'queued' | 'running' | 'done' | 'failed'
  submission_id: number
  verdict?: string
  scan_at?: string
}

export async function getScanStatus(submissionId: number): Promise<ScanStatus> {
  return apiFetchJson<ScanStatus>(`/admin/scan/submission/${submissionId}/status`)
}

export interface AdminUserProfile {
  id: number
  display_name: string
  email: string | null
  role: string
  is_trusted_publisher: boolean
  accepted_publisher_agreement: boolean
  auth_provider: string
  email_verified: boolean
  submissions: Array<{
    id: number
    app_id: string
    name: string
    status: string
    submitted_at: string
    scan_verdict: string | null
  }>
  published_apps: Array<{
    id: string
    name: string
    summary: string | null
    icon: string | null
  }>
}

export async function getAdminUserProfile(userId: number): Promise<AdminUserProfile> {
  return apiFetchJson<AdminUserProfile>(`/admin/users/${userId}/profile`)
}

export async function revokeApp(appId: string, reason: string): Promise<{ message: string; ostree_ref_removed: boolean }> {
  return apiFetchJson(`/admin/apps/${appId}/revoke`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  })
}

// ── Developer GPG Signing Key ─────────────────────────────────────────────
export interface DevGpgKey {
  has_key: boolean
  fingerprint?: string
  uid?: string
  public_key?: string
  created_at?: string
  expires_at?: string
  days_until_expiry?: number
  is_active?: boolean
  is_trusted_publisher?: boolean
}

export async function getMyGpgKey(): Promise<DevGpgKey> {
  return apiFetchJson<DevGpgKey>('/developer/my-gpg-key')
}

export async function renewMyGpgKey(): Promise<{ message: string; fingerprint: string }> {
  return apiFetchJson('/developer/my-gpg-key/renew', { method: 'POST' })
}

// ── Connected Accounts / Profile ─────────────────────────────────────────────

export interface ConnectedAccount {
  provider: string
  login: string | null
  display_name: string | null
  avatar_url: string | null
  email: string | null
  created_at: string | null
  last_used: string | null
}

export async function getConnectedAccounts(): Promise<ConnectedAccount[]> {
  return apiFetchJson<ConnectedAccount[]>('/auth/connected-accounts')
}

/** Returns the URL to navigate to in order to start the GitHub link OAuth flow. */
export function getGithubLinkUrl(): string {
  const token = getToken()
  return `${API_URL}/auth/github/link?token=${encodeURIComponent(token ?? '')}`
}

export interface AdminAppListItem {
  id: string
  name: string
  summary: string | null
  developer_name: string | null
  icon: string | null
  type: string
  published: boolean
  is_verified: boolean
  expires_at: string | null
  added_at: string | null
  updated_at: string | null
  categories: string[]
  revoked_at: string | null
  revocation_reason: string | null
}

export async function listAdminApps(params?: {
  status?: string
  search?: string
  limit?: number
  offset?: number
}): Promise<AdminAppListItem[]> {
  const qs = new URLSearchParams()
  if (params?.status && params.status !== 'all') qs.set('status', params.status)
  if (params?.search) qs.set('search', params.search)
  if (params?.limit !== undefined) qs.set('limit', String(params.limit))
  if (params?.offset !== undefined) qs.set('offset', String(params.offset))
  const query = qs.toString() ? `?${qs.toString()}` : ''
  return apiFetchJson<AdminAppListItem[]>(`/admin/apps${query}`)
}

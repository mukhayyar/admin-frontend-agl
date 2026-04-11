const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8002'

export interface Stats {
  total_apps: number
  total_users: number
  total_categories: number
}

export interface PendingApp {
  id: string
  name: string
  developer_name: string
  type: string
  added_at: string
}

export interface TokenRequest {
  developer_name: string
  role: 'developer' | 'admin'
  app_id?: string
}

export interface TokenResponse {
  token: string
  developer_name: string
  role: string
  app_id: string | null
  flat_manager_url: string
  instructions: string
  curl_example: string
}

export async function getStats(): Promise<Stats> {
  const res = await fetch(`${API_URL}/stats`)
  if (!res.ok) throw new Error('Failed to fetch stats')
  return res.json()
}

export async function getPendingApps(apiKey: string): Promise<PendingApp[]> {
  const res = await fetch(`${API_URL}/admin/pending-apps`, {
    headers: { 'X-Api-Key': apiKey },
  })
  if (!res.ok) throw new Error('Failed to fetch pending apps')
  return res.json()
}

export async function getHealth(): Promise<{ status: string; service: string; version: string }> {
  const res = await fetch(`${API_URL}/health`)
  if (!res.ok) throw new Error('Failed to fetch health')
  return res.json()
}

export async function issueDeveloperToken(req: TokenRequest, apiKey: string): Promise<TokenResponse> {
  const res = await fetch(`${API_URL}/developer/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': apiKey,
    },
    body: JSON.stringify(req),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as any).detail || 'Failed to issue token')
  }
  return res.json()
}

export async function registerApp(appId: string, developerName: string, developerEmail?: string) {
  const res = await fetch(`${API_URL}/developer/register-app`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ app_id: appId, developer_name: developerName, developer_email: developerEmail }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as any).detail || 'Failed to register app')
  }
  return res.json()
}

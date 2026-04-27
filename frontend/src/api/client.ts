export interface DemoUser {
  id: number
  name: string
  email: string
  role: string
}

const DEMO_USER_STORAGE_KEY = 'fittracklab.demoUser'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

type RequestOptions = {
  method?: string
  body?: string
  headers?: HeadersInit
  skipDemoUserHeader?: boolean
}

export function getStoredDemoUser(): DemoUser | null {
  const value = localStorage.getItem(DEMO_USER_STORAGE_KEY)

  if (!value) {
    return null
  }

  try {
    return JSON.parse(value) as DemoUser
  } catch {
    localStorage.removeItem(DEMO_USER_STORAGE_KEY)
    return null
  }
}

export function storeDemoUser(user: DemoUser): void {
  localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(user))
}

export function clearStoredDemoUser(): void {
  localStorage.removeItem(DEMO_USER_STORAGE_KEY)
}

function getStoredDemoUserId(): string | null {
  const user = getStoredDemoUser()
  return user ? String(user.id) : null
}

async function requestJson<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')

  const storedUserId = getStoredDemoUserId()
  if (storedUserId && !options.skipDemoUserHeader && !headers.has('X-Demo-User-Id')) {
    headers.set('X-Demo-User-Id', storedUserId)
  }

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body,
  })

  if (!response.ok) {
    let detail = `Request failed with status ${response.status}`

    try {
      const errorData = (await response.json()) as { detail?: string }
      if (errorData.detail) {
        detail = errorData.detail
      }
    } catch {
      // Fall back to the default message for non-JSON errors.
    }

    throw new Error(detail)
  }

  return (await response.json()) as T
}

export function getDemoUsers(): Promise<DemoUser[]> {
  return requestJson<DemoUser[]>('/api/auth/users', { skipDemoUserHeader: true })
}

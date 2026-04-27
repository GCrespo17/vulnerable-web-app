export interface DemoUser {
  id: number
  name: string
  email: string
  role: string
}

export interface WorkoutEntry {
  id: number
  daily_log_id: number
  exercise_name: string
  sets: number
  reps: number
  duration_minutes: number
  calories_burned: number
  notes: string
}

export interface MealEntry {
  id: number
  daily_log_id: number
  meal_name: string
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  notes: string
}

export interface DailyLog {
  id: number
  user_id: number
  log_date: string
  mood: string
  weight_kg: number
  notes: string
  visibility: string
  created_at: string
}

export interface DailyLogDetail extends DailyLog {
  workouts: WorkoutEntry[]
  meals: MealEntry[]
}

export interface DailyLogCreateInput {
  log_date: string
  mood: string
  weight_kg: number
  notes: string
  visibility: string
}

export interface WorkoutCreateInput {
  exercise_name: string
  sets: number
  reps: number
  duration_minutes: number
  calories_burned: number
  notes: string
}

export interface MealCreateInput {
  meal_name: string
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  notes: string
}

export interface SearchDailyLogResult {
  id: number
  user_id: number
  log_date: string
  notes: string
  visibility: string
  created_at: string
}

export interface SearchWorkoutResult {
  id: number
  daily_log_id: number
  exercise_name: string
  notes: string
}

export interface SearchMealResult {
  id: number
  daily_log_id: number
  meal_name: string
  notes: string
}

export interface SearchResults {
  query: string
  daily_logs: SearchDailyLogResult[]
  workouts: SearchWorkoutResult[]
  meals: SearchMealResult[]
}

export interface FileRecord {
  id: number
  user_id: number
  daily_log_id: number | null
  original_name: string
  stored_name: string
  relative_path: string
  content_type: string
  created_at: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  user: DemoUser
}

const AUTH_TOKEN_STORAGE_KEY = 'fittracklab.authToken'
const CURRENT_USER_STORAGE_KEY = 'fittracklab.currentUser'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

type RequestOptions = {
  method?: string
  body?: string
  headers?: HeadersInit
  skipAuthHeader?: boolean
}

export function getStoredDemoUser(): DemoUser | null {
  const value = localStorage.getItem(CURRENT_USER_STORAGE_KEY)

  if (!value) {
    return null
  }

  try {
    return JSON.parse(value) as DemoUser
  } catch {
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY)
    return null
  }
}

export function storeDemoUser(user: DemoUser): void {
  localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user))
}

export function clearStoredDemoUser(): void {
  localStorage.removeItem(CURRENT_USER_STORAGE_KEY)
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
}

export function getApiBaseUrl(): string {
  return API_BASE_URL
}

export function getStoredAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
}

async function requestJson<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')

  const storedToken = getStoredAuthToken()
  if (storedToken && !options.skipAuthHeader && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${storedToken}`)
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

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await requestJson<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    skipAuthHeader: true,
  })

  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, response.access_token)
  storeDemoUser(response.user)
  return response
}

export function getCurrentUser(): Promise<DemoUser> {
  return requestJson<DemoUser>('/api/auth/me')
}

export async function logout(): Promise<void> {
  try {
    await requestJson<{ message: string }>('/api/auth/logout', {
      method: 'POST',
    })
  } finally {
    clearStoredDemoUser()
  }
}

export function getDailyLogs(): Promise<DailyLog[]> {
  return requestJson<DailyLog[]>('/api/daily-logs')
}

export function createDailyLog(payload: DailyLogCreateInput): Promise<DailyLog> {
  return requestJson<DailyLog>('/api/daily-logs', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getDailyLogDetail(logId: number): Promise<DailyLogDetail> {
  return requestJson<DailyLogDetail>(`/api/daily-logs/${logId}`)
}

export function createWorkout(logId: number, payload: WorkoutCreateInput): Promise<WorkoutEntry> {
  return requestJson<WorkoutEntry>(`/api/daily-logs/${logId}/workouts`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function createMeal(logId: number, payload: MealCreateInput): Promise<MealEntry> {
  return requestJson<MealEntry>(`/api/daily-logs/${logId}/meals`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function searchRecords(query: string): Promise<SearchResults> {
  const params = new URLSearchParams({ query })
  return requestJson<SearchResults>(`/api/search?${params.toString()}`)
}

export function getFiles(): Promise<FileRecord[]> {
  return requestJson<FileRecord[]>('/api/files')
}

export function getDownloadUrl(filename: string): string {
  const params = new URLSearchParams({ filename })
  return `${API_BASE_URL}/api/files/download?${params.toString()}`
}

export async function downloadFile(filename: string): Promise<void> {
  const headers = new Headers()
  const storedToken = getStoredAuthToken()

  if (storedToken) {
    headers.set('Authorization', `Bearer ${storedToken}`)
  }

  const response = await fetch(getDownloadUrl(filename), { headers })

  if (!response.ok) {
    let detail = `Download failed with status ${response.status}`

    try {
      const errorData = (await response.json()) as { detail?: string }
      if (errorData.detail) {
        detail = errorData.detail
      }
    } catch {
      // Ignore non-JSON download errors.
    }

    throw new Error(detail)
  }

  const blob = await response.blob()
  const objectUrl = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = objectUrl
  anchor.download = filename.split('/').pop() ?? filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(objectUrl)
}

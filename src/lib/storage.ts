export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage unavailable (private browsing, quota) — fail silently for this prototype
  }
}

export const STORAGE_KEYS = {
  notes: 'motion:notes',
  theme: 'motion:theme',
  viewMode: 'motion:view-mode',
  sortMode: 'motion:sort-mode',
  auth: 'motion:auth',
  seeded: 'motion:seeded-v1',
} as const

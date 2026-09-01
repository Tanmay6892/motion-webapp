import { useCallback, useEffect, useState } from 'react'
import { readStorage, writeStorage, STORAGE_KEYS } from '@/lib/storage'
import type { ThemePreference } from '@/lib/types'

function resolveTheme(pref: ThemePreference): 'light' | 'dark' {
  if (pref === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }
  return pref
}

export function useTheme() {
  const [preference, setPreferenceState] = useState<ThemePreference>(() =>
    readStorage(STORAGE_KEYS.theme, 'dark' as ThemePreference),
  )

  useEffect(() => {
    const apply = () => {
      const resolved = resolveTheme(preference)
      document.documentElement.classList.toggle('dark', resolved === 'dark')
    }
    apply()

    if (preference === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: dark)')
      media.addEventListener('change', apply)
      return () => media.removeEventListener('change', apply)
    }
  }, [preference])

  const setPreference = useCallback((pref: ThemePreference) => {
    setPreferenceState(pref)
    writeStorage(STORAGE_KEYS.theme, pref)
  }, [])

  return { preference, setPreference, resolved: resolveTheme(preference) }
}

import * as React from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { MobileNav } from '@/components/layout/MobileNav'
import type { AppView, ThemePreference, User } from '@/lib/types'

interface AppShellProps {
  active: AppView
  onNavigate: (view: AppView) => void
  counts: Record<AppView, number>
  theme: ThemePreference
  onThemeChange: (pref: ThemePreference) => void
  onOpenSettings: () => void
  user: User
  onLogout: () => void
  children: React.ReactNode
}

export function AppShell({
  active,
  onNavigate,
  counts,
  theme,
  onThemeChange,
  onOpenSettings,
  user,
  onLogout,
  children,
}: AppShellProps) {
  return (
    <div className="flex h-svh w-full overflow-hidden bg-bg text-text">
      <Sidebar
        active={active}
        onNavigate={onNavigate}
        counts={counts}
        theme={theme}
        onThemeChange={onThemeChange}
        onOpenSettings={onOpenSettings}
        user={user}
        onLogout={onLogout}
      />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <MobileNav
          active={active}
          onNavigate={onNavigate}
          counts={counts}
          theme={theme}
          onThemeChange={onThemeChange}
          onOpenSettings={onOpenSettings}
          user={user}
          onLogout={onLogout}
        />
        <main className="flex flex-1 flex-col overflow-y-auto scrollbar-thin">{children}</main>
      </div>
    </div>
  )
}

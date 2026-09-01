import { Moon, Settings as SettingsIcon, Sun, Laptop } from 'lucide-react'
import { NavLinks } from '@/components/layout/NavLinks'
import { UserMenu } from '@/components/layout/UserMenu'
import { ThemeMenu } from '@/components/layout/ThemeMenu'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import type { AppView, ThemePreference, User } from '@/lib/types'

interface SidebarProps {
  active: AppView
  onNavigate: (view: AppView) => void
  counts: Record<AppView, number>
  theme: ThemePreference
  onThemeChange: (pref: ThemePreference) => void
  onOpenSettings: () => void
  user: User
  onLogout: () => void
}

const themeIcon: Record<ThemePreference, React.ReactNode> = {
  light: <Sun className="h-4 w-4" />,
  dark: <Moon className="h-4 w-4" />,
  system: <Laptop className="h-4 w-4" />,
}

export function Sidebar({
  active,
  onNavigate,
  counts,
  theme,
  onThemeChange,
  onOpenSettings,
  user,
  onLogout,
}: SidebarProps) {
  return (
    <aside className="hidden h-full w-64 shrink-0 flex-col border-r border-border bg-sidebar md:flex">
      <div className="flex items-center gap-2 px-5 py-5">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-sm font-semibold text-accent-foreground">
          M
        </span>
        <span className="text-lg font-semibold tracking-tight text-text">Motion</span>
      </div>

      <div className="flex flex-1 flex-col justify-between overflow-y-auto px-3 pb-3">
        <div className="flex flex-col gap-4">
          <NavLinks active={active} onNavigate={onNavigate} counts={counts} />

          <Separator />

          <div className="flex flex-col gap-0.5">
            <ThemeMenu
              value={theme}
              onChange={onThemeChange}
              trigger={
                <Button
                  variant="ghost"
                  className="justify-start gap-2.5 px-2.5 text-muted hover:text-text"
                >
                  {themeIcon[theme]} Theme
                </Button>
              }
            />
            <Button
              variant="ghost"
              className="justify-start gap-2.5 px-2.5 text-muted hover:text-text"
              onClick={onOpenSettings}
            >
              <SettingsIcon className="h-4 w-4" /> Settings
            </Button>
          </div>
        </div>

        <div className="mt-4 border-t border-border-subtle pt-3">
          <UserMenu
            user={user}
            theme={theme}
            onThemeChange={onThemeChange}
            onOpenSettings={onOpenSettings}
            onLogout={onLogout}
          />
        </div>
      </div>
    </aside>
  )
}

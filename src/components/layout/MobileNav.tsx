import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Menu, X, Moon, Settings as SettingsIcon, Sun, Laptop } from 'lucide-react'
import { NavLinks } from '@/components/layout/NavLinks'
import { UserMenu } from '@/components/layout/UserMenu'
import { ThemeMenu } from '@/components/layout/ThemeMenu'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { AppView, ThemePreference, User } from '@/lib/types'

interface MobileNavProps {
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

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function MobileNav({
  active,
  onNavigate,
  counts,
  theme,
  onThemeChange,
  onOpenSettings,
  user,
  onLogout,
}: MobileNavProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <header className="flex items-center justify-between border-b border-border bg-sidebar px-4 py-3 md:hidden">
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-md text-muted hover:bg-surface-hover hover:text-text"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-base font-semibold tracking-tight text-text">Motion</span>
        <Avatar className="h-8 w-8">
          {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
          <AvatarFallback className="text-xs">{initials(user.name)}</AvatarFallback>
        </Avatar>
      </header>

      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:duration-200" />
          <DialogPrimitive.Content className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[80vw] flex-col border-r border-border bg-sidebar p-0 outline-none data-[state=open]:animate-slide-in-left">
            <DialogPrimitive.Title className="sr-only">Navigation</DialogPrimitive.Title>
            <div className="flex items-center justify-between px-5 py-5">
              <span className="text-lg font-semibold tracking-tight text-text">Motion</span>
              <DialogPrimitive.Close className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-surface-hover hover:text-text">
                <X className="h-4 w-4" />
              </DialogPrimitive.Close>
            </div>

            <div className="flex flex-1 flex-col justify-between overflow-y-auto px-3 pb-3">
              <div className="flex flex-col gap-4">
                <NavLinks
                  active={active}
                  onNavigate={(v) => {
                    onNavigate(v)
                    setOpen(false)
                  }}
                  counts={counts}
                />
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
                    onClick={() => {
                      onOpenSettings()
                      setOpen(false)
                    }}
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
                  onOpenSettings={() => {
                    onOpenSettings()
                    setOpen(false)
                  }}
                  onLogout={onLogout}
                />
              </div>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  )
}

import { Sun, Moon, Laptop } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import type { ThemePreference } from '@/lib/types'

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  theme: ThemePreference
  onThemeChange: (pref: ThemePreference) => void
}

const options: { value: ThemePreference; label: string; icon: React.ReactNode }[] = [
  { value: 'light', label: 'Light', icon: <Sun className="h-4 w-4" /> },
  { value: 'dark', label: 'Dark', icon: <Moon className="h-4 w-4" /> },
  { value: 'system', label: 'System', icon: <Laptop className="h-4 w-4" /> },
]

export function SettingsDialog({ open, onOpenChange, theme, onThemeChange }: SettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Prototype preferences for this session.</DialogDescription>
        </DialogHeader>

        <div className="mt-5 flex flex-col gap-2">
          <span className="text-xs font-medium text-muted">Appearance</span>
          <div className="flex gap-2">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onThemeChange(opt.value)}
                className={cn(
                  'flex flex-1 flex-col items-center gap-2 rounded-lg border border-border px-3 py-3 text-xs font-medium text-muted transition-colors hover:bg-surface-hover',
                  theme === opt.value && 'border-accent bg-selected text-text',
                )}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-border-subtle bg-surface-hover px-4 py-3 text-xs leading-relaxed text-muted">
          Motion is a visual prototype — account, sync, and notification settings aren't
          wired up yet.
        </div>
      </DialogContent>
    </Dialog>
  )
}

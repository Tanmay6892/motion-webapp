import { NotebookText, Archive, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AppView } from '@/lib/types'

interface NavLinksProps {
  active: AppView
  onNavigate: (view: AppView) => void
  counts: Record<AppView, number>
  className?: string
}

const items: { id: AppView; label: string; icon: React.ReactNode }[] = [
  { id: 'notes', label: 'Notes', icon: <NotebookText className="h-4 w-4" /> },
  { id: 'archive', label: 'Archive', icon: <Archive className="h-4 w-4" /> },
  { id: 'trash', label: 'Trash', icon: <Trash2 className="h-4 w-4" /> },
]

export function NavLinks({ active, onNavigate, counts, className }: NavLinksProps) {
  return (
    <nav className={cn('flex flex-col gap-0.5', className)} aria-label="Primary">
      {items.map((item) => {
        const isActive = active === item.id
        return (
          <button
            key={item.id}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onNavigate(item.id)}
            className={cn(
              'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors duration-150',
              isActive
                ? 'bg-selected text-accent'
                : 'text-muted hover:bg-surface-hover hover:text-text',
            )}
          >
            {item.icon}
            <span className="flex-1 text-left">{item.label}</span>
            {counts[item.id] > 0 && item.id !== 'notes' && (
              <span className="text-xs text-faint">{counts[item.id]}</span>
            )}
          </button>
        )
      })}
    </nav>
  )
}

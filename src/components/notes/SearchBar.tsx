import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function SearchBar({ value, onChange, className }: SearchBarProps) {
  return (
    <div className={cn('relative w-full max-w-sm', className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search your notes"
        aria-label="Search your notes"
        className="h-9 w-full rounded-md border border-border bg-input pl-9 pr-9 text-sm text-text placeholder:text-faint transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded text-faint hover:text-text"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}
